# Reserve an external IP
resource "google_compute_global_address" "website" {
  provider = google
  name     = "plato-dashboard-lb-ip-${terraform.workspace}"
}

output "globa-address" {
  value = google_compute_global_address.website.name
}

# Get the managed DNS zone
data "google_dns_managed_zone" "gcp_managed_zone" {
  provider = google
  name     = "${var.google-dns-managed-zone-name}"
}

# Add the IP to the DNS
resource "google_dns_record_set" "website" {
  provider     = google
  name         = "${terraform.workspace == "prod" ? "" : "dev."}${data.google_dns_managed_zone.gcp_managed_zone.dns_name}"
  type         = "A"
  ttl          = 300
  managed_zone = data.google_dns_managed_zone.gcp_managed_zone.name
  rrdatas      = [google_compute_global_address.website.address]
}
