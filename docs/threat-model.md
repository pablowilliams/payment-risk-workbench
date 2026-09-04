# Threat model

| Threat                       | Abuse path                                       | Control                                                           | Verification                         |
| ---------------------------- | ------------------------------------------------ | ----------------------------------------------------------------- | ------------------------------------ |
| Unauthorised customer action | caller bypasses investigator                     | scoped identity, recommendation-only tools, exact-hash approval   | negative API and authorisation tests |
| Prompt or evidence injection | untrusted transaction text alters recommendation | structured evidence, allow-listed tools, quoted untrusted content | adversarial evaluation set           |
| Approval race                | payload changes after review                     | hash over action, account, scope and duration                     | mismatch test in CI                  |
| Replay or duplicate action   | consumer retries a decision event                | idempotency key and conditional ledger write                      | chaos and reconciliation test        |
| Graph poisoning              | attacker manufactures relationships              | provenance, confidence, temporal decay, bounded interpretation    | source-level anomaly monitoring      |
| Training leakage             | future data enters features                      | point-in-time joins and temporal holdout                          | feature-parity gate                  |
| Sensitive-data exposure      | logs or exports reveal customer data             | tokenisation, least privilege, field redaction and retention      | DLP scan and access review           |
| Model extraction             | repeated queries reveal thresholds               | rate limits, output minimisation and monitoring                   | abuse simulation                     |
| Dependency compromise        | malicious build artifact                         | lockfile, provenance, vulnerability scan and protected CI         | software bill of materials           |
| Operator misuse              | valid user searches without purpose              | purpose binding and immutable access audit                        | periodic access sampling             |

The portfolio contains only synthetic identities. A production privacy assessment would still cover lawful basis, purpose limitation, minimisation, retention, subject rights and international transfer controls.
