import type { InvestigationDecision } from "./types";
declare global {
  var pulseDecisions: Map<string, InvestigationDecision> | undefined;
}
export const decisions = globalThis.pulseDecisions ?? new Map<string, InvestigationDecision>();
globalThis.pulseDecisions = decisions;
