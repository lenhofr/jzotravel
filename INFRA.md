# jzotravel — Infrastructure Runbook

Static SPA hosted on S3 + CloudFront, using the same pattern as `mbm-ui`.
Domain is driven by a Terraform variable so it can be swapped without touching resource logic.

---

## Architecture

```
Browser → CloudFront (HTTPS, www→apex redirect)
               ↓ OAC (sigv4)
          S3 bucket (private, versioned, AES-256)
```

CloudFront handles:
- HTTPS termination (ACM cert, us-east-1)
- SPA routing: 403/404 → `/index.html` (required for client-side routing)
- `www → apex` redirect via CloudFront Function
- Access logs → separate S3 log bucket (90-day lifecycle)

Starts as a pure static site. When dynamic features are needed, add:
- `backend_api.tf` — API Gateway + Lambda functions
- `cognito.tf` — Cognito user pool + app client (if auth is needed)

See `mbm-ui` for the reference implementation of both.

---

## Domain Flexibility

The domain is a single Terraform variable. To point the site at a different domain:

1. Register the domain and create/import a Route53 hosted zone for it.
2. Update `var.domain_name` in `terraform.tfvars` (or your CI env).
3. Run `terraform plan` — the ACM cert, CloudFront aliases, and Route53 records all derive from the variable.
4. `terraform apply` — ACM DNS validation auto-completes via the Route53 records Terraform creates.

> If you buy `jzotravel.world`, set `domain_name = "jzotravel.world"`.
> If you later switch to `jzotravel.com`, update the variable and re-apply. You'll need a hosted zone for the new domain first.

---

## Terraform File Layout

```
terraform/
├── backend.tf                    # Remote state: shared S3 bucket
├── variables.tf                  # domain_name, aws_region, bucket_name
├── main.tf                       # S3 site module, CloudFront distribution, log bucket
├── acm.tf                        # ACM cert (us-east-1 provider), DNS validation records, www→apex CF Function
├── route53.tf                    # Hosted zone data source, A/AAAA alias records
└── outputs.tf                    # CloudFront domain name, distribution ID, hosted zone ID
└── modules/
    └── s3-static-site/           # Reusable: private S3 bucket, versioning, encryption, OAC-compatible settings
terraform/github-actions-oidc/    # One-time bootstrap: OIDC IAM roles for GitHub Actions
.github/workflows/
├── terraform-plan.yml            # PR: fmt, init, validate, plan → PR comment
└── deploy.yml                    # main: terraform apply → npm build → s3 sync → CF invalidation
```

---

## Key Variables (`variables.tf`)

| Variable | Default | Notes |
|---|---|---|
| `domain_name` | `"jzotravel.world"` | Change to swap domains — all resources derive from this |
| `aws_region` | `"us-east-1"` | CloudFront + ACM must be us-east-1 |
| `bucket_name` | `"jzotravel-site-217354297026"` | Globally unique; account ID suffix guarantees it |

---

## Bootstrapping

The domain is registered, the hosted zone exists (confirmed via AWS CLI), and the zone is clean (only NS + SOA records). No existing CloudFront distribution — clean `terraform apply`, nothing to import.

Use a `data` source for the hosted zone rather than creating a new one:

```hcl
data "aws_route53_zone" "site" {
  name         = "jzotravel.world."
  private_zone = false
}
```

Hosted zone ID: `Z04923882SLAM47D5LCEG`
Name servers (already wired by Route53 Registrar — no NS update needed):
- ns-1967.awsdns-53.co.uk
- ns-1502.awsdns-59.org
- ns-577.awsdns-08.net
- ns-441.awsdns-55.com

**First apply steps:**
1. Bootstrap OIDC IAM roles locally (see CI/CD section — one-time only).
2. Push to `main` — GitHub Actions runs `terraform apply` automatically.
3. ACM cert issues and DNS validation records are written by Terraform; CloudFront distribution is created.
4. Re-apply OIDC bootstrap with `create_deploy_role=true` after bucket + distribution IDs are known.
5. Site assets are synced to S3 and CloudFront is invalidated automatically on every subsequent push to `main`.

---

## CI/CD (GitHub Actions)

All infrastructure and deployments are managed via GitHub Actions — no manual `terraform apply` or `aws s3 sync` after initial bootstrap.

### Two-workflow pattern (from `mbm-ui`)

| Workflow | Trigger | What it does |
|---|---|---|
| `terraform-plan.yml` | PR → `main` (terraform changes) | `fmt` check, `init`, `validate`, `plan` — posts plan as PR comment |
| `deploy.yml` | Push to `main` | `terraform apply`, `npm build`, `s3 sync`, CloudFront invalidation |

### AWS Authentication — OIDC (no long-lived keys)

Uses GitHub OIDC to assume an IAM role — no `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` secrets needed.

The GitHub OIDC provider already exists in the account:
`arn:aws:iam::217354297026:oidc-provider/token.actions.githubusercontent.com`

Two IAM roles are needed (bootstrapped once via the `github-actions-oidc` Terraform module — see `bstri/infra/terraform/github-actions-oidc/` for the reusable module):

| Role | Policy | Used by |
|---|---|---|
| `jzotravel-github-actions-terraform` | `AdministratorAccess` | `terraform-plan.yml` + `deploy.yml` (Terraform steps) |
| `jzotravel-github-actions-deploy` | S3 read/write + CloudFront invalidation | `deploy.yml` (sync + invalidate steps) |

**Bootstrap sequence (one-time, run locally):**

```bash
# From terraform/github-actions-oidc/
terraform init
terraform apply \
  -var="github_owner=<your-github-org-or-user>" \
  -var="github_repo=jzotravel" \
  -var="project=jzotravel" \
  -var="existing_oidc_provider_arn=arn:aws:iam::217354297026:oidc-provider/token.actions.githubusercontent.com" \
  -var="create_deploy_role=false"   # enable after first apply creates bucket + distribution
```

After the main infra exists, re-apply with `create_deploy_role=true` and pass the bucket name and distribution ID.

**GitHub secret to set** (one secret, not credentials):
```
AWS_TERRAFORM_ROLE_ARN = arn:aws:iam::217354297026:role/jzotravel-github-actions-terraform
```

### Workflow permissions required

```yaml
permissions:
  contents: read
  id-token: write      # required for OIDC token exchange
  pull-requests: write # required to post plan/apply comments
```

---

## Remote State

Uses the shared Terraform state bucket (same account, confirmed exists):

```hcl
backend "s3" {
  bucket = "tf-state-common-217354297026-us-east-1"
  key    = "jzotravel/terraform.tfstate"
  region = "us-east-1"
}
```

No DynamoDB lock table for this project — only `bstri-prod-tf-lock` exists in the account and other projects (`mbm-ui`, `jf-com`) don't use one. Consistent with that pattern, omit `dynamodb_table` from the backend config.

Existing state keys in the shared bucket for reference:
```
bstri/terraform.tfstate
jf-com/terraform.tfstate
mbm-ui/terraform.tfstate
```

---

## Open Questions / TODOs

- [x] Register `jzotravel.world` — done, hosted zone `Z04923882SLAM47D5LCEG` active
- [ ] SES when ready: add SES domain identity + DKIM CNAME records to `route53.tf` (see `mbm-ui` pattern)
- [ ] When going dynamic: add `backend_api.tf` (API Gateway + Lambda) and optionally `cognito.tf` (auth)

---

## Reference: MBM Pattern (source of truth)

`/Users/robl/dev/static/mbm-ui/terraform/` is the reference implementation.
Key files to copy/adapt: `main.tf`, `acm.tf`, `route53.tf`, `modules/s3-static-site/main.tf`, `backend.tf`.
