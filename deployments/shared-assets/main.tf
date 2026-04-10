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

resource "cloudflare_workers_kv_namespace" "photos" {
  account_id = var.account_id
  title      = "${var.project_name}-photos"
}

output "photos_namespace_id" {
  value       = cloudflare_workers_kv_namespace.photos.id
  description = "Shared Cloudflare KV namespace ID for photo metadata."
}
