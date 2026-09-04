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
import { alerts, policies, reasonCodesFor } from "@/lib/data";
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
    [notice, setNotice] = useState(""),
    [working, setWorking] = useState<"proposal" | "approval" | null>(null);
  useEffect(() => {
    const id = sessionStorage.getItem("pulse-alert");
    const found = alerts.find((a) => a.id === id);
    if (found) requestAnimationFrame(() => setAlert(found));
  }, []);
  const reasonCodes = reasonCodesFor(alert);
  async function propose() {
    setNotice("");
    setWorking("proposal");
    try {
      const r = await fetch("/api/decisions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-demo-role": "investigator",
          "x-actor-id": "investigator-042",
          "idempotency-key": `proposal-${alert.id}`,
        },
        body: JSON.stringify({ alertId: alert.id }),
      });
      const body = await r.json();
      if (!r.ok) throw new Error(body.error ?? "Proposal could not be prepared");
      setDecision(body);
      setNotice("Proposal prepared for an independent supervisor review.");
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "Proposal could not be prepared");
    } finally {
      setWorking(null);
    }
  }
  async function approve() {
    if (!decision) return;
    setWorking("approval");
    try {
      const r = await fetch("/api/decisions", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-demo-role": "supervisor",
          "x-actor-id": "supervisor-007",
        },
        body: JSON.stringify({
          decisionId: decision.id,
          payloadHash: decision.payloadHash,
        }),
      });
      const body = await r.json();
      if (!r.ok) throw new Error(body.error ?? "Approval could not be recorded");
      setDecision(body);
      setNotice("Supervisor approval recorded for the exact, time-limited payload.");
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "Approval could not be recorded");
    } finally {
      setWorking(null);
    }
  }
  return (
    <div className="stack">
      <Header
        eyebrow={`Investigation / ${alert.id}`}
        title="Review payment evidence"
        description="Transaction behaviour, identity, network context, model reasoning and policy are shown together before a supervisor records a decision."
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
                  Device tenure<b>{alert.signals.newDevice ? "First seen today" : "Recognised"}</b>
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
                  <b>{alert.signals.newDevice ? "New device observed" : "Known device observed"}</b>
                  <p>
                    {alert.signals.newDevice
                      ? "The device fingerprint has no prior relationship with this customer."
                      : "The device fingerprint has an existing relationship with this customer."}
                  </p>
                </article>
              </div>
              <div>
                <i />
                <span>16:03</span>
                <article>
                  <b>Authentication failures</b>
                  <p>
                    {alert.signals.failedAuth24h === 0
                      ? "No failed attempts were observed in the prior 24 hours."
                      : `${alert.signals.failedAuth24h} failed attempts were observed before successful authentication.`}
                  </p>
                </article>
              </div>
              <div>
                <i />
                <span>16:17</span>
                <article>
                  <b>Beneficiary age reviewed</b>
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
                  An investigator can prepare a proposal. A different, named supervisor must approve
                  any customer-impacting action.
                </p>
                <button className="primary wide" onClick={propose} disabled={working !== null}>
                  <LockKeyhole size={14} />
                  {working === "proposal" ? "Preparing proposal…" : "Prepare decision proposal"}
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
                <dl className="proposal-meta">
                  <div>
                    <dt>Prepared by</dt>
                    <dd>{decision.proposedBy}</dd>
                  </div>
                  <div>
                    <dt>Scope</dt>
                    <dd>{decision.actionScope.replaceAll("_", " ")}</dd>
                  </div>
                  <div>
                    <dt>Expires</dt>
                    <dd>{new Date(decision.expiresAt).toLocaleTimeString("en-GB")}</dd>
                  </div>
                </dl>
                <code>{decision.payloadHash}</code>
                {decision.status === "awaiting_approval" && (
                  <button className="primary wide" onClick={approve} disabled={working !== null}>
                    <ShieldCheck size={14} />
                    {working === "approval" ? "Recording approval…" : "Approve exact payload"}
                  </button>
                )}
              </div>
            )}
            {notice && (
              <div className="notice" role="status" aria-live="polite">
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
