data "cloudflare_workers_kv_namespace" "content" {
  account_id   = local.account_id
  namespace_id = local.content_kv_id
}

data "cloudflare_workers_kv_namespace" "photo" {
  account_id   = local.account_id
  namespace_id = local.photo_kv_id
}
