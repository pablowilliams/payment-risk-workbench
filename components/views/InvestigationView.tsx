"use client";
import { useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  LockKeyhole,
  MapPin,
  Network,
  ShieldCheck,
  Smartphone,
  UserRound,
  WalletCards,
} from "lucide-react";
import { alerts, policies, reasonCodes } from "@/lib/data";
import type { InvestigationDecision, PaymentAlert } from "@/lib/types";
import { Badge, Header, Panel, Section } from "../primitives";
const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 2,
});
export function InvestigationView() {
  const [alert, setAlert] = useState<PaymentAlert>(alerts[0]),
    [decision, setDecision] = useState<InvestigationDecision | null>(null),
    [notice, setNotice] = useState("");
  useEffect(() => {
    const id = sessionStorage.getItem("pulse-alert");
    const found = alerts.find((a) => a.id === id);
    if (found) requestAnimationFrame(() => setAlert(found));
  }, []);
  async function propose() {
    setNotice("");
    const r = await fetch("/api/decisions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ alertId: alert.id }),
    });
    setDecision(await r.json());
  }
  async function approve() {
    if (!decision) return;
    const r = await fetch("/api/decisions", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        decisionId: decision.id,
        payloadHash: decision.payloadHash,
        approver: "Pablo Williams",
      }),
    });
    const body = await r.json();
    if (r.ok) {
      setDecision(body);
      setNotice("The exact time-limited decision was approved in simulation.");
    } else setNotice(body.error);
  }
  return (
    <div className="stack">
      <Header
        eyebrow={`Investigation / ${alert.id}`}
        title="Make the evidence challengeable."
        description="One workspace for transaction behaviour, identity, network context, model reasoning, policy and a proportionate human decision."
        actions={
          <>
            <Badge tone={alert.ensembleScore >= 0.9 ? "red" : "amber"}>
              {Math.round(alert.ensembleScore * 100)}% ensemble risk
            </Badge>
            <Badge>{alert.status}</Badge>
          </>
        }
      />
      <div className="investigation-grid">
        <div className="investigation-main">
          <Panel className="customer-card">
            <header>
              <div className="customer-big">
                {alert.customer
                  .split(" ")
                  .map((x) => x[0])
                  .join("")}
              </div>
              <div>
                <span>Synthetic customer</span>
                <h2>{alert.customer}</h2>
                <p>
                  {alert.account} · {alert.region} · Retail current account
                </p>
              </div>
              <Badge tone="amber">Enhanced review</Badge>
            </header>
            <div className="customer-facts">
              <div>
                <UserRound size={14} />
                <span>
                  Customer since<b>4 years, 2 months</b>
                </span>
              </div>
              <div>
                <Smartphone size={14} />
                <span>
                  Device tenure<b>First seen today</b>
                </span>
              </div>
              <div>
                <MapPin size={14} />
                <span>
                  Location variance<b>{alert.signals.geoDistanceKm} km</b>
                </span>
              </div>
              <div>
                <WalletCards size={14} />
                <span>
                  Payment<b>{gbp.format(alert.amount)}</b>
                </span>
              </div>
            </div>
          </Panel>
          <Panel>
            <Section
              eyebrow="Evidence timeline"
              title="What changed, and when"
              action={
                <Badge tone="blue">
                  <Clock3 size={11} />
                  Event time
                </Badge>
              }
            />
            <div className="timeline-events">
              <div>
                <i />
                <span>15:48</span>
                <article>
                  <b>New device enrolled</b>
                  <p>Device fingerprint has no prior relationship with this customer.</p>
                </article>
              </div>
              <div>
                <i />
                <span>16:03</span>
                <article>
                  <b>Authentication failures</b>
                  <p>
                    {alert.signals.failedAuth24h} failed attempts observed before successful
                    authentication.
                  </p>
                </article>
              </div>
              <div>
                <i />
                <span>16:17</span>
                <article>
                  <b>Beneficiary created</b>
                  <p>
                    Recipient age {alert.signals.recipientAgeDays} days; connected to elevated-risk
                    neighbours.
                  </p>
                </article>
              </div>
              <div className="risk">
                <i />
                <span>16:24</span>
                <article>
                  <b>Payment scored and held for review</b>
                  <p>
                    {gbp.format(alert.amount)} outbound payment; ensemble risk{" "}
                    {Math.round(alert.ensembleScore * 100)}%.
                  </p>
                </article>
              </div>
            </div>
          </Panel>
          <Panel>
            <Section
              eyebrow="Network evidence"
              title="Connected risk, not guilt"
              action={<Network size={17} />}
            />
            <div className="network-preview">
              <div className="node centre">{alert.customer.split(" ")[0]}</div>
              <div className="node device">Shared device</div>
              <div className="node account">Linked A/C</div>
              <div className="node beneficiary">Beneficiary</div>
              <svg viewBox="0 0 100 50">
                <path d="M50 25L18 12M50 25L18 40M50 25L82 14M50 25L82 40" />
                <circle cx="50" cy="25" r="3" />
              </svg>
            </div>
          </Panel>
        </div>
        <aside className="investigation-side">
          <Panel>
            <Section eyebrow="Detection rationale" title="Why this alert ranked" />
            {reasonCodes.map((x) => (
              <div className="reason" key={x.name}>
                <div>
                  <b>{x.name}</b>
                  <strong>{x.value}</strong>
                </div>
                <i>
                  <b style={{ width: `${x.value}%` }} />
                </i>
                <small>{x.detail}</small>
              </div>
            ))}
            <div className="model-scores">
              <span>
                Rules<b>{Math.round(alert.ruleScore * 100)}%</b>
              </span>
              <span>
                Tabular<b>{Math.round(alert.tabularScore * 100)}%</b>
              </span>
              <span>
                Graph<b>{Math.round(alert.graphScore * 100)}%</b>
              </span>
            </div>
          </Panel>
          <Panel>
            <Section eyebrow="Policy grounding" title="Decision constraints" />
            {policies.map((p) => (
              <details key={p.id}>
                <summary>
                  <FileText size={13} />
                  <span>
                    <b>{p.id}</b>
                    {p.title}
                  </span>
                </summary>
                <p>{p.excerpt}</p>
                <small>Effective {p.effective}</small>
              </details>
            ))}
          </Panel>
          <Panel className="decision-panel">
            <Section eyebrow="Human decision" title="Propose a proportionate action" />
            {!decision && (
              <>
                <p>
                  The system may assemble and propose. Only a named investigator may approve a
                  customer-impacting action.
                </p>
                <button className="primary wide" onClick={propose}>
                  <LockKeyhole size={14} />
                  Prepare decision proposal
                </button>
              </>
            )}
            {decision && (
              <div className="proposal">
                <Badge tone={decision.status === "approved" ? "green" : "amber"}>
                  {decision.status.replaceAll("_", " ")}
                </Badge>
                <h3>{decision.recommendedAction.replaceAll("_", " ")}</h3>
                <p>{decision.rationale}</p>
                <ul>
                  {decision.evidence.slice(0, 4).map((x) => (
                    <li key={x}>
                      <Check size={11} />
                      {x}
                    </li>
                  ))}
                </ul>
                <code>{decision.payloadHash}</code>
                {decision.status === "awaiting_approval" && (
                  <button className="primary wide" onClick={approve}>
                    <ShieldCheck size={14} />
                    Approve exact payload
                  </button>
                )}
              </div>
            )}
            {notice && (
              <div className="notice">
                <CheckCircle2 size={14} />
                {notice}
              </div>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}
