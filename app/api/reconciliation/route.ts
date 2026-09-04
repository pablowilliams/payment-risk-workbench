import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { alerts, backtest } from "@/lib/data";

export function GET() {
  const checks = {
    eventDenominator: backtest.metadata.events === 1_000_000,
    fixedAlertBudget: Object.values(backtest.models).every((model) => model.alerts === 10_000),
    curatedRanks: alerts.every((alert, index) => alert.rank === index + 1),
    uniqueAlertIds: new Set(alerts.map((alert) => alert.id)).size === alerts.length,
    traceCoverage: backtest.platform.trace_coverage_pct === 100,
    duplicateDecisions: backtest.platform.duplicate_decisions === 0,
  };
  const fingerprint = createHash("sha256")
    .update(JSON.stringify({ backtest, alerts }))
    .digest("hex");
  return NextResponse.json({
    status: Object.values(checks).every(Boolean) ? "verified" : "failed",
    checkedAt: new Date().toISOString(),
    fingerprint,
    checks,
    disclosure: "This reconciles checked-in synthetic evidence; it is not an event-log replay.",
  });
}
