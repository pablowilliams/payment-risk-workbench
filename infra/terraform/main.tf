data "aws_caller_identity" "current" {}

locals {
  prefix = "${var.project_name}-${var.environment}"
}

resource "aws_kms_key" "evidence" {
  description             = "Payment Risk Workbench event and decision evidence"
  enable_key_rotation     = true
  deletion_window_in_days = 30
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "RootAccess"
      Effect    = "Allow"
      Principal = { AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root" }
      Action    = "kms:*"
      Resource  = "*"
    }]
  })
}

resource "aws_kms_alias" "evidence" {
  name          = "alias/${local.prefix}-evidence"
  target_key_id = aws_kms_key.evidence.key_id
}

resource "aws_s3_bucket" "evidence" {
  bucket_prefix = "${local.prefix}-evidence-"
  force_destroy = false
}

resource "aws_s3_bucket_versioning" "evidence" {
  bucket = aws_s3_bucket.evidence.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "evidence" {
  bucket = aws_s3_bucket.evidence.id
  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.evidence.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "evidence" {
  bucket                  = aws_s3_bucket.evidence.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "evidence" {
  bucket = aws_s3_bucket.evidence.id
  rule {
    id     = "archive"
    status = "Enabled"
    filter {}
    transition {
      days          = 90
      storage_class = "GLACIER_IR"
    }
    noncurrent_version_expiration { noncurrent_days = 365 }
  }
}

resource "aws_dynamodb_table" "decisions" {
  name         = "${local.prefix}-decision-ledger"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "decision_id"
  range_key    = "recorded_at"
  attribute {
    name = "decision_id"
    type = "S"
  }
  attribute {
    name = "recorded_at"
    type = "S"
  }
  point_in_time_recovery { enabled = true }
  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.evidence.arn
  }
}

resource "aws_sqs_queue" "dead_letter" {
  name                      = "${local.prefix}-decision-dlq"
  message_retention_seconds = 1209600
  kms_master_key_id         = aws_kms_key.evidence.arn
}

resource "aws_sqs_queue" "decision" {
  name                       = "${local.prefix}-decision-events"
  visibility_timeout_seconds = 60
  kms_master_key_id          = aws_kms_key.evidence.arn
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dead_letter.arn
    maxReceiveCount     = 5
  })
}

resource "aws_cloudwatch_log_group" "service" {
  name              = "/payment-risk-workbench/${var.environment}/service"
  retention_in_days = var.retention_days
  kms_key_id        = aws_kms_key.evidence.arn
}

resource "aws_cloudwatch_metric_alarm" "dead_letters" {
  alarm_name          = "${local.prefix}-dead-letters"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = 60
  statistic           = "Maximum"
  threshold           = 0
  treat_missing_data  = "notBreaching"
  dimensions          = { QueueName = aws_sqs_queue.dead_letter.name }
}
