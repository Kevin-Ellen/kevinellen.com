variable "account_id" {
  type = string
}

variable "zone_id" {
  type = string
}

variable "zone_name" {
  type = string
}

variable "project_name" {
  type = string
}

variable "instance_name" {
  type = string
}

variable "compatibility_date" {
  type = string
}

variable "subdomain" {
  type = string
}

variable "worker_script_path" {
  description = "Absolute or relative path to the Worker entry bundle on disk."
  type        = string
}

variable "release_sha" {
  description = "Git SHA of the release artifact being deployed."
  type        = string
  default     = null
}

variable "release_key" {
  description = "Artifact storage key for the release bundle being deployed."
  type        = string
  default     = null
}
