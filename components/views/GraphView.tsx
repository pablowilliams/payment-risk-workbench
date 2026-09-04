"use client";
import { useMemo, useState } from "react";
import { Focus, Maximize2, Network, Search, Share2, ZoomIn, ZoomOut } from "lucide-react";
import { graphEdges, graphNodes } from "@/lib/data";
import { Badge, Header, Panel, Section } from "../primitives";
export function GraphView() {
  const entityTypes = ["customer", "account", "device", "beneficiary", "merchant", "ip"] as const;
  const [selected, setSelected] = useState(graphNodes[0]);
  const [query, setQuery] = useState("");
  const [enabledTypes, setEnabledTypes] = useState<Set<string>>(new Set(entityTypes));
  const [depth, setDepth] = useState(2);
  const [zoom, setZoom] = useState(1);
  const [focusMode, setFocusMode] = useState(false);
  const visibleNodes = useMemo(() => {
    const distances = new Map([[selected.id, 0]]);
    const queue = [selected.id];
    while (queue.length) {
      const current = queue.shift()!;
      const distance = distances.get(current)!;
      if (distance >= depth) continue;
      for (const edge of graphEdges) {
        const neighbor =
          edge.source === current ? edge.target : edge.target === current ? edge.source : null;
        if (neighbor && !distances.has(neighbor)) {
          distances.set(neighbor, distance + 1);
          queue.push(neighbor);
        }
      }
    }
    const needle = query.trim().toLowerCase();
    return graphNodes.filter(
      (node) =>
        distances.has(node.id) &&
        enabledTypes.has(node.type) &&
        (!needle || `${node.label} ${node.id} ${node.type}`.toLowerCase().includes(needle)),
    );
  }, [depth, enabledTypes, query, selected.id]);
  const visibleIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = graphEdges.filter(
    (edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target),
  );
  function toggleType(type: string) {
    setEnabledTypes((current) => {
      const next = new Set(current);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }
  function resetGraph() {
    setSelected(graphNodes[0]);
    setEnabledTypes(new Set(entityTypes));
    setQuery("");
    setDepth(2);
    setZoom(1);
  }
  return (
    <div className="stack">
      <Header
        eyebrow="Relationship analysis / Connected entities"
        title="Account and device relationships"
        description="Inspect bounded connections between synthetic customers, accounts, devices, IP addresses, beneficiaries and merchants. A connection is evidence for review, not proof of intent."
        actions={
          <>
            <Badge tone="green">
              <Network size={11} />
              {visibleNodes.length} nodes · {visibleEdges.length} relationships
            </Badge>
            <button
              className="secondary"
              onClick={() => setFocusMode((current) => !current)}
              aria-pressed={focusMode}
            >
              <Maximize2 size={13} />
              {focusMode ? "Show controls" : "Focus graph"}
            </button>
          </>
        }
      />
      <div className={`graph-layout ${focusMode ? "focused" : ""}`}>
        <Panel className="graph-tools">
          <Section eyebrow="Graph controls" title="Investigation scope" />
          <label>
            <Search size={13} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find node or account"
              aria-label="Find a graph entity"
            />
          </label>
          <div className="graph-filters">
            {entityTypes.map((type, i) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={enabledTypes.has(type) ? "active" : ""}
                aria-pressed={enabledTypes.has(type)}
              >
                <i className={`c${i}`} />
                {type === "ip" ? "IP" : `${type[0].toUpperCase()}${type.slice(1)}`}
                <span>{graphNodes.filter((node) => node.type === type).length}</span>
              </button>
            ))}
          </div>
          <div className="depth">
            <span>
              Traversal depth
              <b>
                {depth} {depth === 1 ? "hop" : "hops"}
              </b>
            </span>
            <input
              type="range"
              min="1"
              max="4"
              value={depth}
              onChange={(event) => setDepth(Number(event.target.value))}
              aria-label="Graph traversal depth"
            />
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
              <button
                onClick={() => setZoom((value) => Math.max(0.75, value - 0.1))}
                aria-label="Zoom out"
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={() => setZoom((value) => Math.min(1.35, value + 0.1))}
                aria-label="Zoom in"
              >
                <ZoomIn size={14} />
              </button>
              <button onClick={resetGraph} aria-label="Reset graph">
                <Focus size={14} />
              </button>
            </div>
          </div>
          <div className="graph-stage">
            {visibleNodes.length === 0 && (
              <p className="graph-empty">No entities match the current scope.</p>
            )}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              {visibleEdges.map((e, i) => {
                const a = graphNodes.find((n) => n.id === e.source)!,
                  b = graphNodes.find((n) => n.id === e.target)!;
                const ax = 50 + (a.x - 50) * zoom,
                  ay = 50 + (a.y - 50) * zoom,
                  bx = 50 + (b.x - 50) * zoom,
                  by = 50 + (b.y - 50) * zoom;
                return (
                  <g key={i}>
                    <line x1={ax} y1={ay} x2={bx} y2={by} />
                    <text x={(ax + bx) / 2} y={(ay + by) / 2 - 1}>
                      {e.label}
                    </text>
                  </g>
                );
              })}
            </svg>
            {visibleNodes.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelected(n)}
                className={`graph-node ${n.type} ${selected.id === n.id ? "active" : ""}`}
                style={{
                  left: `${50 + (n.x - 50) * zoom}%`,
                  top: `${50 + (n.y - 50) * zoom}%`,
                }}
                aria-pressed={selected.id === n.id}
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
