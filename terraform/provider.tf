provider "aws" {
  region  = var.region
  version = "~> 3.0"
}

provider "aws" {
  alias   = "us-east-1"
  region  = "us-east-1"
  version = "~> 3.0"
}

terraform {
  backend "s3" {
    bucket = "otfbm-infra"
    key    = "terraform/otfbm.tfstate"
    region = "us-west-2"

    # TODO FIXME kms_key_id for encrypting bucket state and encrypt=true
    # TODO FIXME ACLs and IAM for protecting/exposing state
  }
}

locals {
  # This should match bucket in the S3 backend above.
  infra-bucket = "otfbm-infra"
}

