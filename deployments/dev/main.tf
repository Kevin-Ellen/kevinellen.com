# comment-2
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

module "site_app" {
  source = "../../infra"

  account_id         = var.account_id
  zone_id            = var.zone_id
  zone_name          = var.zone_name
  project_name       = var.project_name
  instance_name      = "dev"
  worker_script_path = var.worker_script_path
  compatibility_date = var.compatibility_date
  subdomain          = "dev"

  release_sha = var.release_sha
  release_key = var.release_key
}
