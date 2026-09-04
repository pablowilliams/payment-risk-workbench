# Runbook: stream lag or event-time disorder

1. Determine affected topics, partitions, event-time window and customer journeys.
2. Compare producer rate, consumer lag, watermark delay, checkpoint duration and downstream error budget.
3. If freshness breaches the decision contract, mark features stale and prevent material recommendations; never substitute silent defaults.
4. Scale consumers only after checking hot keys, poison messages, dependency latency and rebalance loops.
5. Quarantine invalid events with source identity and schema error. Preserve raw events.
6. Replay from the last reconciled offset into an isolated consumer group.
7. Compare event counts, feature fingerprints, alert IDs and decision IDs before returning to live processing.
8. Record missed service levels and any cases requiring manual review.
