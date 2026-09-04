import { createHash, randomUUID } from "crypto";
import { alerts, policies } from "./data";
import type { InvestigationDecision } from "./types";
export function getAlert(id: string) {
  return alerts.find((x) => x.id === id);
}
export function buildDecision(alertId: string): InvestigationDecision {
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
  const payload = JSON.stringify({
    alertId,
    account: alert.account,
    action,
    scope: "outbound_payments",
    durationHours: 2,
  });
  const payloadHash = createHash("sha256").update(payload).digest("hex").slice(0, 20);
  return {
    id: `DEC-${randomUUID().slice(0, 8)}`,
    alertId,
    status: action === "continue_monitoring" ? "draft" : "awaiting_approval",
    recommendedAction: action,
    rationale:
      "The payment combines elevated network proximity, device sharing and unusual transaction behaviour. The recommendation is time-limited and requires investigator approval.",
    evidence,
    payloadHash,
    createdAt: new Date().toISOString(),
  };
}
export function approveDecision(decision: InvestigationDecision, hash: string, approver: string) {
  if (decision.status !== "awaiting_approval") throw new Error("Decision is not awaiting approval");
  if (hash !== decision.payloadHash) throw new Error("Approval payload does not match");
  return {
    ...decision,
    status: "approved" as const,
    approvedAt: new Date().toISOString(),
    approver,
  };
}
