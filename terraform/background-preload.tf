locals {
  index_key             = "index.html"
  domain_name           = "bg.otfbm.io"
  lambda-layer-preload-s3-key = "lambda/preload-layer.zip"
  lambda-preload-filename = "preload.zip"
  lambda-preload-function-name = "preload"
}

data "aws_route53_zone" "otfbm" {
  name         = "otfbm.io"
  private_zone = false
}

data "aws_s3_bucket" "infra" {
  bucket = "otfbm-infra"
}

data "archive_file" "preload-lambda" {
  output_path = "${path.root}/${local.lambda-preload-filename}"
  type = "zip"
  source_dir = "${path.root}/../preload"
}

# Certificate creation and validation
resource "aws_acm_certificate" "bg" {
  provider = aws.us-east-1   # CF distributions require certificates in us-east-1
  domain_name               = local.domain_name
  validation_method         = "DNS"
}

resource "null_resource" "preload-lambda-layer" {
  provisioner "local-exec" {
    working_dir = "${path.root}/scripts"
    command = "./lambda-layer-preload.sh"
  }
}

resource "aws_s3_bucket_object" "preload-lambda-layer" {
  bucket = data.aws_s3_bucket.infra.bucket
  key = local.lambda-layer-preload-s3-key
  source = "scripts/preload-layer.zip"
  content_type = "application/zip"
  depends_on = [null_resource.preload-lambda-layer]
}

resource "aws_lambda_layer_version" "preload-lambda-layer" {
  s3_bucket   = data.aws_s3_bucket.infra.bucket
  s3_key      = local.lambda-layer-preload-s3-key
  layer_name  = "preload"
  description = "A layer that contains the necessary packages for the preload lambda function"

  compatible_runtimes = ["python3.8"]
}

# Record for DNS-01 cert validation
resource "aws_route53_record" "certificate_validation" {
  for_each = {
    for dvo in aws_acm_certificate.bg.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }
  allow_overwrite = true
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.record]
  ttl             = 60
  zone_id         = data.aws_route53_zone.otfbm.id
}

# Note this doesn't create an AWS 'resource' as such. it's a Terraform workflow-only item
resource "aws_acm_certificate_validation" "certificate_validation" {
  provider = aws.us-east-1
  certificate_arn         = aws_acm_certificate.bg.arn
  validation_record_fqdns = [for record in aws_route53_record.certificate_validation : record.fqdn]
}

# Route53 'alias' record to point to CF distribution
resource "aws_route53_record" "backgrounds" {
  zone_id = data.aws_route53_zone.otfbm.zone_id
  name    = local.domain_name
  type    = "A"

  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.backgrounds.domain_name
    zone_id                = aws_cloudfront_distribution.backgrounds.hosted_zone_id
  }
}

# s3 bucket to hold all the images. allow anything to read as a static website
resource "aws_s3_bucket" "backgrounds" {
  bucket = local.domain_name
  acl = "public-read"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${local.domain_name}/*"
        }
    ]
}
EOF

  # really this should be write-once read-many; no reason to pay for versioning
  versioning {
    enabled = false
  }

  lifecycle_rule {
    id      = "clean"
    enabled = true
    prefix  = "img/"

    # expire items after one week
    expiration {
      days = 7
    }

    # dont spend money on lingering/stale uploads
    abort_incomplete_multipart_upload_days = 1
  }

  website {
    index_document = local.index_key
  }

  # no cors_rule necessary - images allowed by cors
}

# default root document for the static website bucket
resource "aws_s3_bucket_object" "index" {
  bucket  = aws_s3_bucket.backgrounds.bucket
  key     = local.index_key
  acl = "public-read"
  content = "<html>Thar be backgrounds here</html>"
  content_type = "text/html"
}

# CF distribution to regionally cache images for increased geo performance
resource "aws_cloudfront_distribution" "backgrounds" {
  provider = aws.us-east-1
  enabled             = true
  default_root_object = local.index_key
  price_class  = "PriceClass_100"
  aliases = [local.domain_name]

  origin {
    domain_name = aws_s3_bucket.backgrounds.website_endpoint
    origin_id   = local.domain_name

    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.domain_name
    viewer_protocol_policy = "allow-all"
    compress = true
    default_ttl            = 259200
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # in case a location needs to be blacklisted for some reason
  restrictions {
    geo_restriction {
      restriction_type = "none"
   #   locations        = []
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.bg.arn
    ssl_support_method = "sni-only"
  }

  depends_on = [aws_acm_certificate.bg, aws_acm_certificate_validation.certificate_validation]
}

# API Gateway
resource "aws_api_gateway_rest_api" "bg" {
  name = "Background Preload API GW"
}

resource "aws_api_gateway_resource" "resource" {
  path_part   = "fetch"
  parent_id   = aws_api_gateway_rest_api.bg.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.bg.id
}

resource "aws_api_gateway_method" "method" {
  rest_api_id   = aws_api_gateway_rest_api.bg.id
  resource_id   = aws_api_gateway_resource.resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = aws_api_gateway_rest_api.bg.id
  resource_id             = aws_api_gateway_resource.resource.id
  http_method             = aws_api_gateway_method.method.http_method
  integration_http_method = "GET"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.bg.invoke_arn
}

# Lambda Function Bits
resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.bg.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${var.region}:${var.account}:${aws_api_gateway_rest_api.bg.id}/*/${aws_api_gateway_method.method.http_method}${aws_api_gateway_resource.resource.path}"
}

resource "aws_lambda_function" "bg" {
  filename      = local.lambda-preload-filename
  function_name = local.lambda-preload-function-name
  role          = aws_iam_role.bg-lambda.arn
  handler       = "lambda.lambda_handler"
  runtime       = "python3.8"

  source_code_hash = filebase64sha256(local.lambda-preload-filename)
}

# IAM
resource "aws_iam_role" "bg-lambda" {
  name = "preload-lambda"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
POLICY
}