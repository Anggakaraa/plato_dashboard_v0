terraform {
  backend "gcs" {
    bucket  = "terraform-plato-dashboard-states"
    prefix  = "states"
  }
}

provider "google" {
  project = var.project-id
  region  = var.app-region
  zone    = var.app-region-zone
}

provider "google-beta" {
  project     = var.project-id
  region      = var.app-region
  zone        = var.app-region-zone
}