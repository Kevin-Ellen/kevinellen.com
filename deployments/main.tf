terraform {
  required_version = ">= 1.13.0, < 1.14.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.18"
    }
  }
}

provider "cloudflare" {}

locals {
  package_config = jsondecode(
    file("${path.root}/../package.json")
  )

  project_name = local.package_config.name
  zone_name    = local.package_config["cf-config"].zone
  account_id   = local.package_config["cf-config"]["account-id"]

  environment = var.environment
  worker_name = "${replace(local.project_name, ".", "-")}-${local.environment}"

  hostname = local.environment == "production" ? local.zone_name : "${local.environment}.${local.zone_name}"

  content_kv_id = local.package_config["cf-config"].kv.content
  photo_kv_id   = local.package_config["cf-config"].kv.photo

  compatibility_date = local.package_config["cf-config"]["compatibility-date"]

  images_account_hash = local.package_config["cf-config"]["images-account-hash"]
}

variable "environment" {
  description = "Deployment environment"
  type        = string

  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "Environment must be staging or production."
  }
}
