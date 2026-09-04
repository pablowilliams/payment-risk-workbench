# ADR 0003: Treat graph proximity as evidence, not guilt

Status: Accepted

## Context

Shared devices, recipients and IP addresses are useful fraud signals but can also reflect households, workplaces, accessibility support, travel or infrastructure reuse.

## Decision

Graph features may influence ranking and be displayed with provenance, timestamps and uncertainty. Traversals are bounded. No adverse action can be justified by proximity alone, and investigators see an interpretation warning in the workspace.

## Consequences

This limits some automation and requires richer evidence assembly. It reduces the risk of turning an opaque relationship score into an accusation.
