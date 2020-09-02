locals {
  # shared
  index_key = "index.html"
  lambda-layer-preload-s3-key             = "lambda/preload-layer.zip"
  lambda-layer-preload-filename           = "artifacts/preload-layer.zip"

  # background
  background_domain_name                  = "bg.otfbm.io"
  lambda-background-filename              = "artifacts/background.zip"
  lambda-background-function-name         = "background"
  background_target_image_bytes           = 1048576
  background_target_image_bytes_tolerance = 5

  # token
  token_domain_name                   = "token.otfbm.io"
  lambda-token-filename               = "artifacts/token.zip"
  lambda-token-function-name          = "otfbm-token"
  token_target_size                   = 160
  token_face_padding                  = 0.2
  token_zoom_level                    = 1.7
}
