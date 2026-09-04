"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Landmark,
  ShieldCheck,
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
export function PaymentRiskWorkbench() {
  const [view, setView] = useState<View>("command"),
    [mobile, setMobile] = useState(false),
    [palette, setPalette] = useState(false),
    [query, setQuery] = useState("");
  const lastFocus = useRef<HTMLElement | null>(null);
  const go = useCallback((x: string) => {
    if (!nav.some((n) => n.id === x)) return;
    setView(x as View);
    setMobile(false);
    if (location.hash !== `#${x}`) history.pushState(null, "", `#${x}`);
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    requestAnimationFrame(() => document.getElementById("content")?.focus());
  }, []);
  const openPalette = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setPalette(true);
  }, []);
  const closePalette = useCallback(() => {
    setPalette(false);
    setQuery("");
    requestAnimationFrame(() => lastFocus.current?.focus());
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const h = location.hash.slice(1);
      if (nav.some((n) => n.id === h)) setView(h as View);
    });
    const key = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.matches("input, textarea, select, [contenteditable='true']");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (palette) closePalette();
        else openPalette();
      }
      if (!typing && !e.metaKey && !e.ctrlKey && /^[1-7]$/.test(e.key)) {
        go(nav[Number(e.key) - 1].id);
      }
      if (e.key === "Escape") {
        closePalette();
        setMobile(false);
      }
    };
    const route = () => {
      const hash = location.hash.slice(1);
      if (nav.some((item) => item.id === hash)) setView(hash as View);
    };
    addEventListener("keydown", key);
    addEventListener("popstate", route);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("keydown", key);
      removeEventListener("popstate", route);
    };
  }, [closePalette, go, openPalette, palette]);
  const active = nav.find((n) => n.id === view)!;
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle
      ? nav.filter((item) => `${item.label} ${item.sub}`.toLowerCase().includes(needle))
      : nav;
  }, [query]);
  return (
    <main className="app">
      <a href="#content" className="skip">
        Skip to investigation content
      </a>
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <header>
          <div className="logo">
            <Landmark size={16} />
          </div>
          <div>
            <b>Payment Risk Workbench</b>
            <small>Investigation operations</small>
          </div>
          <button onClick={() => setMobile(false)} aria-label="Close navigation">
            <X size={17} />
          </button>
        </header>
        <div className="bank">
          <span>
            <i />
            Evaluation dataset
          </span>
          <b>Verdant Bank</b>
          <small>UK retail payments · Synthetic records</small>
        </div>
        <nav aria-label="Workbench views">
          {nav.map((n, i) => {
            const I = n.icon;
            return (
              <button
                key={n.id}
                className={view === n.id ? "active" : ""}
                onClick={() => go(n.id)}
                aria-current={view === n.id ? "page" : undefined}
              >
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
            <small>Demo operator</small>
          </span>
        </footer>
      </aside>
      <section className="main" id="content" tabIndex={-1}>
        <header className="topbar">
          <div>
            <button className="menub" onClick={() => setMobile(true)} aria-label="Open navigation">
              <Menu size={18} />
            </button>
            <span>Financial crime</span>
            <ChevronRight size={12} />
            <b>{active.label}</b>
          </div>
          <aside>
            <button className="search" onClick={openPalette} aria-haspopup="dialog">
              <Search size={14} />
              <span>Jump to view</span>
              <kbd>⌘ K</kbd>
            </button>
            <span className="live">
              <i />
              Demo feed
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
      {mobile && (
        <button className="scrim" onClick={() => setMobile(false)} aria-label="Close navigation" />
      )}{" "}
      {palette && (
        <div
          className="palette"
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-switcher-title"
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const controls = Array.from(
              event.currentTarget.querySelectorAll<HTMLElement>("input, button:not(:disabled)"),
            );
            const first = controls[0];
            const last = controls.at(-1);
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }}
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) closePalette();
          }}
        >
          <div>
            <header>
              <Search size={18} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search views…"
                aria-label="Search workbench views"
              />
              <kbd>ESC</kbd>
            </header>
            <span id="view-switcher-title">Workbench views</span>
            {matches.map((n) => {
              const I = n.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    lastFocus.current = null;
                    go(n.id);
                    setPalette(false);
                    setQuery("");
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
            {matches.length === 0 && <p className="palette-empty">No matching view</p>}
            <footer>
              <Command size={12} /> + K to open
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
