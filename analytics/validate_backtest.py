#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
r = json.loads((ROOT / "data" / "backtest-results.json").read_text())
a = json.loads((ROOT / "data" / "alerts.json").read_text())
assert r["metadata"]["events"] == 1_000_000 and r["metadata"]["alert_budget"] == 10_000
assert sum(x["events"] for x in r["segments"]) == 1_000_000
assert len(a) == 60 and len({x["id"] for x in a}) == 60
assert all(
    0 <= m["precision_pct"] <= 100 and 0 <= m["recall_pct"] <= 100
    for m in r["models"].values()
)
assert (
    r["models"]["graph_ensemble"]["recall_pct"]
    > r["models"]["tabular"]["recall_pct"]
    > r["models"]["rules"]["recall_pct"]
)
assert (
    r["platform"]["trace_coverage_pct"] == 100
    and r["platform"]["duplicate_decisions"] == 0
)
assert "synthetic" in r["metadata"]["evaluation"].lower() and len(r["limitations"]) >= 5
assert all(
    a[i]["ensembleScore"] >= a[i + 1]["ensembleScore"] for i in range(len(a) - 1)
)
print(
    "PASS: one-million-event aggregate, fixed alert budget and regional denominators reconcile."
)
print(
    "PASS: ranked alert sample, model ordering, trace and disclosure gates satisfied."
)
