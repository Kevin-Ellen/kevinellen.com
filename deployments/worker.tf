resource "cloudflare_workers_script" "site" {
  account_id  = local.account_id
  script_name = local.worker_name

  main_module    = "entry.js"
  content_file   = "${path.root}/../dist/worker/entry.js"
  content_sha256 = filesha256("${path.root}/../dist/worker/entry.js")

  compatibility_date = local.compatibility_date

  assets = {
    directory = "${path.root}/../dist/static"
    config = {
      run_worker_first = true
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
    }
  ]

  cache_options = {
    enabled = true
  }
}

resource "cloudflare_workers_custom_domain" "site" {
  account_id = local.account_id
  zone_id    = data.cloudflare_zone.site.id
  hostname   = local.hostname
  service    = cloudflare_workers_script.site.script_name
}
