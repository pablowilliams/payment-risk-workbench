output "evidence_bucket" {
  value = aws_s3_bucket.evidence.id
}

output "decision_ledger" {
  value = aws_dynamodb_table.decisions.name
}

output "decision_queue_url" {
  value = aws_sqs_queue.decision.url
}

output "kms_key_arn" {
  value     = aws_kms_key.evidence.arn
  sensitive = true
}
