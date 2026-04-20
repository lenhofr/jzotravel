output "terraform_role_arn" {
  description = "Set this as AWS_TERRAFORM_ROLE_ARN in GitHub Actions secrets"
  value       = aws_iam_role.terraform.arn
}

output "deploy_role_arn" {
  description = "Set as AWS_DEPLOY_ROLE_ARN after enabling create_deploy_role"
  value       = var.create_deploy_role ? aws_iam_role.deploy[0].arn : null
}
