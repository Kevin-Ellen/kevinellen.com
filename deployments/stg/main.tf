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

  account_id           = var.account_id
  zone_id              = var.zone_id
  zone_name            = var.zone_name
  project_name         = var.project_name
  instance_name        = var.instance_name
  subdomain            = var.subdomain
  worker_script_path   = var.worker_script_path
  static_dir           = var.static_dir
  compatibility_date   = var.compatibility_date
  release_sha          = var.release_sha
  release_key          = var.release_key
  images_delivery_hash = var.images_delivery_hash
  photos_namespace_id  = var.photos_namespace_id
}
