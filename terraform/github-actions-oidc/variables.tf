variable "github_owner" {
  description = "GitHub org or username (e.g. lenhofr)"
  type        = string
  default     = "lenhofr"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "jzotravel"
}

variable "create_deploy_role" {
  description = "Create the scoped deploy role. Enable after first terraform apply creates the bucket and distribution."
  type        = bool
  default     = false
}

variable "site_bucket_name" {
  description = "S3 bucket name from terraform output site_bucket. Required when create_deploy_role=true."
  type        = string
  default     = null
}

variable "cloudfront_distribution_id" {
  description = "CloudFront distribution ID from terraform output cloudfront_distribution_id. Required when create_deploy_role=true."
  type        = string
  default     = null
}
