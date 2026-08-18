resource "aws_acm_certificate" "site_cert" {
  provider                  = aws.us_east_1
  domain_name               = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.site_cert.domain_validation_options : dvo.domain_name => dvo
  }

  zone_id = data.aws_route53_zone.site.zone_id
  name    = each.value.resource_record_name
  type    = each.value.resource_record_type
  ttl     = 60
  records = [each.value.resource_record_value]
}

resource "aws_acm_certificate_validation" "site_cert_validation" {
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.site_cert.arn

  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}

# Viewer-request handler for the distribution. CloudFront permits exactly ONE
# viewer-request function per cache behavior, so the www redirect and the
# directory-index rewrite have to live in the same function — attaching a second
# function_association fails at apply time.
resource "aws_cloudfront_function" "redirect_www" {
  name = "jzotravel-redirect-www-to-apex"
  # Deliberately left on 1.0. The rewrite below avoids String.prototype.endsWith,
  # which 1.0 does not reliably provide, so there is nothing here that needs 2.0
  # — and bumping the runtime of a redirect that already works in production
  # buys risk without buying anything.
  runtime = "cloudfront-js-1.0"
  publish = true

  code = <<EOF
function handler(event) {
  var request = event.request;
  var host = request.headers['host'] && request.headers['host'].value;
  var uri = request.uri || '/';

  // www -> apex, before any rewriting, so the address bar ends up showing the
  // URL the visitor actually asked for rather than an internal index.html path.
  if (host && host.toLowerCase().startsWith('www.')) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        'location': { value: 'https://' + host.replace(/^www\./i, '') + uri }
      }
    };
  }

  // /admin has no route in the SPA, so without this it falls through the 404
  // handler to index.html and React Router renders a blank page. Send it to the
  // directory form, which the rewrite below then resolves to the Decap bundle.
  if (uri === '/admin') {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        'location': { value: 'https://' + host + '/admin/' }
      }
    };
  }

  // default_root_object only ever applies to the distribution root, so a
  // request for '/admin/' asks S3 for the key 'admin/', 404s, and is served
  // index.html at 200 by custom_error_response — meaning /admin/ renders the
  // travel site instead of the CMS. Map any directory-style URI onto its
  // index.html. Paths without a trailing slash are left alone so client-side
  // routes like /blog/<slug> still fall through to the SPA.
  if (uri.slice(-1) === '/') {
    request.uri = uri + 'index.html';
  }

  return request;
}
EOF
}
