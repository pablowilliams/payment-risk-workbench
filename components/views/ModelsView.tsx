"use client";
import { useState } from "react";
import {
  Activity,
  Beaker,
  CheckCircle2,
  GitCompareArrows,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { backtest } from "@/lib/data";
import { Badge, Header, Metric, Panel, Section } from "../primitives";
export function ModelsView() {
  const [threshold, setThreshold] = useState(86);
  const names = {
    rules: "Rules baseline",
    tabular: "Tabular model",
    graph_ensemble: "Graph ensemble",
  };
  return (
    <div className="stack">
      <Header
        eyebrow="Model operations / Registry"
        title="Performance with a release history."
        description="Champion and challengers share one fixed holdout, alert budget and metric dictionary. Promotion requires evidence and named risk acceptance."
        actions={
          <Badge tone="green">
            <CheckCircle2 size={11} />
            Champion healthy
          </Badge>
        }
      />
      <div className="model-header">
        <Panel>
          <span>Production champion</span>
          <div>
            <div className="model-logo">
              <GitCompareArrows size={19} />
            </div>
            <div>
              <h2>graph-ensemble-2026.09.1</h2>
              <p>Rules + calibrated tabular risk + network features</p>
            </div>
          </div>
          <footer>
            <Badge tone="green">Shadow approved</Badge>
            <span>Released 04 Sep 2026</span>
            <span>Owner: Fraud Strategy</span>
          </footer>
        </Panel>
        <Panel>
          <Section eyebrow="Threshold simulator" title="Capacity before accuracy" />
          <label>
            <span>
              Decision threshold<b>{threshold}%</b>
            </span>
            <input
              type="range"
              min="60"
              max="98"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
          </label>
          <div className="threshold-result">
            <span>
              Estimated alert rate<b>{Math.max(0.2, (100 - threshold) * 0.071).toFixed(2)}%</b>
            </span>
            <span>
              Queue demand<b>{Math.round((10000 * (100 - threshold)) / 14).toLocaleString()}</b>
            </span>
          </div>
          <small>
            Scenario only. The evaluated headline uses a fixed one-percent alert budget.
          </small>
        </Panel>
      </div>
      <div className="metrics">
        <Metric
          icon={TrendingUp}
          label="Champion recall"
          value={`${backtest.models.graph_ensemble.recall_pct}%`}
          detail="At 10,000 alerts"
        />
        <Metric
          icon={ShieldCheck}
          label="Precision"
          value={`${backtest.models.graph_ensemble.precision_pct}%`}
          detail="95% CI 95.8%-96.5%"
        />
        <Metric
          icon={Activity}
          label="Value capture"
          value={`${backtest.models.graph_ensemble.fraud_value_capture_pct}%`}
          detail="Detected synthetic exposure"
        />
        <Metric
          icon={Beaker}
          label="Graph recall uplift"
          value={`+${backtest.uplift.graph_recall_vs_tabular_pp}pp`}
          detail="Ablation vs tabular"
          tone="amber"
        />
      </div>
      <Panel>
        <Section
          eyebrow="Champion / challenger"
          title="Same holdout. Same capacity. Visible trade-offs."
        />
        <div className="comparison">
          <header>
            <span>Strategy</span>
            <span>Precision</span>
            <span>Recall</span>
            <span>Value capture</span>
            <span>Alerts</span>
            <span>Release state</span>
          </header>
          {Object.entries(backtest.models).map(([key, m], i) => (
            <div key={key}>
              <span>
                <i className={`model-dot m${i}`} />
                <b>{names[key as keyof typeof names]}</b>
                <small>
                  {key === "graph_ensemble" ? "Current champion" : "Benchmark challenger"}
                </small>
              </span>
              <span>{m.precision_pct}%</span>
              <span>{m.recall_pct}%</span>
              <span>{m.fraud_value_capture_pct}%</span>
              <span>{m.alerts.toLocaleString()}</span>
              <span>
                <Badge tone={key === "graph_ensemble" ? "green" : "neutral"}>
                  {key === "graph_ensemble" ? "Champion" : "Shadow"}
                </Badge>
              </span>
            </div>
          ))}
        </div>
      </Panel>
      <div className="grid drift-grid">
        <Panel>
          <Section
            eyebrow="Drift monitoring"
            title="No material shift detected"
            action={<Badge tone="green">Within envelope</Badge>}
          />
          <div className="drift-chart">
            <svg viewBox="0 0 500 130" preserveAspectRatio="none">
              <path d="M0 72 C40 68 60 80 100 71 S160 57 200 69 S270 83 310 65 S380 58 420 72 S470 81 500 67" />
              <path className="baseline" d="M0 78L500 78" />
            </svg>
            <div>
              <span>-30d</span>
              <span>-20d</span>
              <span>-10d</span>
              <span>Today</span>
            </div>
          </div>
        </Panel>
        <Panel>
          <Section eyebrow="Release evidence" title="Promotion gate 6 / 7" />
          <ul className="release-checks">
            <li>
              <CheckCircle2 size={14} />
              Fixed holdout evaluation
            </li>
            <li>
              <CheckCircle2 size={14} />
              Feature parity checks
            </li>
            <li>
              <CheckCircle2 size={14} />
              Graph ablation
            </li>
            <li>
              <CheckCircle2 size={14} />
              Cohort review
            </li>
            <li>
              <CheckCircle2 size={14} />
              Rollback rehearsal
            </li>
            <li>
              <CheckCircle2 size={14} />
              Model risk approval
            </li>
            <li className="pending">
              <Activity size={14} />
              Live shadow outcomes
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
