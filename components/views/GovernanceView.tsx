import {
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Fingerprint,
  KeyRound,
  Scale,
  Shield,
  UsersRound,
} from "lucide-react";
import { Badge, Header, Panel, Section } from "../primitives";
const controls = [
  {
    id: "C-01",
    name: "No autonomous restriction",
    owner: "Investigation Director",
    evidence: "Approval contract + decision test",
    status: "Effective",
  },
  {
    id: "C-02",
    name: "Point-in-time feature integrity",
    owner: "ML Platform Lead",
    evidence: "Parity and replay checks",
    status: "Effective",
  },
  {
    id: "C-03",
    name: "Customer outcome monitoring",
    owner: "Consumer Duty Lead",
    evidence: "Cohort scorecard",
    status: "Pilot gate",
  },
  {
    id: "C-04",
    name: "Graph inference boundary",
    owner: "Model Risk",
    evidence: "Explanation standard",
    status: "Effective",
  },
  {
    id: "C-05",
    name: "Material-action kill switch",
    owner: "Service Owner",
    evidence: "Quarterly exercise",
    status: "Exercise due",
  },
];
export function GovernanceView() {
  return (
    <div className="stack">
      <Header
        eyebrow="Governance / Decision assurance"
        title="Decision controls and audit trail"
        description="Named control owners connect human authority, data lineage, model evidence, customer outcomes and operational response."
        actions={
          <Badge tone="amber">
            <AlertTriangle size={11} />2 pilot gates open
          </Badge>
        }
      />
      <div className="governance-hero">
        <Panel>
          <Section eyebrow="Assurance position" title="Controlled for shadow mode" />
          <div className="assurance-score">
            <div>
              <span>
                <strong>3</strong>
                <small>/5 effective</small>
              </span>
            </div>
            <aside>
              <b>Three controls effective; two gates remain open</b>
              <p>
                Ready for controlled investigation support. Not approved for autonomous restriction
                or customer communication.
              </p>
              <Badge tone="green">Recommendation only</Badge>
            </aside>
          </div>
        </Panel>
        <Panel className="human-card">
          <UsersRound size={25} />
          <span>Human accountability</span>
          <h2>A named investigator owns the action. A named supervisor owns the control.</h2>
          <p>The system can rank, assemble and propose. It cannot absorb accountability.</p>
        </Panel>
      </div>
      <Panel>
        <Section eyebrow="Control register" title="Controls with evidence and owners" />
        <div className="control-table">
          <header>
            <span>ID</span>
            <span>Control</span>
            <span>Accountable owner</span>
            <span>Current evidence</span>
            <span>Status</span>
          </header>
          {controls.map((c) => (
            <div key={c.id}>
              <span>{c.id}</span>
              <span>
                <b>{c.name}</b>
              </span>
              <span>{c.owner}</span>
              <span>{c.evidence}</span>
              <span>
                <Badge tone={c.status === "Effective" ? "green" : "amber"}>{c.status}</Badge>
              </span>
            </div>
          ))}
        </div>
      </Panel>
      <div className="grid governance-grid">
        <Panel>
          <Section eyebrow="Decision lineage" title="From event to human action" />
          <div className="lineage-list">
            <div>
              <Fingerprint size={15} />
              <span>
                <b>Event identity</b>
                <small>Payment ID, partition, offset and event time</small>
              </span>
              <CheckCircle2 size={14} />
            </div>
            <div>
              <FileCheck2 size={15} />
              <span>
                <b>Feature snapshot</b>
                <small>Definitions, values and point-in-time timestamp</small>
              </span>
              <CheckCircle2 size={14} />
            </div>
            <div>
              <Scale size={15} />
              <span>
                <b>Model and threshold</b>
                <small>Version, calibration and alert-budget policy</small>
              </span>
              <CheckCircle2 size={14} />
            </div>
            <div>
              <Shield size={15} />
              <span>
                <b>Evidence and proposal</b>
                <small>Graph, policy, rationale and immutable payload</small>
              </span>
              <CheckCircle2 size={14} />
            </div>
            <div>
              <KeyRound size={15} />
              <span>
                <b>Human approval</b>
                <small>Identity, time, scope and outcome</small>
              </span>
              <CheckCircle2 size={14} />
            </div>
          </div>
        </Panel>
        <Panel>
          <Section eyebrow="Material risks" title="Residual exposure remains visible" />
          <div className="risk-cards">
            <article>
              <Badge tone="red">High inherent</Badge>
              <b>False-positive customer harm</b>
              <p>Human review, time-limited action, contact route and cohort monitoring.</p>
              <span>Residual: Medium</span>
            </article>
            <article>
              <Badge tone="red">High inherent</Badge>
              <b>Attacker adaptation</b>
              <p>
                Drift monitoring, challenger models, threat intelligence and rapid rule release.
              </p>
              <span>Residual: Medium</span>
            </article>
            <article>
              <Badge tone="amber">Medium inherent</Badge>
              <b>Benefits overstatement</b>
              <p>Detected exposure remains separate from recovered cash and realised capacity.</p>
              <span>Residual: Low</span>
            </article>
          </div>
        </Panel>
      </div>
    </div>
  );
}
