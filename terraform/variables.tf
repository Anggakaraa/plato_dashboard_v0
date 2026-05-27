locals {
    updated_on    = formatdate("YYYY-MM-DD hh:mm", timestamp())
    team          = "devops"
    subteam       = "developer"
    environment   = terraform.workspace
}

variable "service_account_email" {
  description = "The service account email address with the correct previleges"
  type = string
  default = "devops@plato-dashboard.iam.gserviceaccount.com"
}

variable "project-id"{
  type = string
  default = "plato-dashboard"
}

variable "bucket-state-name" {
  type = string
  default = "app-states"
}

variable "bucket-app-name" {
  type = string
  default = "plato-dashboard-files"
}

variable "app-region" {
  type = string
  default = "europe-west1"
}

variable "app-region-zone" {
  type = string
  default = "europe-west1-a"
}

variable "google-dns-managed-zone-name" {
  type = string
  default = "dashboard"
}

variable "google-dns-record-set-name" {
  type = string
  default = ""
}