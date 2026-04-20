variable "domain_name" {
  description = "Primary domain name — all DNS records, ACM cert, and CF aliases derive from this"
  type        = string
  default     = "jzotravel.world"
}

variable "aws_region" {
  description = "AWS region for non-global resources"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "S3 bucket name for static site assets"
  type        = string
  default     = "jzotravel-site-217354297026"
}
