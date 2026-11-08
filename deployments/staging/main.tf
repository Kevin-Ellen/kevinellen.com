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
  instance_name = "staging"
  subdomain     = "staging"
}
