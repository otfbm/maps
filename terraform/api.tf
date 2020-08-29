# API Gateway
resource "aws_api_gateway_rest_api" "gateway" {
  name = "OTFBM API GW"
}

resource "aws_api_gateway_deployment" "prod" {
  depends_on = [aws_api_gateway_integration.integration, aws_api_gateway_method.method,
    aws_api_gateway_resource.action, aws_api_gateway_resource.url,
    aws_api_gateway_rest_api.gateway]
  stage_name = "prod"

  rest_api_id = aws_api_gateway_rest_api.gateway.id

  lifecycle {
    create_before_destroy = true
  }

  variables = {
    deployed_at = timestamp()
  }
}