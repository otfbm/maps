locals {
  index_key             = "index.html"
  domain_name           = "bg.otfbm.io"
  lambda-layer-preload-s3-key = "lambda/preload-layer.zip"
  lambda-preload-filename = "artifacts/preload.zip"
  lambda-preload-layer-filename = "artifacts/preload-layer.zip"
  lambda-preload-function-name = "preload"
  target_image_bytes = 1048576
  target_image_bytes_tolerance = 5
}

data "aws_route53_zone" "otfbm" {
  name         = "otfbm.io"
  private_zone = false
}

data "aws_s3_bucket" "infra" {
  bucket = "otfbm-infra"
}

# Certificate creation and validation
resource "aws_acm_certificate" "bg" {
  provider = aws.us-east-1   # CF distributions require certificates in us-east-1
  domain_name               = local.domain_name
  validation_method         = "DNS"
}

resource "aws_s3_bucket_object" "preload-lambda-layer" {
  bucket = data.aws_s3_bucket.infra.bucket
  key = local.lambda-layer-preload-s3-key
  source = local.lambda-preload-layer-filename
  content_type = "application/zip"
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

    routing_rules = <<EOF
[{
  "Condition": {
    "HttpErrorCodeReturnedEquals": "404"
  },
  "Redirect": {
    "Protocol": "https",
    "HostName": "${aws_api_gateway_rest_api.bg.id}.execute-api.${var.region}.amazonaws.com",
    "ReplaceKeyPrefixWith": "${aws_api_gateway_deployment.prod.stage_name}/${aws_api_gateway_resource.action.path_part}/",
    "HttpRedirectCode": "307"
  }
}]
EOF
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
    default_ttl            = 0
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

resource "aws_api_gateway_resource" "action" {
  parent_id   = aws_api_gateway_rest_api.bg.root_resource_id
  path_part   = "preload"
  rest_api_id = aws_api_gateway_rest_api.bg.id
}

resource "aws_api_gateway_resource" "url" {
  parent_id = aws_api_gateway_resource.action.id
  path_part = "{url}"
  rest_api_id = aws_api_gateway_rest_api.bg.id
}

resource "aws_api_gateway_method" "method" {
  rest_api_id   = aws_api_gateway_rest_api.bg.id
  resource_id   = aws_api_gateway_resource.url.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.url" = true
  }
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = aws_api_gateway_rest_api.bg.id
  resource_id             = aws_api_gateway_resource.url.id
  http_method             = aws_api_gateway_method.method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.bg.invoke_arn

  request_parameters = {
    "integration.request.path.id" = "method.request.path.url"
  }
}

resource "aws_api_gateway_deployment" "prod" {
  depends_on = [aws_api_gateway_integration.integration, aws_api_gateway_method.method,
                aws_api_gateway_resource.action, aws_api_gateway_resource.url,
                aws_api_gateway_rest_api.bg]
  stage_name = "prod"

  rest_api_id = aws_api_gateway_rest_api.bg.id

  lifecycle {
    create_before_destroy = true
  }

  variables = {
    deployed_at = timestamp()
  }
}

# Lambda Function Bits
resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.bg.arn
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "${aws_api_gateway_rest_api.bg.execution_arn}/*/*/*"
}

resource "aws_lambda_function" "bg" {
  filename      = local.lambda-preload-filename
  function_name = local.lambda-preload-function-name
  role          = aws_iam_role.bg-lambda.arn
  runtime       = "python3.8"
  handler = "${local.lambda-preload-function-name}.lambda_handler"
  layers = [aws_lambda_layer_version.preload-lambda-layer.arn]
  memory_size = 1024
  timeout = 20

  source_code_hash = filebase64sha256(local.lambda-preload-filename)

  environment {
    variables = {
      BUCKET = local.domain_name
      URL = local.domain_name
      TARGET_BYTES = local.target_image_bytes
      SIZE_TOLERANCE = local.target_image_bytes_tolerance
    }
  }
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

resource "aws_iam_policy" "bg-lambda" {
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "LambdaWriteObject",
            "Effect": "Allow",
            "Action": "s3:PutObject",
            "Resource": "${aws_s3_bucket.backgrounds.arn}/*"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "bg-lambda" {
  policy_arn = aws_iam_policy.bg-lambda.arn
  role = aws_iam_role.bg-lambda.name
}

resource "aws_iam_role_policy_attachment" "bg-lamba-basicexecutionrole" {
  role       = "${aws_iam_role.bg-lambda.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
