"use client";
import { useMemo, useState } from "react";
import { ArrowRight, Filter, Search, SlidersHorizontal } from "lucide-react";
import { alerts } from "@/lib/data";
import { Badge, Header, Panel } from "../primitives";
const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});
export function AlertsView({ go }: { go: (v: string) => void }) {
  const [q, setQ] = useState(""),
    [risk, setRisk] = useState("All");
  const rows = useMemo(
    () =>
      alerts.filter(
        (a) =>
          (a.customer + a.id + a.pattern).toLowerCase().includes(q.toLowerCase()) &&
          (risk === "All" ||
            (risk === "Critical" ? a.ensembleScore >= 0.9 : a.ensembleScore < 0.9)),
      ),
    [q, risk],
  );
  return (
    <div className="stack">
      <Header
        eyebrow="Investigations / Prioritised queue"
        title="The few cases that deserve attention."
        description="Alerts are ranked by expected customer and financial consequence within a fixed investigator capacity - not by score alone."
        actions={<Badge tone="green">10,000 annual alert budget</Badge>}
      />
      <Panel>
        <div className="queue-tools">
          <label>
            <Search size={14} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search customer, payment or pattern"
            />
          </label>
          <div>
            <Filter size={13} />
            {["All", "Critical", "Elevated"].map((x) => (
              <button key={x} className={risk === x ? "active" : ""} onClick={() => setRisk(x)}>
                {x}
              </button>
            ))}
          </div>
          <button>
            <SlidersHorizontal size={13} />
            Columns
          </button>
        </div>
        <div className="queue-summary">
          <span>
            <b>{rows.length}</b> visible curated alerts
          </span>
          <span>
            <i className="critical" />
            Critical <b>{alerts.filter((a) => a.ensembleScore >= 0.9).length}</b>
          </span>
          <span>
            <i className="elevated" />
            Elevated <b>{alerts.filter((a) => a.ensembleScore < 0.9).length}</b>
          </span>
          <small>Top 60 evidence sample from 10,000 alerts</small>
        </div>
        <div className="alert-table">
          <header>
            <span>Priority</span>
            <span>Customer / payment</span>
            <span>Pattern</span>
            <span>Exposure</span>
            <span>Risk</span>
            <span>Status</span>
            <span>Age</span>
            <span />
          </header>
          {rows.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                sessionStorage.setItem("pulse-alert", a.id);
                go("investigation");
              }}
            >
              <span>
                <i className={a.ensembleScore >= 0.9 ? "critical" : "elevated"} />
                {String(a.rank).padStart(2, "0")}
              </span>
              <span>
                <b>{a.customer}</b>
                <small>
                  {a.id} · {a.account}
                </small>
              </span>
              <span>{a.pattern.replaceAll("_", " ")}</span>
              <span>
                <b>{gbp.format(a.exposure)}</b>
                <small>{gbp.format(a.amount)} payment</small>
              </span>
              <span>
                <strong>{Math.round(a.ensembleScore * 100)}</strong>
                <i>
                  <b style={{ width: `${a.ensembleScore * 100}%` }} />
                </i>
              </span>
              <span>
                <Badge
                  tone={
                    a.status === "New" ? "blue" : a.status === "Awaiting review" ? "amber" : "green"
                  }
                >
                  {a.status}
                </Badge>
              </span>
              <span>{a.ageMinutes}m</span>
              <ArrowRight size={13} />
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}
