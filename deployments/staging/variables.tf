variable "account_id" {
  description = "Cloudflare account ID."
  type        = string
}

variable "zone_id" {
  description = "Cloudflare zone ID."
  type        = string
}

variable "zone_name" {
  description = "Cloudflare zone name."
  type        = string
}

variable "project_name" {
  description = "Project identifier."
  type        = string
}

variable "compatibility_date" {
  description = "Cloudflare Workers compatibility date."
  type        = string
}
