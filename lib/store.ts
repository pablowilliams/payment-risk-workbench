import type { InvestigationDecision } from "./types";
declare global {
  var workbenchDecisions: Map<string, InvestigationDecision> | undefined;
  var workbenchIdempotency: Map<string, string> | undefined;
}
export const decisions = globalThis.workbenchDecisions ?? new Map<string, InvestigationDecision>();
export const idempotency = globalThis.workbenchIdempotency ?? new Map<string, string>();
globalThis.workbenchDecisions = decisions;
globalThis.workbenchIdempotency = idempotency;
