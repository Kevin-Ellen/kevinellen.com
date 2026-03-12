terraform {
  required_version = ">= 1.5.7, < 2.0.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.11"
    }
  }
}

provider "cloudflare" {}
resource "cloudflare_r2_bucket" "worker_artifacts" {
  account_id = var.account_id
  name       = var.artifacts_bucket_name
}
