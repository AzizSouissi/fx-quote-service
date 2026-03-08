# --------------------------------------------------------------------------
# Production Environment Variable Overrides
# --------------------------------------------------------------------------
# Usage: terraform apply -var-file="prod.tfvars"

aws_region     = "eu-west-1"
environment    = "prod"
project_name   = "fx-quote-service"
lambda_runtime = "nodejs20.x"
lambda_memory  = 512
lambda_timeout = 30

# RDS
rds_instance_class      = "db.t4g.small"
rds_allocated_storage   = 50
rds_max_allocated_storage = 100
rds_db_name             = "fxquoteservice"
rds_username            = "fxadmin"
rds_password            = "CHANGE_ME_prod_password_456"
