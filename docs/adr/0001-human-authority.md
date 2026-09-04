# ADR 0001: Keep customer-impacting authority with a named human

Status: Accepted

## Context

Risk ranking can reduce investigative search cost, but false positives create direct customer harm. An autonomous restriction would also make responsibility, contestability and recovery harder.

## Decision

Automated components may assemble evidence and propose a bounded action. A material action requires an authorised supervisor who is different from the proposer, a full SHA-256 payload hash, a time limit, stated rationale and an immutable audit record. Mutation produces a new proposal. Read-only access remains available when the proposal kill switch is active.

## Consequences

The design adds review latency and operational capacity requirements. It produces clearer accountability, safer failure modes and a concrete API invariant that can be tested.
