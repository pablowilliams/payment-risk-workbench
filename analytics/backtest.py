#!/usr/bin/env python3
"""Stream one million synthetic payments through three detection strategies."""

from __future__ import annotations
import heapq, json, math, random, statistics
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
SEED = 7312026
N = 1_000_000
BUDGET = 10_000
PATTERNS = [
    ("legitimate", 0.985),
    ("account_takeover", 0.005),
    ("mule_network", 0.004),
    ("card_testing", 0.0035),
    ("synthetic_identity", 0.0025),
]
FIRST = [
    "Amina",
    "Theo",
    "Maya",
    "Daniel",
    "Leah",
    "Owen",
    "Sara",
    "Isaac",
    "Nina",
    "Arthur",
    "Priya",
    "Lewis",
]
LAST = [
    "Patel",
    "Okoro",
    "Morgan",
    "King",
    "Thompson",
    "Bell",
    "Shah",
    "Grant",
    "Reed",
    "Clarke",
    "Evans",
    "Khan",
]


def choose(rng, items):
    x = rng.random()
    s = 0
    for value, p in items:
        s += p
        if x <= s:
            return value
    return items[-1][0]


def sigmoid(x):
    return 1 / (1 + math.exp(-max(-20, min(20, x))))


def push(heap, item):
    if len(heap) < BUDGET:
        heapq.heappush(heap, item)
    elif item[0] > heap[0][0]:
        heapq.heapreplace(heap, item)


def wilson(k, n, z=1.96):
    p = k / n
    d = 1 + z * z / n
    c = (p + z * z / (2 * n)) / d
    m = z * math.sqrt((p * (1 - p) + z * z / (4 * n)) / n) / d
    return [round(c - m, 4), round(c + m, 4)]


def main():
    DATA.mkdir(exist_ok=True)
    rng = random.Random(SEED)
    heaps = {k: [] for k in ["rules", "tabular", "graph_ensemble"]}
    fraud_count = 0
    fraud_value = 0
    pattern_totals = Counter()
    lat = []
    segments = defaultdict(lambda: {"n": 0, "fraud": 0, "value": 0})
    for i in range(N):
        pattern = choose(rng, PATTERNS)
        fraud = pattern != "legitimate"
        amount = max(1, min(25000, rng.lognormvariate(3.65, 1.1)))
        velocity = max(0, int(rng.gauss(2.1, 1.5)))
        new_device = rng.random() < 0.08
        geo = max(0, rng.gauss(38, 90))
        failed = max(0, int(rng.expovariate(1.4)))
        recipient_age = max(0, int(rng.expovariate(1 / 220)))
        shared = max(1, int(rng.expovariate(1 / 1.5)))
        neighbor = max(0, min(1, rng.betavariate(1.2, 12)))
        cycle = max(0, min(1, rng.betavariate(1, 18)))
        if pattern == "account_takeover":
            new_device = True
            geo += rng.uniform(450, 2500)
            velocity += rng.randint(4, 12)
            failed += rng.randint(2, 8)
        elif pattern == "mule_network":
            shared += rng.randint(5, 22)
            neighbor = max(neighbor, rng.uniform(0.35, 0.92))
            cycle = max(cycle, rng.uniform(0.12, 0.78))
            amount *= rng.uniform(2, 8)
        elif pattern == "card_testing":
            velocity += rng.randint(15, 55)
            failed += rng.randint(8, 35)
            amount = rng.uniform(1, 25)
        elif pattern == "synthetic_identity":
            recipient_age = min(recipient_age, rng.randint(0, 14))
            shared += rng.randint(2, 8)
            neighbor = max(neighbor, rng.uniform(0.12, 0.55))
            amount *= rng.uniform(1.5, 5)
        rule = min(
            1,
            (velocity >= 12) * 0.36
            + (failed >= 6) * 0.24
            + (geo >= 650) * 0.2
            + (shared >= 7) * 0.2
            + (amount >= 4000) * 0.12,
        )
        tab = sigmoid(
            -5.3
            + 0.105 * velocity
            + 0.34 * failed
            + 0.0014 * geo
            + 1.0 * new_device
            + 0.00018 * amount
            - 0.002 * min(recipient_age, 500)
            + rng.gauss(0, 0.6)
        )
        graph = sigmoid(
            -4.7
            + 0.27 * shared
            + 4.8 * neighbor
            + 3.1 * cycle
            - 0.001 * min(recipient_age, 500)
            + rng.gauss(0, 0.45)
        )
        ensemble = max(
            0, min(1, 0.57 * tab + 0.34 * graph + 0.09 * rule + rng.gauss(0, 0.08))
        )
        customer = f"{FIRST[i%len(FIRST)]} {LAST[(i*7)%len(LAST)]}"
        event_id = f"PAY-{i+1:07d}"
        account = f"AC-{(i*7919)%180000:06d}"
        region = ["London", "North West", "Scotland", "Midlands", "South East"][
            (i * 13) % 5
        ]
        record = {
            "id": event_id,
            "account": account,
            "customer": customer,
            "amount": round(amount, 2),
            "pattern": pattern,
            "fraud": fraud,
            "region": region,
            "ruleScore": round(rule, 4),
            "tabularScore": round(tab, 4),
            "graphScore": round(graph, 4),
            "ensembleScore": round(ensemble, 4),
            "signals": {
                "velocity1h": velocity,
                "newDevice": new_device,
                "geoDistanceKm": round(geo),
                "failedAuth24h": failed,
                "recipientAgeDays": recipient_age,
                "sharedDevices": shared,
                "riskyNeighborRatio": round(neighbor, 3),
                "cycleScore": round(cycle, 3),
            },
        }
        for name, score in [
            ("rules", rule),
            ("tabular", tab),
            ("graph_ensemble", ensemble),
        ]:
            push(
                heaps[name],
                (
                    score,
                    i,
                    fraud,
                    amount,
                    pattern,
                    record if name == "graph_ensemble" else None,
                ),
            )
        if fraud:
            fraud_count += 1
            fraud_value += amount
            pattern_totals[pattern] += 1
        segments[region]["n"] += 1
        segments[region]["fraud"] += int(fraud)
        segments[region]["value"] += amount if fraud else 0
        if i < 100000:
            lat.append(
                max(
                    0.7,
                    rng.gauss(5.8 + 2.5 * (shared > 6) + 1.6 * (velocity > 12), 1.3),
                )
            )
    models = {}
    for name, heap in heaps.items():
        alerts = sorted(heap, reverse=True)
        tp = sum(x[2] for x in alerts)
        captured = sum(x[3] for x in alerts if x[2])
        by = Counter(x[4] for x in alerts if x[2])
        models[name] = {
            "alerts": len(alerts),
            "true_positives": tp,
            "precision_pct": round(tp / len(alerts) * 100, 1),
            "recall_pct": round(tp / fraud_count * 100, 1),
            "fraud_value_capture_pct": round(captured / fraud_value * 100, 1),
            "precision_95ci": wilson(tp, len(alerts)),
            "pattern_recall_pct": {
                p: round(by[p] / pattern_totals[p] * 100, 1) for p in pattern_totals
            },
        }
    top = [x[5] for x in sorted(heaps["graph_ensemble"], reverse=True)[:60]]
    for rank, row in enumerate(top, 1):
        row["rank"] = rank
        row["status"] = ["New", "Investigating", "Awaiting review"][rank % 3]
        row["ageMinutes"] = (rank * 7) % 184
        row["exposure"] = round(
            row["amount"] * (1 + 0.4 * row["signals"]["riskyNeighborRatio"]), 2
        )
    result = {
        "metadata": {
            "project": "PulseLedger",
            "institution": "Verdant Bank (fictional)",
            "seed": SEED,
            "events": N,
            "alert_budget": BUDGET,
            "alert_rate_pct": 1.0,
            "evaluation": "synthetic streamed holdout",
            "claim_boundary": "Synthetic portfolio simulation only; not a production detection or banking outcome claim.",
        },
        "population": {
            "fraud_events": fraud_count,
            "fraud_rate_pct": round(fraud_count / N * 100, 2),
            "fraud_value_gbp": round(fraud_value),
        },
        "models": models,
        "uplift": {
            "graph_recall_vs_tabular_pp": round(
                models["graph_ensemble"]["recall_pct"]
                - models["tabular"]["recall_pct"],
                1,
            ),
            "graph_value_vs_tabular_pp": round(
                models["graph_ensemble"]["fraud_value_capture_pct"]
                - models["tabular"]["fraud_value_capture_pct"],
                1,
            ),
        },
        "platform": {
            "synthetic_scoring_p50_ms": round(statistics.median(lat), 2),
            "synthetic_scoring_p95_ms": round(sorted(lat)[int(0.95 * len(lat))], 2),
            "trace_coverage_pct": 100.0,
            "duplicate_decisions": 0,
        },
        "segments": [
            {
                "region": k,
                "events": v["n"],
                "fraud_events": v["fraud"],
                "fraud_rate_pct": round(v["fraud"] / v["n"] * 100, 2),
            }
            for k, v in segments.items()
        ],
        "limitations": [
            "All people, institutions, transactions, labels and outcomes are synthetic.",
            "Scores are generated from designed distributions and do not establish real-world efficacy.",
            "Synthetic scoring latency is a modelled service measure, not a cloud load test.",
            "Fraud value capture is detected exposure, not recovered cash.",
            "A production pilot requires time-based validation, fairness review, security testing and human oversight.",
        ],
    }
    (DATA / "backtest-results.json").write_text(json.dumps(result, indent=2))
    (DATA / "alerts.json").write_text(json.dumps(top, indent=2))
    print(
        json.dumps(
            {
                "population": result["population"],
                "models": models,
                "uplift": result["uplift"],
                "platform": result["platform"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
