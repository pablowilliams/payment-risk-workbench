import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  RadioTower,
  ShieldAlert,
  Siren,
  TrendingUp,
  UsersRound,
  Zap,
} from "lucide-react";
import { backtest, pipeline, programme } from "@/lib/data";
import { Badge, Header, Metric, Panel, Section, Score } from "../primitives";
const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});
export function CommandView({ go }: { go: (v: string) => void }) {
  const model = backtest.models.graph_ensemble;
  return (
    <div className="stack">
      <Header
        eyebrow="Operations / Evaluation snapshot · 04 September 2026"
        title="Payment risk overview"
        description="Synthetic payment risk, investigation capacity, customer safeguards and service health in one operating view."
        actions={
          <>
            <Badge tone="green">
              <RadioTower size={11} />
              Fixture healthy
            </Badge>
            <button className="primary" onClick={() => go("alerts")}>
              Open alert queue <ArrowRight size={14} />
            </button>
          </>
        }
      />
      <Panel className="decision-banner">
        <div>
          <Badge tone="amber">
            <ShieldAlert size={11} />
            Shadow-mode decision
          </Badge>
          <h2>{programme.decision}</h2>
          <p>
            Graph augmentation has passed the synthetic evidence gate. Human outcome review and
            time-based validation remain required.
          </p>
        </div>
        <aside>
          <span>Release evidence</span>
          <strong>6</strong>
          <small>/ 7 gates</small>
        </aside>
      </Panel>
      <div className="metrics">
        <Metric
          icon={Zap}
          label="Events processed"
          value="1,000,000"
          detail="Fixed synthetic holdout"
        />
        <Metric
          icon={Siren}
          label="Fraud recall"
          value={`${model.recall_pct}%`}
          detail="At 1% alert capacity"
        />
        <Metric
          icon={TrendingUp}
          label="Graph uplift"
          value={`+${backtest.uplift.graph_recall_vs_tabular_pp}pp`}
          detail="Recall vs tabular model"
        />
        <Metric
          icon={CircleDollarSign}
          label="Exposure detected"
          value={gbp.format(
            (backtest.population.fraud_value_gbp * model.fraud_value_capture_pct) / 100,
          )}
          detail="Synthetic; not recovered cash"
          tone="amber"
        />
      </div>
      <div className="grid command-grid">
        <Panel>
          <Section
            eyebrow="Scenario queue · Synthetic fixture"
            title="Capacity is the binding constraint"
            detail="Alert demand is held to the agreed one-percent budget."
          />
          <div className="capacity">
            <div className="capacity-ring">
              <span>
                <strong>76</strong>
                <small>% utilised</small>
              </span>
            </div>
            <div>
              <div>
                <span>Open investigations</span>
                <b>186</b>
              </div>
              <div>
                <span>Awaiting review</span>
                <b>42</b>
              </div>
              <div>
                <span>SLA at risk</span>
                <b className="amber-text">17</b>
              </div>
              <div>
                <span>Median age</span>
                <b>24 min</b>
              </div>
            </div>
          </div>
          <button className="text-action" onClick={() => go("alerts")}>
            Review prioritised exposure <ArrowRight size={13} />
          </button>
        </Panel>
        <Panel>
          <Section eyebrow="Detection comparison" title="One budget, three strategies" />
          <div className="model-bars">
            {Object.entries(backtest.models).map(([name, m]) => (
              <div key={name}>
                <div>
                  <b>{name.replaceAll("_", " ")}</b>
                  <span>{m.true_positives.toLocaleString()} true positives</span>
                </div>
                <Score value={m.recall_pct} label="recall" />
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <Section eyebrow="Streaming estate" title="Six contracts healthy" />
          <div className="compact-pipeline">
            {pipeline.slice(0, 5).map((x, i) => (
              <div key={x.name}>
                <span>
                  <i className={i === 4 ? "pulse" : ""} />
                  {x.name}
                </span>
                <b>{x.rate}</b>
                <small>{x.lag}</small>
              </div>
            ))}
          </div>
          <button className="text-action" onClick={() => go("platform")}>
            Inspect data lineage <ArrowRight size={13} />
          </button>
        </Panel>
      </div>
      <div className="grid lower-grid">
        <Panel>
          <Section eyebrow="Customer outcomes" title="Guardrails before optimisation" />
          <div className="outcome-list">
            <div>
              <CheckCircle2 size={15} />
              <span>
                <b>0 duplicate decisions</b>
                <small>Idempotency and ledger reconciliation passing</small>
              </span>
            </div>
            <div>
              <UsersRound size={15} />
              <span>
                <b>Human approval retained</b>
                <small>No autonomous account restrictions</small>
              </span>
            </div>
            <div>
              <Clock3 size={15} />
              <span>
                <b>8.07 ms synthetic P95</b>
                <small>Modelled scoring service latency</small>
              </span>
            </div>
          </div>
        </Panel>
        <Panel className="principle">
          <ShieldAlert size={21} />
          <span>Design principle</span>
          <h2>
            A risk score is evidence for a decision. It is never permission to harm a customer.
          </h2>
        </Panel>
      </div>
    </div>
  );
}
