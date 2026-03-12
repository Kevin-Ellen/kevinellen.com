variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

variable "account_id" {
  type = string
}

variable "zone_name" {
  type = string
}

variable "zone_id" {
  type = string
}

variable "project_name" {
  type = string
}

variable "compatibility_date" {
  type = string
}
