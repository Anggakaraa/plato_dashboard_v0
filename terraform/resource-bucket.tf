# Bucket to store website

resource "google_storage_bucket" "website" {
    name          = "${var.bucket-app-name}-${terraform.workspace}"
    location      = var.app-region
    force_destroy = true
    storage_class = "STANDARD"
    uniform_bucket_level_access = false
    //public_access_prevention = 
    labels = {
      "key" = "value1"
    }
  
    website {
      main_page_suffix = "index.html"
      not_found_page   = "index.html"
    }
    cors {
      origin          = ["*"]
      method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
      response_header = ["*"]
      max_age_seconds = 3600
    }
  }

# Make new objects public
resource "google_storage_default_object_access_control" "website_read" {
  bucket = google_storage_bucket.website.name
  role   = "READER"
  entity = "allUsers"
}