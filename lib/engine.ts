import { createHash, randomUUID } from "crypto";
import { alerts, policies } from "./data";
import type { InvestigationDecision } from "./types";
export function getAlert(id: string) {
  return alerts.find((x) => x.id === id);
}
export function buildDecision(
  alertId: string,
  proposedBy = "demo-investigator",
): InvestigationDecision {
  const alert = getAlert(alertId);
  if (!alert) throw new Error("Alert not found");
  const action =
    alert.ensembleScore >= 0.86
      ? "temporary_payment_hold"
      : alert.ensembleScore >= 0.72
        ? "request_verification"
        : "continue_monitoring";
  const evidence = [
    `Risk ensemble ${Math.round(alert.ensembleScore * 100)}%`,
    `Graph score ${Math.round(alert.graphScore * 100)}%`,
    `${alert.signals.sharedDevices} accounts share a device`,
    `${alert.signals.velocity1h} payments in one hour`,
    ...policies.slice(0, 2).map((x) => `${x.id}: ${x.title}`),
  ];
  const createdAt = new Date();
  const durationHours = 2;
  const expiresAt = new Date(createdAt.getTime() + durationHours * 60 * 60 * 1000).toISOString();
  const actionScope = "outbound_payments" as const;
  const payload = JSON.stringify({
    alertId,
    account: alert.account,
    action,
    actionScope,
    durationHours,
    expiresAt,
  });
  const payloadHash = createHash("sha256").update(payload).digest("hex");
  return {
    id: `DEC-${randomUUID().slice(0, 8)}`,
    alertId,
    status: action === "continue_monitoring" ? "draft" : "awaiting_approval",
    recommendedAction: action,
    rationale:
      action === "continue_monitoring"
        ? "The evidence does not meet the threshold for a customer-impacting action. Continue monitoring remains a draft investigator decision."
        : "The payment combines elevated network proximity, device sharing and unusual transaction behaviour. The recommendation is time-limited and requires approval from a different supervisor.",
    evidence,
    actionScope,
    durationHours,
    payloadHash,
    createdAt: createdAt.toISOString(),
    expiresAt,
    proposedBy,
  };
}
export function approveDecision(decision: InvestigationDecision, hash: string, approver: string) {
  if (decision.status !== "awaiting_approval") throw new Error("Decision is not awaiting approval");
  if (hash !== decision.payloadHash) throw new Error("Approval payload does not match");
  if (approver === decision.proposedBy)
    throw new Error("Proposer cannot approve their own decision");
  if (Date.parse(decision.expiresAt) <= Date.now())
    throw new Error("Decision proposal has expired");
  return {
    ...decision,
    status: "approved" as const,
    approvedAt: new Date().toISOString(),
    approver,
  };
}
