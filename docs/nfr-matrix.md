# Non-functional requirement matrix

| ID     | Requirement          | Target                             | Evidence                    | Failure response                       |
| ------ | -------------------- | ---------------------------------- | --------------------------- | -------------------------------------- |
| NFR-01 | Scoring availability | 99.95% monthly                     | SLI from valid requests     | degrade to rules and page on-call      |
| NFR-02 | Alert latency        | P95 < 800 ms at 10k events/s       | distributed trace load test | shed enrichment, retain raw events     |
| NFR-03 | Recovery point       | < 1 minute                         | checkpoint exercise         | replay from committed offset           |
| NFR-04 | Recovery time        | < 30 minutes                       | regional recovery game day  | controlled failover and reconciliation |
| NFR-05 | Decision integrity   | zero unbound approvals             | payload-hash contract test  | reject and audit conflict              |
| NFR-06 | Traceability         | 100% material decisions            | ledger reconciliation       | block material proposal path           |
| NFR-07 | Accessibility        | WCAG 2.2 AA                        | automated and manual audit  | release gate                           |
| NFR-08 | Data quality         | > 99.9% valid core events          | contract telemetry          | quarantine and source escalation       |
| NFR-09 | Graph safety         | traversal < 2 hops by default      | query policy test           | cancel and fall back visibly           |
| NFR-10 | Cost control         | unit cost budget by event and case | tagged cost dashboard       | capacity or architecture review        |

Targets describe the intended production service; the local repository proves contracts and control patterns, not these operating levels.
