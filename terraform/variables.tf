# --------------------------------------------------------------------------
# Input Variables
# --------------------------------------------------------------------------

variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "eu-west-1"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name used for naming resources"
  type        = string
  default     = "fx-quote-service"
}

variable "lambda_runtime" {
  description = "Node.js runtime version for Lambda functions"
  type        = string
  default     = "nodejs20.x"
}

variable "lambda_memory" {
  description = "Memory (MB) for Lambda functions"
  type        = number
  default     = 256
}

variable "lambda_timeout" {
  description = "Timeout (seconds) for Lambda functions"
  type        = number
  default     = 30
}

# --------------------------------------------------------------------------
# RDS Variables
# --------------------------------------------------------------------------

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "rds_engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "16.4"
}

variable "rds_instance_class" {
  description = "RDS instance size"
  type        = string
  default     = "db.t4g.micro"
}

variable "rds_allocated_storage" {
  description = "Initial storage in GB"
  type        = number
  default     = 20
}

variable "rds_max_allocated_storage" {
  description = "Max storage for autoscaling in GB"
  type        = number
  default     = 50
}

variable "rds_db_name" {
  description = "Name of the database to create"
  type        = string
  default     = "fxquoteservice"
}

variable "rds_username" {
  description = "Master username for the database"
  type        = string
  default     = "fxadmin"
  sensitive   = true
}

variable "rds_password" {
  description = "Master password for the database"
  type        = string
  sensitive   = true
}
