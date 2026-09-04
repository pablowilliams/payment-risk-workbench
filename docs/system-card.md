# System card

## Intended use

PulseLedger helps trained financial-crime investigators prioritise payment alerts, inspect behavioural and graph evidence, consult policy, and prepare a proportionate decision for named human approval.

## Excluded use

The system must not autonomously block an account, terminate a customer relationship, report a person to authorities, infer guilt from graph proximity, or communicate an adverse outcome without an approved operational process. It is not credit scoring, identity proofing, legal advice or a source of truth for customer vulnerability.

## Authority model

The machine may search, rank, summarise and propose. Only an authorised human may approve a material action. Approval binds the reviewer to the exact payload hash, scope and duration. Any amendment invalidates the prior approval. A kill switch disables material proposals while preserving read-only evidence access.

## Evidence and explanations

Each recommendation exposes strategy scores, reason codes, transaction history, network evidence, applicable policy, model version and feature time. Explanations describe observed evidence and uncertainty; they do not turn correlations into accusations.

## Monitoring

Measure alert volume, precision and recall after outcome maturation, customer complaints, overturn rate, decision time, subgroup gaps, data contract failures, feature drift, graph timeouts, stale-policy retrieval, duplicated decisions and approval-hash conflicts. Owners review daily operational alerts and monthly outcome packs.

## Known limitations

Synthetic generators simplify adversarial adaptation, hidden confounding, label delay, customer behaviour, channel variation and investigator inconsistency. The graph fixture is illustrative. Local latency is modelled rather than load-tested. In-memory decisions do not survive restart; the AWS target uses an encrypted append-only ledger.
