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

variable "worker_script_path" {
  type        = string
  description = "Path to the built Worker bundle for this deployment."
  default     = "../../dist/dev/entry.js"
}

variable "release_sha" {
  type        = string
  description = "Git SHA of the release artifact."
  default     = null
}

variable "release_key" {
  type        = string
  description = "Artifact storage key of the release bundle."
  default     = null
}
