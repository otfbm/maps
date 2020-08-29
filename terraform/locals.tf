locals {
  index_key             = "index.html"
  background_domain_name           = "bg.otfbm.io"
  lambda-layer-preload-s3-key = "lambda/preload-layer.zip"
  lambda-background-filename = "artifacts/background.zip"
  lambda-layer-preload-filename = "artifacts/preload-layer.zip"
  lambda-background-function-name = "background"
  target_image_bytes = 1048576
  target_image_bytes_tolerance = 5
}
