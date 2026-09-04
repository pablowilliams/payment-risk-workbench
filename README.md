# PulseLedger

**Human-centred, real-time financial-crime intelligence — built as an interviewer-verifiable engineering portfolio.**

PulseLedger is an investigation platform for the fictional Verdant Bank. It connects streaming payment contracts, behavioural and graph detection, capacity-aware alert ranking, explainable investigation evidence, bounded AI tooling and exact-payload human approval. The result looks and behaves like an internal product, while keeping every claim inspectable and honest.

> All people, payments, labels, exposure, latency and operating telemetry are synthetic or modelled. This is not connected to a bank and it does not claim production performance.

## The operating question

Fraud teams do not have unlimited review capacity. PulseLedger asks: at the same one-percent alert budget, can graph context find more labelled fraud without turning network proximity into guilt?

| Fixed-seed synthetic holdout |  Rules | Tabular | Graph ensemble |
| ---------------------------- | -----: | ------: | -------------: |
| Precision                    |  80.0% |   84.0% |      **96.2%** |
| Recall                       |  54.0% |   56.7% |      **64.9%** |
| Labelled exposure captured   |  29.1% |   16.8% |      **55.0%** |
| Alerts                       | 10,000 |  10,000 |         10,000 |

Across **1,000,000 generated payments**, the graph ensemble produced **+8.2 percentage points recall** and **+38.2 points synthetic exposure capture** versus the tabular challenger at identical capacity. These are portfolio backtest results, not realised fraud savings.

## What an interviewer can open

- **Command centre** — decision, service health, queue pressure and evidence confidence in one operational view.
- **Alert queue** — searchable, risk-filtered cases ranked by consequence within fixed capacity.
- **Investigation workspace** — customer context, event timeline, graph evidence, model reason codes, policy grounding and a working decision flow.
- **Network graph** — interactive bounded traversal with an explicit interpretation boundary.
- **Model operations** — champion/challenger evidence, threshold scenario, drift and promotion gates.
- **Data platform** — streaming contracts, quality, lag, replay, lineage and local/AWS architecture.
- **Governance** — control owners, evidence, residual risks and event-to-human decision reconstruction.

Press `⌘ K` or `Ctrl K` for the command palette. The interface is responsive and deliberately uses the language and density of an internal operations product rather than a generic AI landing page.

## Run locally

Requirements: Node.js 22+ and Python 3.12+.

```bash
npm install
npm run backtest
npm run validate:backtest
npm run dev
```

Open [http://localhost:3003](http://localhost:3003). The web proof has no external service dependency. Optional local infrastructure is available with `docker compose up -d`.

## Verify everything

```bash
npm run check
```

The gate runs ESLint, TypeScript, decision-control and evidence tests, the independent backtest validator, and a production Next.js build. CI also regenerates the million-event evidence and fails if checked-in outputs drift.

Useful API probes:

```bash
curl http://localhost:3003/api/health
curl 'http://localhost:3003/api/alerts?minimumRisk=0.9&limit=3'
curl http://localhost:3003/api/metrics
curl -N http://localhost:3003/api/stream
```

The investigation UI calls `POST /api/decisions` to prepare a recommendation and `PUT /api/decisions` to approve the exact 20-character payload hash. A changed payload or stale state is rejected.

## Repository map

```text
app/                 Next.js product and route handlers
components/          seven operational product views
analytics/           streaming generator, backtest and independent validator
data/                reproducible aggregate evidence and curated alert sample
contracts/           OpenAPI, AsyncAPI and bounded MCP tool definitions
infra/terraform/     encrypted evidence, decision ledger, queues and alarms
docs/                architecture, evaluation, system card, NFRs and threat model
docs/adr/            consequential design decisions
docs/runbooks/       kill switch, stream lag and model drift response
tests/               authority, evidence and graph integrity tests
public/               exact 75-page long-term delivery blueprint
```

## Architecture and control model

The local proof maps Redpanda, PostgreSQL and Neo4j to an AWS target using MSK, Managed Service for Apache Flink, Neptune, DynamoDB, S3, KMS and CloudWatch. Terraform demonstrates encrypted evidence storage, point-in-time recovery, DLQ isolation and alarms without provisioning paid infrastructure.

The core invariant is deliberately simple:

> The machine may rank, assemble and propose. A named human owns every material action.

See [architecture](docs/architecture.md), [evaluation](docs/evaluation.md), [system card](docs/system-card.md), [threat model](docs/threat-model.md), [NFR matrix](docs/nfr-matrix.md), and the [CV evidence ledger](docs/cv-evidence-ledger.md).

## Evidence limitations

The generator simplifies label delay, adversarial adaptation, investigator inconsistency and customer behaviour. The 60 displayed alerts are a curated extract of the top-ranked result set. Synthetic latency is modelled, not produced by a controlled load test. Before any live pilot, the open gates are forward-time shadow outcomes, security and privacy assurance, accessibility testing, subgroup review, recovery exercises and formal model-risk acceptance.

## Long-term blueprint

The bundled [75-page delivery blueprint](public/pulseledger-blueprint.pdf) covers discovery, service design, streaming data, graph modelling, agentic workflows, MLOps, resilience, governance, delivery sequence, interview evidence and CV positioning. It is the programme contract behind this implementation.

## Licence

MIT. Built by Pablo Williams as a portfolio project.
