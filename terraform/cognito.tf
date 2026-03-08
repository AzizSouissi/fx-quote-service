# --------------------------------------------------------------------------
# Cognito User Pool
# --------------------------------------------------------------------------
# Replaces: store/userStore.js + utils/tokenUtils.js + services/authService.js
#
# Cognito handles:
#   - User registration (SignUp + confirmation)
#   - User login (InitiateAuth → JWT tokens)
#   - Token signing & verification (RSA keys, JWKS endpoint)
#   - Password hashing & policy enforcement

resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}-${var.environment}"

  # --- Username Configuration ---
  # Users sign in with their email address
  username_attributes = ["email"]

  # Auto-verify email (skips manual confirmation for dev)
  auto_verified_attributes = ["email"]

  # --- Password Policy ---
  # Matches our backend rule: minimum 8 characters
  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_uppercase                = false
    require_numbers                  = false
    require_symbols                  = false
    temporary_password_validity_days = 7
  }

  # --- Schema Attributes ---
  # Custom "name" attribute (stored in Cognito, not in the database)
  schema {
    name                = "name"
    attribute_data_type = "String"
    mutable             = true
    required            = false

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  # --- Account Recovery ---
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # --- Admin Create User ---
  # Don't send invitation emails in dev
  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  tags = {
    Name = "${var.project_name}-user-pool"
  }
}

# --- User Pool Client ---
# The "app" that authenticates against the pool.
# Our mobile app and API use this client ID.

resource "aws_cognito_user_pool_client" "app" {
  name         = "${var.project_name}-app-client"
  user_pool_id = aws_cognito_user_pool.main.id

  # Auth flows — USER_PASSWORD_AUTH matches our login implementation
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
  ]

  # Token validity
  access_token_validity  = 1   # 1 hour (matches our backend TOKEN_EXPIRY)
  id_token_validity      = 1   # 1 hour
  refresh_token_validity = 30  # 30 days

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  # No client secret — public client for mobile apps
  generate_secret = false

  # Prevent user existence errors from leaking
  prevent_user_existence_errors = "ENABLED"
}
