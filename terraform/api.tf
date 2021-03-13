# API Gateway
resource "aws_api_gateway_rest_api" "gateway" {
  name = "OTFBM API GW"
}

resource "aws_api_gateway_deployment" "prod" {
  depends_on = [aws_api_gateway_integration.background_integration,
    aws_api_gateway_method.background_method,
    aws_api_gateway_resource.background,
    aws_api_gateway_resource.background_url,
    aws_api_gateway_integration.token_integration,
    aws_api_gateway_method.token_method,
    aws_api_gateway_method.token_root_method,
    aws_api_gateway_resource.token_action,
    aws_api_gateway_resource.token_url,
    aws_api_gateway_integration.token_root_integration,
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
