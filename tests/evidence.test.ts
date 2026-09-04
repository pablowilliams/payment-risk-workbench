import test from "node:test";
import assert from "node:assert/strict";
import { alerts, backtest, graphEdges, graphNodes } from "../lib/data";

test("headline evidence uses a fixed one-percent alert budget", () => {
  assert.equal(backtest.metadata.events, 1_000_000);
  for (const model of Object.values(backtest.models)) assert.equal(model.alerts, 10_000);
  assert.ok(backtest.models.graph_ensemble.recall_pct > backtest.models.tabular.recall_pct);
});
test("curated alerts are ordered and disclosed as synthetic", () => {
  assert.equal(alerts.length, 60);
  assert.deepEqual(
    alerts.map((a) => a.rank),
    Array.from({ length: 60 }, (_, i) => i + 1),
  );
  assert.match(backtest.metadata.evaluation, /synthetic/i);
});
test("every graph edge resolves to a declared node", () => {
  const ids = new Set(graphNodes.map((n) => n.id));
  for (const edge of graphEdges) {
    assert.ok(ids.has(edge.source));
    assert.ok(ids.has(edge.target));
  }
});
