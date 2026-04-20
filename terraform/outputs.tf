output "cloudfront_domain_name" {
  description = "CloudFront distribution domain — use to verify before DNS cutover"
  value       = aws_cloudfront_distribution.cdn.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — used for cache invalidation in CI"
  value       = aws_cloudfront_distribution.cdn.id
}

output "site_bucket" {
  description = "S3 bucket name for site assets"
  value       = module.site.bucket_name
}

output "hosted_zone_id" {
  description = "Route53 hosted zone ID"
  value       = data.aws_route53_zone.site.zone_id
}
