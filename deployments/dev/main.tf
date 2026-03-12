terraform {
  required_version = "~> 1.7"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.11"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

module "site_app" {
  source = "../../infra"

  account_id         = var.account_id
  zone_id            = var.zone_id
  zone_name          = var.zone_name
  project_name       = var.project_name
  instance_name      = "dev"
  subdomain          = "dev"
  worker_script_path = "../../dist/dev/entry.js"
  compatibility_date = var.compatibility_date
}
