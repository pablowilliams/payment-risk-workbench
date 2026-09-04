import test from "node:test";
import assert from "node:assert/strict";
import { approveDecision, buildDecision, getAlert } from "../lib/engine";

test("builds a bounded decision proposal from a known alert", () => {
  const alert = getAlert("PAY-0168935");
  assert.ok(alert);
  const decision = buildDecision(alert.id);
  assert.equal(decision.alertId, alert.id);
  assert.equal(decision.status, "awaiting_approval");
  assert.equal(decision.payloadHash.length, 20);
  assert.match(decision.rationale, /time-limited/i);
});
test("approval is bound to the exact payload", () => {
  const decision = buildDecision("PAY-0168935");
  assert.throws(
    () => approveDecision(decision, "00000000000000000000", "Reviewer"),
    /does not match/,
  );
  const approved = approveDecision(decision, decision.payloadHash, "Named Reviewer");
  assert.equal(approved.status, "approved");
  assert.equal(approved.approver, "Named Reviewer");
});
test("unknown alerts cannot create proposals", () =>
  assert.throws(() => buildDecision("not-real"), /not found/));
