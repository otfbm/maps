data "aws_route53_zone" "otfbm" {
  name         = "otfbm.io"
  private_zone = false
}

data "aws_s3_bucket" "infra" {
  bucket = "otfbm-infra"
}
