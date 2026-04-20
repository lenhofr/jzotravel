variable "bucket_name" {
  type = string
}

resource "aws_s3_bucket" "site" {
  bucket        = var.bucket_name
  force_destroy = false
}

resource "aws_s3_bucket_versioning" "site" {
  bucket = aws_s3_bucket.site.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "site" {
  bucket = aws_s3_bucket.site.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "site" {
  bucket = aws_s3_bucket.site.id
  rule { object_ownership = "BucketOwnerPreferred" }
}

output "bucket_arn" {
  value = aws_s3_bucket.site.arn
}

output "bucket_name" {
  value = aws_s3_bucket.site.id
}

output "bucket_regional_domain_name" {
  description = "Regional S3 domain name — use as CloudFront origin"
  value       = aws_s3_bucket.site.bucket_regional_domain_name
  depends_on  = [aws_s3_bucket.site]
}
