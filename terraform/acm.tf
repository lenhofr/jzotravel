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

resource "aws_cloudfront_function" "redirect_www" {
  name    = "jzotravel-redirect-www-to-apex"
  runtime = "cloudfront-js-1.0"
  publish = true

  code = <<EOF
function handler(event) {
  var request = event.request;
  var host = request.headers['host'] && request.headers['host'].value;
  if (host && host.toLowerCase().startsWith('www.')) {
    var uri = request.uri || '/';
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        'location': { value: 'https://' + host.replace(/^www\./i, '') + uri }
      }
    };
  }
  return request;
}
EOF
}
