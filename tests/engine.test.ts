import test from "node:test";
import assert from "node:assert/strict";
import { approveDecision, buildDecision, getAlert } from "../lib/engine";

test("builds a bounded decision proposal from a known alert", () => {
  const alert = getAlert("PAY-0168935");
  assert.ok(alert);
  const decision = buildDecision(alert.id, "investigator-042");
  assert.equal(decision.alertId, alert.id);
  assert.equal(decision.status, "awaiting_approval");
  assert.equal(decision.payloadHash.length, 64);
  assert.equal(decision.proposedBy, "investigator-042");
  assert.equal(decision.actionScope, "outbound_payments");
  assert.match(decision.rationale, /time-limited/i);
});
test("approval is bound to the exact payload", () => {
  const decision = buildDecision("PAY-0168935", "investigator-042");
  assert.throws(
    () => approveDecision(decision, "0".repeat(64), "supervisor-007"),
    /does not match/,
  );
  assert.throws(
    () => approveDecision(decision, decision.payloadHash, "investigator-042"),
    /cannot approve their own/,
  );
  const approved = approveDecision(decision, decision.payloadHash, "supervisor-007");
  assert.equal(approved.status, "approved");
  assert.equal(approved.approver, "supervisor-007");
});
test("unknown alerts cannot create proposals", () =>
  assert.throws(() => buildDecision("not-real"), /not found/));
test("expired proposals cannot be approved", () => {
  const decision = buildDecision("PAY-0168935", "investigator-042");
  decision.expiresAt = "2000-01-01T00:00:00.000Z";
  assert.throws(() => approveDecision(decision, decision.payloadHash, "supervisor-007"), /expired/);
});
