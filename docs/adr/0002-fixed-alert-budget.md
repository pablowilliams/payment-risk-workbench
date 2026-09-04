# ADR 0002: Evaluate detection strategies at a fixed alert budget

Status: Accepted

## Context

Accuracy at an arbitrary threshold can improve while overwhelming investigators. Different models are not comparable if each creates a different queue size.

## Decision

All headline strategies receive the same top-one-percent budget: 10,000 alerts from one million synthetic payments. Precision, recall and exposure capture are reported at that capacity. Threshold exploration in the UI is explicitly a scenario tool.

## Consequences

Results map to an operating constraint and reveal ranking trade-offs. They do not establish the correct real-world budget, which must follow measured handling time, harm and outcome maturation.
