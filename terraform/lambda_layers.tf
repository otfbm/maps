resource "aws_s3_bucket_object" "preload-lambda-layer" {
  bucket = data.aws_s3_bucket.infra.bucket
  key = local.lambda-layer-preload-s3-key
  source = local.lambda-layer-preload-filename
  content_type = "application/zip"
}

resource "aws_lambda_layer_version" "preload-lambda-layer" {
  s3_bucket   = data.aws_s3_bucket.infra.bucket
  s3_key      = local.lambda-layer-preload-s3-key
  layer_name  = "preload"
  description = "A layer that contains the necessary packages for the preloading lambda functions"

  compatible_runtimes = ["python3.8"]
}
