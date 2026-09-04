import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { GET as listAlerts } from "../app/api/alerts/route";
import { GET as reconcileEvidence } from "../app/api/reconciliation/route";
import { POST as propose, PUT as approve } from "../app/api/decisions/route";

const body = JSON.stringify({ alertId: "PAY-0168935" });

test("decision routes enforce role separation and exact approval state", async () => {
  const unauthorised = await propose(
    new NextRequest("http://localhost/api/decisions", { method: "POST", body }),
  );
  assert.equal(unauthorised.status, 403);

  const headers = {
    "content-type": "application/json",
    "x-demo-role": "investigator",
    "x-actor-id": "route-investigator",
    "idempotency-key": "route-contract-test",
  };
  const created = await propose(
    new NextRequest("http://localhost/api/decisions", { method: "POST", headers, body }),
  );
  assert.equal(created.status, 201);
  const decision = await created.json();

  const replay = await propose(
    new NextRequest("http://localhost/api/decisions", { method: "POST", headers, body }),
  );
  assert.equal(replay.status, 200);
  assert.equal((await replay.json()).id, decision.id);

  const approvalBody = JSON.stringify({
    decisionId: decision.id,
    payloadHash: decision.payloadHash,
  });
  const selfApproval = await approve(
    new NextRequest("http://localhost/api/decisions", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-demo-role": "supervisor",
        "x-actor-id": "route-investigator",
      },
      body: approvalBody,
    }),
  );
  assert.equal(selfApproval.status, 409);

  const approved = await approve(
    new NextRequest("http://localhost/api/decisions", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-demo-role": "supervisor",
        "x-actor-id": "route-supervisor",
      },
      body: approvalBody,
    }),
  );
  assert.equal(approved.status, 200);
  assert.equal((await approved.json()).approver, "route-supervisor");

  const repeated = await approve(
    new NextRequest("http://localhost/api/decisions", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-demo-role": "supervisor",
        "x-actor-id": "another-supervisor",
      },
      body: approvalBody,
    }),
  );
  assert.equal(repeated.status, 409);
});

test("alert route rejects malformed numeric filters", async () => {
  const response = listAlerts(new NextRequest("http://localhost/api/alerts?minimumRisk=wrong"));
  assert.equal(response.status, 400);
});

test("evidence reconciliation returns a complete SHA-256 fingerprint", async () => {
  const response = reconcileEvidence();
  const result = await response.json();
  assert.equal(result.status, "verified");
  assert.equal(result.fingerprint.length, 64);
  assert.ok(Object.values(result.checks).every(Boolean));
});
