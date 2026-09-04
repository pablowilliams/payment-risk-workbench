"use client";
import { useState } from "react";
import { Focus, Maximize2, Network, Search, Share2, ZoomIn, ZoomOut } from "lucide-react";
import { graphEdges, graphNodes } from "@/lib/data";
import { Badge, Header, Panel, Section } from "../primitives";
export function GraphView() {
  const [selected, setSelected] = useState(graphNodes[0]);
  return (
    <div className="stack">
      <Header
        eyebrow="Graph intelligence / Connected entities"
        title="See the network. Keep the inference honest."
        description="Explore relationships between synthetic customers, accounts, devices, IP addresses, beneficiaries and merchants. Connections are evidence, not guilt."
        actions={
          <>
            <Badge tone="green">
              <Network size={11} />8 nodes · 8 relationships
            </Badge>
            <button className="secondary">
              <Maximize2 size={13} />
              Focus mode
            </button>
          </>
        }
      />
      <div className="graph-layout">
        <Panel className="graph-tools">
          <Section eyebrow="Graph controls" title="Investigation scope" />
          <label>
            <Search size={13} />
            <input placeholder="Find node or account" />
          </label>
          <div className="graph-filters">
            {["Customer", "Account", "Device", "Beneficiary", "Merchant", "IP"].map((x, i) => (
              <button key={x}>
                <i className={`c${i}`} />
                {x}
                <span>{graphNodes.filter((n) => n.type === x.toLowerCase()).length}</span>
              </button>
            ))}
          </div>
          <div className="depth">
            <span>
              Traversal depth<b>2 hops</b>
            </span>
            <input type="range" min="1" max="4" defaultValue="2" />
          </div>
          <p>Expansion is capped to prevent misleading hairball graphs and unbounded queries.</p>
        </Panel>
        <Panel className="graph-canvas">
          <div className="graph-canvas__bar">
            <span>
              <i />
              Investigation subgraph
            </span>
            <div>
              <button>
                <ZoomOut size={14} />
              </button>
              <button>
                <ZoomIn size={14} />
              </button>
              <button>
                <Focus size={14} />
              </button>
            </div>
          </div>
          <div className="graph-stage">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              {graphEdges.map((e, i) => {
                const a = graphNodes.find((n) => n.id === e.source)!,
                  b = graphNodes.find((n) => n.id === e.target)!;
                return (
                  <g key={i}>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                    <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 1}>
                      {e.label}
                    </text>
                  </g>
                );
              })}
            </svg>
            {graphNodes.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelected(n)}
                className={`graph-node ${n.type} ${selected.id === n.id ? "active" : ""}`}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <Share2 size={13} />
                <span>{n.label}</span>
                <i style={{ "--risk": `${n.risk * 360}deg` } as React.CSSProperties}>
                  {Math.round(n.risk * 100)}
                </i>
              </button>
            ))}
          </div>
          <div className="graph-caption">
            <span>
              <i className="customer" />
              Customer
            </span>
            <span>
              <i className="account" />
              Account
            </span>
            <span>
              <i className="device" />
              Device/IP
            </span>
            <span>
              <i className="beneficiary" />
              Beneficiary/merchant
            </span>
          </div>
        </Panel>
        <Panel className="node-panel">
          <Section eyebrow="Selected entity" title={selected.label} />
          <div className={`entity-icon ${selected.type}`}>
            <Share2 size={21} />
          </div>
          <dl>
            <div>
              <dt>Entity type</dt>
              <dd>{selected.type}</dd>
            </div>
            <div>
              <dt>Network risk</dt>
              <dd>{Math.round(selected.risk * 100)}%</dd>
            </div>
            <div>
              <dt>First observed</dt>
              <dd>04 Sep 2026</dd>
            </div>
            <div>
              <dt>Connected edges</dt>
              <dd>
                {
                  graphEdges.filter((e) => e.source === selected.id || e.target === selected.id)
                    .length
                }
              </dd>
            </div>
          </dl>
          <div className="entity-warning">
            <b>Interpretation boundary</b>
            <p>A high network score prioritises review. It does not establish fraudulent intent.</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
