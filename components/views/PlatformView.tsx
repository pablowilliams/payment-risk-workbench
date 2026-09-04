import {
  Activity,
  Archive,
  ArrowRight,
  Database,
  GitBranch,
  HardDrive,
  RadioTower,
  RotateCcw,
  ServerCog,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { backtest, pipeline } from "@/lib/data";
import { Badge, Header, Metric, Panel, Section } from "../primitives";
export function PlatformView() {
  return (
    <div className="stack">
      <Header
        eyebrow="Data platform / Streaming estate"
        title="A million events with lineage intact."
        description="Replayable contracts connect payment ingestion, event-time features, graph enrichment, detection, alerts and immutable decisions."
        actions={
          <>
            <Badge tone="green">
              <RadioTower size={11} />6 / 6 contracts healthy
            </Badge>
            <button className="secondary">
              <RotateCcw size={13} />
              Replay controls
            </button>
          </>
        }
      />
      <div className="metrics">
        <Metric icon={Zap} label="Processed events" value="1,000,000" detail="Fixed-seed holdout" />
        <Metric
          icon={Activity}
          label="Synthetic P95"
          value={`${backtest.platform.synthetic_scoring_p95_ms} ms`}
          detail="Scoring service model"
        />
        <Metric
          icon={GitBranch}
          label="Trace coverage"
          value="100%"
          detail="Event to decision lineage"
        />
        <Metric
          icon={Archive}
          label="Duplicate decisions"
          value="0"
          detail="Idempotency gate passing"
          tone="amber"
        />
      </div>
      <Panel>
        <Section
          eyebrow="Event backbone"
          title="From payment to decision"
          detail="Rates and lag are representative operating-state fixtures for the portfolio interface."
        />
        <div className="pipeline-flow">
          {pipeline.map((x, i) => (
            <article key={x.name}>
              <header>
                <span>0{i + 1}</span>
                <i className={i === pipeline.length - 1 ? "pulse" : ""} />
              </header>
              <ServerCog size={18} />
              <b>{x.name}</b>
              <small>{x.rate}</small>
              <footer>
                <span>{x.lag} lag</span>
                <Badge tone="green">Healthy</Badge>
              </footer>
              {i < pipeline.length - 1 && <ArrowRight className="flow-arrow" size={15} />}
            </article>
          ))}
        </div>
      </Panel>
      <div className="grid platform-grid">
        <Panel>
          <Section eyebrow="Data quality" title="Contract health by stage" />
          {pipeline.map((x) => (
            <div className="quality-row" key={x.name}>
              <span>
                <Database size={13} />
                <b>{x.name}</b>
              </span>
              <i>
                <b style={{ width: `${x.quality}%` }} />
              </i>
              <strong>{x.quality}%</strong>
            </div>
          ))}
        </Panel>
        <Panel>
          <Section eyebrow="Storage and replay" title="Immutable source, reproducible features" />
          <div className="storage-map">
            <div>
              <HardDrive size={18} />
              <span>
                <b>Raw event archive</b>
                <small>Partitioned by event date · immutable</small>
              </span>
              <Badge tone="green">365d</Badge>
            </div>
            <div>
              <GitBranch size={18} />
              <span>
                <b>Feature snapshots</b>
                <small>Point-in-time correct · versioned</small>
              </span>
              <Badge>90d</Badge>
            </div>
            <div>
              <ShieldCheck size={18} />
              <span>
                <b>Decision ledger</b>
                <small>Append-only · encrypted</small>
              </span>
              <Badge tone="amber">7y</Badge>
            </div>
            <div>
              <Archive size={18} />
              <span>
                <b>Model evidence</b>
                <small>Data fingerprint · evaluation · approval</small>
              </span>
              <Badge>Life + 1y</Badge>
            </div>
          </div>
        </Panel>
      </div>
      <Panel className="architecture-strip">
        <span>LOCAL PROOF</span>
        <b>Generator</b>
        <ArrowRight />
        <b>Redpanda</b>
        <ArrowRight />
        <b>Feature service</b>
        <ArrowRight />
        <b>Graph enrichment</b>
        <ArrowRight />
        <b>Detection</b>
        <ArrowRight />
        <b>Case API</b>
        <i />
        <span>AWS TARGET</span>
        <b>MSK</b>
        <ArrowRight />
        <b>Flink</b>
        <ArrowRight />
        <b>Neptune</b>
        <ArrowRight />
        <b>SageMaker</b>
        <ArrowRight />
        <b>EKS / Lambda</b>
      </Panel>
    </div>
  );
}
