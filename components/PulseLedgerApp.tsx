"use client";
import { useCallback, useEffect, useState } from "react";
import {
  AlarmClock,
  BarChart3,
  ChevronRight,
  Command,
  DatabaseZap,
  FileCheck2,
  LayoutDashboard,
  Menu,
  Network,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { CommandView } from "./views/CommandView";
import { AlertsView } from "./views/AlertsView";
import { InvestigationView } from "./views/InvestigationView";
import { GraphView } from "./views/GraphView";
import { ModelsView } from "./views/ModelsView";
import { PlatformView } from "./views/PlatformView";
import { GovernanceView } from "./views/GovernanceView";
const nav = [
  { id: "command", label: "Command centre", sub: "Live operating picture", icon: LayoutDashboard },
  { id: "alerts", label: "Alert queue", sub: "Prioritised exposure", icon: AlarmClock },
  { id: "investigation", label: "Investigation", sub: "Evidence and decision", icon: FileCheck2 },
  { id: "network", label: "Network graph", sub: "Connected risk", icon: Network },
  { id: "models", label: "Model operations", sub: "Performance and drift", icon: BarChart3 },
  { id: "platform", label: "Data platform", sub: "Streaming and quality", icon: DatabaseZap },
  { id: "governance", label: "Governance", sub: "Controls and lineage", icon: ShieldCheck },
] as const;
type View = (typeof nav)[number]["id"];
export function PulseLedgerApp() {
  const [view, setView] = useState<View>("command"),
    [mobile, setMobile] = useState(false),
    [palette, setPalette] = useState(false);
  const go = useCallback((x: string) => {
    if (!nav.some((n) => n.id === x)) return;
    setView(x as View);
    setMobile(false);
    history.replaceState(null, "", `#${x}`);
    scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const h = location.hash.slice(1);
      if (nav.some((n) => n.id === h)) setView(h as View);
    });
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
      if (e.key === "Escape") {
        setPalette(false);
        setMobile(false);
      }
    };
    addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("keydown", key);
    };
  }, []);
  const active = nav.find((n) => n.id === view)!;
  return (
    <main className="app">
      <a href="#content" className="skip">
        Skip to investigation content
      </a>
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <header>
          <div className="logo">
            <Sparkles size={16} />
          </div>
          <div>
            <b>PulseLedger</b>
            <small>Financial crime intelligence</small>
          </div>
          <button onClick={() => setMobile(false)}>
            <X size={17} />
          </button>
        </header>
        <div className="bank">
          <span>
            <i />
            Synthetic environment
          </span>
          <b>Verdant Bank</b>
          <small>UK retail payments · Evaluation tenant</small>
        </div>
        <nav>
          {nav.map((n, i) => {
            const I = n.icon;
            return (
              <button key={n.id} className={view === n.id ? "active" : ""} onClick={() => go(n.id)}>
                <I size={17} />
                <span>
                  <b>{n.label}</b>
                  <small>{n.sub}</small>
                </span>
                <kbd>{i + 1}</kbd>
              </button>
            );
          })}
        </nav>
        <footer>
          <div className="analyst">PW</div>
          <span>
            <b>Pablo Williams</b>
            <small>Platform owner</small>
          </span>
          <Settings2 size={15} />
        </footer>
      </aside>
      <section className="main" id="content" tabIndex={-1}>
        <header className="topbar">
          <div>
            <button className="menub" onClick={() => setMobile(true)}>
              <Menu size={18} />
            </button>
            <span>Financial crime</span>
            <ChevronRight size={12} />
            <b>{active.label}</b>
          </div>
          <aside>
            <button className="search" onClick={() => setPalette(true)}>
              <Search size={14} />
              <span>Search platform</span>
              <kbd>⌘ K</kbd>
            </button>
            <span className="live">
              <i />
              Live simulation
            </span>
            <div className="avatar">PW</div>
          </aside>
        </header>
        <div className="content">
          {view === "command" && <CommandView go={go} />}{" "}
          {view === "alerts" && <AlertsView go={go} />}{" "}
          {view === "investigation" && <InvestigationView />} {view === "network" && <GraphView />}{" "}
          {view === "models" && <ModelsView />} {view === "platform" && <PlatformView />}{" "}
          {view === "governance" && <GovernanceView />}
        </div>
      </section>
      {mobile && <button className="scrim" onClick={() => setMobile(false)} />}{" "}
      {palette && (
        <div
          className="palette"
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) setPalette(false);
          }}
        >
          <div>
            <header>
              <Search size={18} />
              <input autoFocus placeholder="Go to a workspace…" />
              <kbd>ESC</kbd>
            </header>
            <span>Workspaces</span>
            {nav.map((n) => {
              const I = n.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    go(n.id);
                    setPalette(false);
                  }}
                >
                  <I size={17} />
                  <span>
                    <b>{n.label}</b>
                    <small>{n.sub}</small>
                  </span>
                  <ChevronRight size={13} />
                </button>
              );
            })}
            <footer>
              <Command size={12} /> + K to open
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
