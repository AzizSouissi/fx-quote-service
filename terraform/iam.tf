# --------------------------------------------------------------------------
# IAM Roles & Policies for Lambda Functions
# --------------------------------------------------------------------------
# Each Lambda function needs an execution role that grants it permission
# to write logs and run inside the VPC (to reach RDS).

# --- Lambda Assume Role Policy ---
# This lets Lambda "assume" the role (act as the role).

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# --------------------------------------------------------------------------
# Auth Lambda Role
# --------------------------------------------------------------------------
# Needs: CloudWatch Logs + VPC access (to reach RDS)

resource "aws_iam_role" "auth_lambda" {
  name               = "${var.project_name}-auth-lambda-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json

  tags = {
    Name = "${var.project_name}-auth-lambda-role"
  }
}

# Basic Lambda execution (CloudWatch Logs)
resource "aws_iam_role_policy_attachment" "auth_lambda_basic" {
  role       = aws_iam_role.auth_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# VPC access (Lambda needs ENI permissions to connect to RDS)
resource "aws_iam_role_policy_attachment" "auth_lambda_vpc" {
  role       = aws_iam_role.auth_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# --------------------------------------------------------------------------
# Quote Lambda Role
# --------------------------------------------------------------------------
# Needs: CloudWatch Logs + VPC access (to reach RDS)

resource "aws_iam_role" "quote_lambda" {
  name               = "${var.project_name}-quote-lambda-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json

  tags = {
    Name = "${var.project_name}-quote-lambda-role"
  }
}

resource "aws_iam_role_policy_attachment" "quote_lambda_basic" {
  role       = aws_iam_role.quote_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "quote_lambda_vpc" {
  role       = aws_iam_role.quote_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# --------------------------------------------------------------------------
# Transfer Lambda Role
# --------------------------------------------------------------------------
# Needs: CloudWatch Logs + VPC access (to reach RDS)

resource "aws_iam_role" "transfer_lambda" {
  name               = "${var.project_name}-transfer-lambda-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json

  tags = {
    Name = "${var.project_name}-transfer-lambda-role"
  }
}

resource "aws_iam_role_policy_attachment" "transfer_lambda_basic" {
  role       = aws_iam_role.transfer_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "transfer_lambda_vpc" {
  role       = aws_iam_role.transfer_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}
