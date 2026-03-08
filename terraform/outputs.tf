# --------------------------------------------------------------------------
# Outputs
# --------------------------------------------------------------------------
# Values printed after `terraform apply` and queryable via `terraform output`.

output "api_url" {
  description = "Base URL of the deployed API"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_client_id" {
  description = "Cognito App Client ID (for mobile app)"
  value       = aws_cognito_user_pool_client.app.id
}

output "cognito_issuer_url" {
  description = "Cognito token issuer URL (for JWT validation)"
  value       = "https://cognito-idp.${var.aws_region}.amazonaws.com/${aws_cognito_user_pool.main.id}"
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint (host:port)"
  value       = aws_db_instance.main.endpoint
}

output "rds_hostname" {
  description = "RDS hostname only"
  value       = aws_db_instance.main.address
}

output "rds_port" {
  description = "RDS port"
  value       = aws_db_instance.main.port
}

output "rds_db_name" {
  description = "Database name"
  value       = aws_db_instance.main.db_name
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "lambda_functions" {
  description = "All Lambda function names"
  value = {
    auth_register   = aws_lambda_function.auth_register.function_name
    auth_login      = aws_lambda_function.auth_login.function_name
    auth_me         = aws_lambda_function.auth_me.function_name
    quote_preview   = aws_lambda_function.quote_preview.function_name
    quote_create    = aws_lambda_function.quote_create.function_name
    quote_get       = aws_lambda_function.quote_get.function_name
    quote_list      = aws_lambda_function.quote_list.function_name
    transfer_create = aws_lambda_function.transfer_create.function_name
    transfer_get    = aws_lambda_function.transfer_get.function_name
    transfer_list   = aws_lambda_function.transfer_list.function_name
  }
}

output "aws_region" {
  description = "AWS region the infrastructure is deployed in"
  value       = var.aws_region
}
