#forcing commit comment - 6
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.11"
    }
  }
}

locals {
  worker_name = "${var.project_name}-${var.instance_name}"

  kv_namespaces = {
    content  = "${var.project_name}-content-${var.instance_name}"
    photos   = "${var.project_name}-photos-${var.instance_name}"
    articles = "${var.project_name}-articles-${var.instance_name}"
    journals = "${var.project_name}-journals-${var.instance_name}"
  }

  route_patterns = var.instance_name == "prod" ? [
    "${var.zone_name}/*",
    "www.${var.zone_name}/*"
    ] : [
    "${var.instance_name}.${var.zone_name}/*"
  ]
}

resource "cloudflare_workers_kv_namespace" "content" {
  account_id = var.account_id
  title      = local.kv_namespaces.content
}

resource "cloudflare_workers_kv_namespace" "photos" {
  account_id = var.account_id
  title      = local.kv_namespaces.photos
}

resource "cloudflare_workers_kv_namespace" "articles" {
  account_id = var.account_id
  title      = local.kv_namespaces.articles
}

resource "cloudflare_workers_kv_namespace" "journals" {
  account_id = var.account_id
  title      = local.kv_namespaces.journals
}

resource "cloudflare_worker" "site" {
  account_id = var.account_id
  name       = local.worker_name
}

resource "cloudflare_worker_version" "site" {
  account_id         = var.account_id
  worker_id          = cloudflare_worker.site.id
  compatibility_date = var.compatibility_date

  main_module = "entry.js"

  modules = [
    {
      name         = "entry.js"
      content_file = var.worker_script_path
      content_type = "application/javascript+module"
    }
  ]

  bindings = [
    {
      type         = "kv_namespace"
      name         = "KV_CONTENT"
      namespace_id = cloudflare_workers_kv_namespace.content.id
    },
    {
      type         = "kv_namespace"
      name         = "KV_PHOTOS"
      namespace_id = cloudflare_workers_kv_namespace.photos.id
    },
    {
      type         = "kv_namespace"
      name         = "KV_ARTICLES"
      namespace_id = cloudflare_workers_kv_namespace.articles.id
    },
    {
      type         = "kv_namespace"
      name         = "KV_JOURNALS"
      namespace_id = cloudflare_workers_kv_namespace.journals.id
    }
  ]
}

resource "cloudflare_workers_deployment" "site" {
  account_id  = var.account_id
  script_name = local.worker_name
  strategy    = "percentage"

  versions = [{
    version_id = cloudflare_worker_version.site.id
    percentage = 100
  }]
}

resource "cloudflare_workers_route" "site" {
  for_each = toset(local.route_patterns)

  zone_id = var.zone_id
  pattern = each.value
  script  = local.worker_name

  depends_on = [cloudflare_workers_deployment.site]
}

resource "cloudflare_dns_record" "worker_subdomain" {
  count = var.instance_name == "prod" ? 0 : 1

  zone_id = var.zone_id
  name    = var.subdomain
  type    = "A"
  content = "192.0.2.1"
  proxied = true
  ttl     = 1
}
