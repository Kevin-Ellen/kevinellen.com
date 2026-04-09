resource "cloudflare_ruleset" "photo_path_rewrite" {
  zone_id = var.zone_id
  name    = "${var.project_name}-${var.instance_name}-photo-rewrite"
  kind    = "zone"
  phase   = "http_request_transform"

  rules = [
    {
      ref         = "photo_rewrite"
      description = "Rewrite /photo/<image-id>.<variant> to Cloudflare Images delivery path"
      enabled     = true

      expression = "starts_with(http.request.uri.path, \"/photo/\")"

      action = "rewrite"

      action_parameters = {
        uri = {
          path = {
            expression = "regex_replace(http.request.uri.path, \"^/photo/([^.]+)\\.([^.]+)$\", \"/cdn-cgi/imagedelivery/${var.images_delivery_hash}/${1}/${2}\")"
          }
        }
      }
    }
  ]
}
