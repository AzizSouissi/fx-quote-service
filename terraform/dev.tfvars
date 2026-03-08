# --------------------------------------------------------------------------
# Dev Environment Variable Overrides
# --------------------------------------------------------------------------
# Usage: terraform apply -var-file="dev.tfvars"

aws_region     = "eu-west-1"
environment    = "dev"
project_name   = "fx-quote-service"
lambda_runtime = "nodejs20.x"
lambda_memory  = 256
lambda_timeout = 30

# RDS
rds_instance_class      = "db.t4g.micro"
rds_allocated_storage   = 20
rds_max_allocated_storage = 50
rds_db_name             = "fxquoteservice"
rds_username            = "fxadmin"
rds_password            = "CHANGE_ME_dev_password_123"
