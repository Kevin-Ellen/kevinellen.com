
# 1. Create the Worker
resource "cloudflare_worker" "site" {
  account_id = local.account_id
  name       = local.worker_name
}

# 2. Upload a new Worker version and its assets
resource "cloudflare_worker_version" "site" {
  account_id = local.account_id
  worker_id  = cloudflare_worker.site.id

  compatibility_date = local.compatibility_date
  main_module        = "entry.js"

  modules = [{
    name         = "entry.js"
    content_file = "${path.root}/../dist/worker/entry.js"
    content_type = "application/javascript+module"
  }]

  assets = {
    directory = "${path.root}/../dist/static"

    config = {
      run_worker_first = false
    }
  }

  bindings = [
    {
      name         = "CONTENT_KV"
      type         = "kv_namespace"
      namespace_id = data.cloudflare_workers_kv_namespace.content.id
    },
    {
      name         = "PHOTO_KV"
      type         = "kv_namespace"
      namespace_id = data.cloudflare_workers_kv_namespace.photo.id
    },
    {
      name = "ASSETS"
      type = "assets"
    },
    {
      name = "DOMAIN"
      type = "plain_text"
      text = "https://${local.hostname}"
    },
    {
      name = "IMAGES_ACCOUNT_HASH"
      type = "plain_text"
      text = local.images_account_hash
    },
    {
      name = "INSPECT_ENABLED"
      type = "plain_text"
      text = "false"
    },
    {
      name = "DEPLOYMENT_ENVIRONMENT"
      type = "plain_text"
      text = local.environment
    },
  ]

  cache_options = {
    enabled = true
  }
}

# 3. Activate the uploaded version
resource "cloudflare_workers_deployment" "site" {
  account_id  = local.account_id
  script_name = cloudflare_worker.site.name

  strategy = "percentage"

  versions = [{
    version_id = cloudflare_worker_version.site.id
    percentage = 100
  }]
}

# 4. Attach the primary domain after deployment
resource "cloudflare_workers_custom_domain" "site" {
  account_id = local.account_id
  zone_id    = data.cloudflare_zone.site.id
  hostname   = local.hostname
  service    = cloudflare_worker.site.name

  depends_on = [
    cloudflare_workers_deployment.site
  ]
}

# 5. Attach www to the production Worker
resource "cloudflare_workers_custom_domain" "www" {
  count = local.environment == "production" ? 1 : 0

  account_id = local.account_id
  zone_id    = data.cloudflare_zone.site.id
  hostname   = "www.${local.zone_name}"
  service    = cloudflare_worker.site.name

  depends_on = [
    cloudflare_workers_deployment.site
  ]
}
