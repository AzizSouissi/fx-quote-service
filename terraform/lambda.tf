# --------------------------------------------------------------------------
# Lambda Functions
# --------------------------------------------------------------------------
# Replaces: server.js (Express routes) + the wrap() function
#
# Each handler file becomes its own Lambda function.
# API Gateway invokes them directly with the event object —
# no Express, no wrap() adapter needed.

# --- Package the backend code into a ZIP ---
# Lambda requires code as a ZIP archive.

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../backend"
  output_path = "${path.module}/dist/lambda.zip"

  excludes = [
    "node_modules/.cache",
    "server.js",
    ".gitignore",
    "coverage",
    "__tests__",
    "*.test.js",
  ]
}

# --------------------------------------------------------------------------
# Auth Lambda — handles /auth/register, /auth/login, /auth/me
# --------------------------------------------------------------------------

resource "aws_lambda_function" "auth" {
  function_name = "${var.project_name}-auth-${var.environment}"
  description   = "Auth handler — register, login, profile"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler          = "handlers/authHandler.handler"
  runtime          = var.lambda_runtime
  memory_size      = var.lambda_memory
  timeout          = var.lambda_timeout

  role = aws_iam_role.auth_lambda.arn

  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DB_HOST           = aws_db_instance.main.address
      DB_PORT           = tostring(aws_db_instance.main.port)
      DB_NAME           = var.rds_db_name
      DB_USERNAME       = var.rds_username
      DB_PASSWORD       = var.rds_password
      COGNITO_POOL_ID   = aws_cognito_user_pool.main.id
      COGNITO_CLIENT_ID = aws_cognito_user_pool_client.app.id
      ENVIRONMENT       = var.environment
    }
  }

  tags = {
    Name = "${var.project_name}-auth"
  }
}

# Auth Lambda needs a separate handler per route.
# We create aliases for each auth endpoint mapping to the same function.
# The routing logic is handled in API Gateway (different routes → same Lambda).

# --------------------------------------------------------------------------
# Auth Register Lambda
# --------------------------------------------------------------------------

resource "aws_lambda_function" "auth_register" {
  function_name = "${var.project_name}-auth-register-${var.environment}"
  description   = "POST /auth/register — User registration"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler          = "handlers/authHandler.registerHandler"
  runtime          = var.lambda_runtime
  memory_size      = var.lambda_memory
  timeout          = var.lambda_timeout

  role = aws_iam_role.auth_lambda.arn

  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DB_HOST           = aws_db_instance.main.address
      DB_PORT           = tostring(aws_db_instance.main.port)
      DB_NAME           = var.rds_db_name
      DB_USERNAME       = var.rds_username
      DB_PASSWORD       = var.rds_password
      COGNITO_POOL_ID   = aws_cognito_user_pool.main.id
      COGNITO_CLIENT_ID = aws_cognito_user_pool_client.app.id
      ENVIRONMENT       = var.environment
    }
  }

  tags = {
    Name = "${var.project_name}-auth-register"
  }
}

# --------------------------------------------------------------------------
# Auth Login Lambda
# --------------------------------------------------------------------------

resource "aws_lambda_function" "auth_login" {
  function_name = "${var.project_name}-auth-login-${var.environment}"
  description   = "POST /auth/login — User authentication"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler          = "handlers/authHandler.loginHandler"
  runtime          = var.lambda_runtime
  memory_size      = var.lambda_memory
  timeout          = var.lambda_timeout

  role = aws_iam_role.auth_lambda.arn

  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DB_HOST           = aws_db_instance.main.address
      DB_PORT           = tostring(aws_db_instance.main.port)
      DB_NAME           = var.rds_db_name
      DB_USERNAME       = var.rds_username
      DB_PASSWORD       = var.rds_password
      COGNITO_POOL_ID   = aws_cognito_user_pool.main.id
      COGNITO_CLIENT_ID = aws_cognito_user_pool_client.app.id
      ENVIRONMENT       = var.environment
    }
  }

  tags = {
    Name = "${var.project_name}-auth-login"
  }
}

# --------------------------------------------------------------------------
# Auth Me (Profile) Lambda
# --------------------------------------------------------------------------

resource "aws_lambda_function" "auth_me" {
  function_name = "${var.project_name}-auth-me-${var.environment}"
  description   = "GET /auth/me — User profile (authenticated)"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler          = "handlers/authHandler.meHandler"
  runtime          = var.lambda_runtime
  memory_size      = var.lambda_memory
  timeout          = var.lambda_timeout

  role = aws_iam_role.auth_lambda.arn

  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DB_HOST           = aws_db_instance.main.address
      DB_PORT           = tostring(aws_db_instance.main.port)
      DB_NAME           = var.rds_db_name
      DB_USERNAME       = var.rds_username
      DB_PASSWORD       = var.rds_password
      COGNITO_POOL_ID   = aws_cognito_user_pool.main.id
      COGNITO_CLIENT_ID = aws_cognito_user_pool_client.app.id
      ENVIRONMENT       = var.environment
    }
  }

  tags = {
    Name = "${var.project_name}-auth-me"
  }
}

# --------------------------------------------------------------------------
# Quote Preview Lambda (public — no auth)
# --------------------------------------------------------------------------

resource "aws_lambda_function" "quote_preview" {
  function_name = "${var.project_name}-quote-preview-${var.environment}"
  description   = "POST /quotes — Anonymous quote preview"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler          = "handlers/quoteHandler.handler"
  runtime          = var.lambda_runtime
  memory_size      = var.lambda_memory
  timeout          = var.lambda_timeout

  role = aws_iam_role.quote_lambda.arn

  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DB_HOST     = aws_db_instance.main.address
      DB_PORT     = tostring(aws_db_instance.main.port)
      DB_NAME     = var.rds_db_name
      DB_USERNAME = var.rds_username
      DB_PASSWORD = var.rds_password
      ENVIRONMENT = var.environment
    }
  }

  tags = {
    Name = "${var.project_name}-quote-preview"
  }
}

# --------------------------------------------------------------------------
# Quote Create Lambda (authenticated)
# --------------------------------------------------------------------------

resource "aws_lambda_function" "quote_create" {
  function_name = "${var.project_name}-quote-create-${var.environment}"
  description   = "POST /quotes/create — Create and save quote"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler          = "handlers/quoteHandler.createQuoteHandler"
  runtime          = var.lambda_runtime
  memory_size      = var.lambda_memory
  timeout          = var.lambda_timeout

  role = aws_iam_role.quote_lambda.arn

  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DB_HOST     = aws_db_instance.main.address
      DB_PORT     = tostring(aws_db_instance.main.port)
      DB_NAME     = var.rds_db_name
      DB_USERNAME = var.rds_username
      DB_PASSWORD = var.rds_password
      ENVIRONMENT = var.environment
    }
  }

  tags = {
    Name = "${var.project_name}-quote-create"
  }
}

# --------------------------------------------------------------------------
# Quote Get Lambda (authenticated)
# --------------------------------------------------------------------------

resource "aws_lambda_function" "quote_get" {
  function_name = "${var.project_name}-quote-get-${var.environment}"
  description   = "GET /quotes/{id} — Get quote by ID"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler          = "handlers/quoteHandler.getQuoteHandler"
  runtime          = var.lambda_runtime
  memory_size      = var.lambda_memory
  timeout          = var.lambda_timeout

  role = aws_iam_role.quote_lambda.arn

  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DB_HOST     = aws_db_instance.main.address
      DB_PORT     = tostring(aws_db_instance.main.port)
      DB_NAME     = var.rds_db_name
      DB_USERNAME = var.rds_username
      DB_PASSWORD = var.rds_password
      ENVIRONMENT = var.environment
    }
  }

  tags = {
    Name = "${var.project_name}-quote-get"
  }
}

# --------------------------------------------------------------------------
# Quote List Lambda (authenticated)
# --------------------------------------------------------------------------

resource "aws_lambda_function" "quote_list" {
  function_name = "${var.project_name}-quote-list-${var.environment}"
  description   = "GET /quotes/list — List user quotes"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler          = "handlers/quoteHandler.listQuotesHandler"
  runtime          = var.lambda_runtime
  memory_size      = var.lambda_memory
  timeout          = var.lambda_timeout

  role = aws_iam_role.quote_lambda.arn

  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DB_HOST     = aws_db_instance.main.address
      DB_PORT     = tostring(aws_db_instance.main.port)
      DB_NAME     = var.rds_db_name
      DB_USERNAME = var.rds_username
      DB_PASSWORD = var.rds_password
      ENVIRONMENT = var.environment
    }
  }

  tags = {
    Name = "${var.project_name}-quote-list"
  }
}

# --------------------------------------------------------------------------
# Transfer Create Lambda (authenticated)
# --------------------------------------------------------------------------

resource "aws_lambda_function" "transfer_create" {
  function_name = "${var.project_name}-transfer-create-${var.environment}"
  description   = "POST /transfers — Confirm quote into transfer"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler          = "handlers/transferHandler.createTransferHandler"
  runtime          = var.lambda_runtime
  memory_size      = var.lambda_memory
  timeout          = var.lambda_timeout

  role = aws_iam_role.transfer_lambda.arn

  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DB_HOST     = aws_db_instance.main.address
      DB_PORT     = tostring(aws_db_instance.main.port)
      DB_NAME     = var.rds_db_name
      DB_USERNAME = var.rds_username
      DB_PASSWORD = var.rds_password
      ENVIRONMENT = var.environment
    }
  }

  tags = {
    Name = "${var.project_name}-transfer-create"
  }
}

# --------------------------------------------------------------------------
# Transfer Get Lambda (authenticated)
# --------------------------------------------------------------------------

resource "aws_lambda_function" "transfer_get" {
  function_name = "${var.project_name}-transfer-get-${var.environment}"
  description   = "GET /transfers/{id} — Get transfer by ID"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler          = "handlers/transferHandler.getTransferHandler"
  runtime          = var.lambda_runtime
  memory_size      = var.lambda_memory
  timeout          = var.lambda_timeout

  role = aws_iam_role.transfer_lambda.arn

  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DB_HOST     = aws_db_instance.main.address
      DB_PORT     = tostring(aws_db_instance.main.port)
      DB_NAME     = var.rds_db_name
      DB_USERNAME = var.rds_username
      DB_PASSWORD = var.rds_password
      ENVIRONMENT = var.environment
    }
  }

  tags = {
    Name = "${var.project_name}-transfer-get"
  }
}

# --------------------------------------------------------------------------
# Transfer List Lambda (authenticated)
# --------------------------------------------------------------------------

resource "aws_lambda_function" "transfer_list" {
  function_name = "${var.project_name}-transfer-list-${var.environment}"
  description   = "GET /transfers/list — List user transfers"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler          = "handlers/transferHandler.listTransfersHandler"
  runtime          = var.lambda_runtime
  memory_size      = var.lambda_memory
  timeout          = var.lambda_timeout

  role = aws_iam_role.transfer_lambda.arn

  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DB_HOST     = aws_db_instance.main.address
      DB_PORT     = tostring(aws_db_instance.main.port)
      DB_NAME     = var.rds_db_name
      DB_USERNAME = var.rds_username
      DB_PASSWORD = var.rds_password
      ENVIRONMENT = var.environment
    }
  }

  tags = {
    Name = "${var.project_name}-transfer-list"
  }
}

# --------------------------------------------------------------------------
# CloudWatch Log Groups
# --------------------------------------------------------------------------
# Explicit log groups with retention (default is forever = expensive).

resource "aws_cloudwatch_log_group" "auth" {
  name              = "/aws/lambda/${aws_lambda_function.auth.function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "auth_register" {
  name              = "/aws/lambda/${aws_lambda_function.auth_register.function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "auth_login" {
  name              = "/aws/lambda/${aws_lambda_function.auth_login.function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "auth_me" {
  name              = "/aws/lambda/${aws_lambda_function.auth_me.function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "quote_preview" {
  name              = "/aws/lambda/${aws_lambda_function.quote_preview.function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "quote_create" {
  name              = "/aws/lambda/${aws_lambda_function.quote_create.function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "quote_get" {
  name              = "/aws/lambda/${aws_lambda_function.quote_get.function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "quote_list" {
  name              = "/aws/lambda/${aws_lambda_function.quote_list.function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "transfer_create" {
  name              = "/aws/lambda/${aws_lambda_function.transfer_create.function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "transfer_get" {
  name              = "/aws/lambda/${aws_lambda_function.transfer_get.function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "transfer_list" {
  name              = "/aws/lambda/${aws_lambda_function.transfer_list.function_name}"
  retention_in_days = 14
}
