locals {
  # OIDC provider already exists in this account — reuse it
  oidc_provider_arn = "arn:aws:iam::217354297026:oidc-provider/token.actions.githubusercontent.com"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = "sts:AssumeRoleWithWebIdentity"
      Principal = {
        Federated = local.oidc_provider_arn
      }
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:${var.github_owner}/${var.github_repo}:*"
        }
      }
    }]
  })
}

# Terraform role — AdministratorAccess for plan + apply in CI
resource "aws_iam_role" "terraform" {
  name               = "jzotravel-github-actions-terraform"
  assume_role_policy = local.assume_role_policy
}

resource "aws_iam_role_policy_attachment" "terraform" {
  role       = aws_iam_role.terraform.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

# Deploy role — scoped to S3 sync + CloudFront invalidation only
# Enable after first apply by setting create_deploy_role=true and passing bucket/distribution outputs
resource "aws_iam_role" "deploy" {
  count              = var.create_deploy_role ? 1 : 0
  name               = "jzotravel-github-actions-deploy"
  assume_role_policy = local.assume_role_policy
}

data "aws_iam_policy_document" "deploy" {
  count = var.create_deploy_role ? 1 : 0

  statement {
    sid     = "S3List"
    actions = ["s3:GetBucketLocation", "s3:ListBucket", "s3:ListBucketMultipartUploads"]
    resources = ["arn:aws:s3:::${var.site_bucket_name}"]
  }

  statement {
    sid = "S3Objects"
    actions = [
      "s3:GetObject", "s3:PutObject", "s3:DeleteObject",
      "s3:AbortMultipartUpload", "s3:ListMultipartUploadParts",
    ]
    resources = ["arn:aws:s3:::${var.site_bucket_name}/*"]
  }

  statement {
    sid     = "CloudFrontInvalidation"
    actions = ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation", "cloudfront:ListInvalidations"]
    resources = ["arn:aws:cloudfront::217354297026:distribution/${var.cloudfront_distribution_id}"]
  }
}

resource "aws_iam_policy" "deploy" {
  count  = var.create_deploy_role ? 1 : 0
  name   = "jzotravel-github-actions-deploy"
  policy = data.aws_iam_policy_document.deploy[0].json
}

resource "aws_iam_role_policy_attachment" "deploy" {
  count      = var.create_deploy_role ? 1 : 0
  role       = aws_iam_role.deploy[0].name
  policy_arn = aws_iam_policy.deploy[0].arn
}
