#!/usr/bin/env python3
"""Generate the exactly 75-page PulseLedger long-term delivery blueprint."""

from pathlib import Path
import textwrap
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT.parent / "output" / "pdf" / "pulseledger-long-term-delivery-blueprint.pdf"
W, H = A4
INK = HexColor("#17201c")
NAVY = HexColor("#10251f")
GREEN = HexColor("#1b7658")
MINT = HexColor("#dff1e8")
ACID = HexColor("#d8f36d")
PAPER = HexColor("#f2f1ec")
WHITE = HexColor("#fffefa")
MUTED = HexColor("#69736e")
LINE = HexColor("#d7dbd7")
RED = HexColor("#b64b42")
AMBER = HexColor("#dc9b32")
AMBER_BG = HexColor("#faeed8")
for name, path in [
    ("Sans", "/System/Library/Fonts/Supplemental/Arial.ttf"),
    ("SansB", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"),
    ("Serif", "/System/Library/Fonts/Supplemental/Georgia.ttf"),
    ("SerifB", "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"),
    ("Mono", "/System/Library/Fonts/Supplemental/Courier New.ttf"),
]:
    if Path(path).exists():
        pdfmetrics.registerFont(TTFont(name, path))

PHASES = [
    (
        "01",
        "Human investigation product",
        "Design around investigator judgment, customer consequence and supervisory accountability.",
        [
            (
                "Operating problem and mandate",
                "Define the financial-crime decision, affected people, sponsor, alert budget and evidence needed to fund a pilot.",
                "Signed mandate and decision log",
            ),
            (
                "Investigator field research",
                "Observe triage, evidence gathering, queue pressure, handoffs, overrides and supervisory review.",
                "Research synthesis and opportunity map",
            ),
            (
                "Customer consequence mapping",
                "Trace false positives, delayed payments, account restrictions and vulnerable-customer impacts.",
                "Harm-aware service blueprint",
            ),
            (
                "Jobs and decision moments",
                "Model investigator, supervisor, fraud strategy, operations, compliance and customer-support needs.",
                "Prioritised jobs-to-be-done",
            ),
            (
                "Alert triage experience",
                "Design a queue that surfaces exposure, confidence, reason, age, SLA and network context without dark patterns.",
                "Accessible queue specification",
            ),
            (
                "Investigation workspace",
                "Unify transaction timeline, customer profile, device evidence, graph links, policies, notes and decisions.",
                "Screen and interaction contract",
            ),
            (
                "Human approval and contestability",
                "Require meaningful review for payment holds and restrictions; preserve correction and appeal routes.",
                "Approval and customer-redress flows",
            ),
            (
                "Adoption and capability",
                "Train calibrated trust, evidence reading, override reasons, model limitations and incident escalation.",
                "Role-based learning programme",
            ),
        ],
    ),
    (
        "02",
        "Streaming data foundation",
        "Create a replayable, quality-controlled event backbone with clear ownership and lineage.",
        [
            (
                "Canonical payment event",
                "Version identifiers, parties, device, location, amount, merchant, authentication and event-time fields.",
                "Schema registry contract",
            ),
            (
                "Synthetic event generator",
                "Produce one million reproducible events across ordinary behaviour, account takeover, mule activity and card testing.",
                "Fixed-seed streaming generator",
            ),
            (
                "Kafka and topic design",
                "Separate raw, validated, enriched, scored, alert and decision topics with retention and ownership.",
                "Topic and partition strategy",
            ),
            (
                "Event-time correctness",
                "Specify watermarks, lateness, ordering, duplicate handling and deterministic replay.",
                "Event-time test suite",
            ),
            (
                "Real-time feature computation",
                "Calculate velocity, novelty, distance, recipient risk, device sharing and failed-payment windows.",
                "Online feature contracts",
            ),
            (
                "Offline lakehouse design",
                "Land immutable history, curated outcomes and training snapshots with reproducible time travel.",
                "Bronze-silver-gold data products",
            ),
            (
                "Data quality and observability",
                "Monitor freshness, completeness, uniqueness, validity, distribution and cross-topic reconciliation.",
                "Data SLOs and incident rules",
            ),
            (
                "Privacy and retention",
                "Minimise sensitive fields, tokenise identifiers, define purpose, deletion and investigation holds.",
                "DPIA and retention schedule",
            ),
        ],
    ),
    (
        "03",
        "Detection and graph intelligence",
        "Combine interpretable rules, tabular models and network signals under a fixed alert budget.",
        [
            (
                "Detection strategy",
                "Define threats, decision latency, cost asymmetry, alert capacity and model-versus-rule ownership.",
                "Detection coverage matrix",
            ),
            (
                "Rules baseline",
                "Implement transparent velocity, value, geo, device and recipient rules as the minimum benchmark.",
                "Versioned rules service",
            ),
            (
                "Tabular risk model",
                "Train an interpretable baseline using leakage-safe historical features and calibrated probabilities.",
                "Model artifact and card",
            ),
            (
                "Graph domain model",
                "Represent customers, accounts, devices, IPs, merchants, beneficiaries and transactions.",
                "Neo4j schema and constraints",
            ),
            (
                "Graph risk features",
                "Calculate shared-device risk, risky-neighbour ratio, cycles, fan-in, fan-out and shortest paths.",
                "Online graph feature contract",
            ),
            (
                "Ensemble and thresholds",
                "Blend rule, tabular and graph evidence and choose thresholds by alert capacity and exposure.",
                "Champion scoring policy",
            ),
            (
                "Explainability and evidence",
                "Translate contributions into decision evidence without presenting correlation as certainty.",
                "Reason-code and explanation standard",
            ),
            (
                "Backtest and ablation",
                "Compare rules, tabular and graph-augmented systems on the same one-million-event holdout.",
                "Reproducible evaluation report",
            ),
        ],
    ),
    (
        "04",
        "Investigation agent and workflow",
        "Use AI to assemble evidence and draft decisions while keeping consequential authority human.",
        [
            (
                "Agent purpose and boundaries",
                "Permit search, summarisation, timeline assembly and drafting; prohibit autonomous account restriction.",
                "System card and authority matrix",
            ),
            (
                "Investigation state machine",
                "Model open, enrich, retrieve, analyse, propose, approve, execute, notify and close states.",
                "Workflow transition specification",
            ),
            (
                "Policy retrieval",
                "Index dated fraud, customer-support and vulnerable-customer procedures with owner and jurisdiction metadata.",
                "Grounded retrieval service",
            ),
            (
                "Tool gateway and MCP",
                "Expose narrow read, propose and execute tools with strict schemas, scoped identity and audit context.",
                "MCP-compatible tool contracts",
            ),
            (
                "Payload-bound approval",
                "Bind restriction approval to customer, action, scope, reason, expiry, approver and immutable hash.",
                "Approval and replay controls",
            ),
            (
                "Prompt-injection defence",
                "Treat events and documents as untrusted data; apply content boundaries and default-deny tools.",
                "Adversarial evaluation suite",
            ),
            (
                "Investigation memory",
                "Keep case memory scoped, redacted, source-linked and deleted according to retention policy.",
                "Memory lifecycle design",
            ),
            (
                "Quality and human oversight",
                "Measure grounding, completeness, harmful omission, override, time saved and reviewer calibration.",
                "Agent evaluation scorecard",
            ),
        ],
    ),
    (
        "05",
        "MLOps and platform engineering",
        "Operate data, models and decisions as versioned services with measurable reliability and cost.",
        [
            (
                "Model registry and lineage",
                "Link code, data snapshot, features, model, threshold, evaluation, approval and deployment.",
                "Release evidence bundle",
            ),
            (
                "Champion-challenger delivery",
                "Score challengers silently, compare outcomes and promote only through evidence gates.",
                "Shadow deployment pipeline",
            ),
            (
                "Feature parity",
                "Prevent training-serving skew through shared definitions, point-in-time joins and parity tests.",
                "Feature parity gate",
            ),
            (
                "Drift and performance monitoring",
                "Detect input, feature, score, outcome and calibration drift by relevant cohorts.",
                "Monitoring and response playbook",
            ),
            (
                "Service-level objectives",
                "Set throughput, availability, end-to-end latency, event lag, recovery and decision trace targets.",
                "SLO and error-budget policy",
            ),
            (
                "Cloud and Kubernetes architecture",
                "Map local services to AWS streaming, compute, graph, storage, model and observability capabilities.",
                "Target deployment architecture",
            ),
            (
                "Infrastructure and release automation",
                "Use Terraform, containers, signed builds, policy checks, environment promotion and rollback.",
                "CI/CD and IaC repository",
            ),
            (
                "FinOps and capacity engineering",
                "Measure cost per million events, per alert and per prevented loss with load forecasts and budgets.",
                "Capacity and unit-cost model",
            ),
        ],
    ),
    (
        "06",
        "Security, regulation and resilience",
        "Make customer protection, auditability and failure response enforceable rather than decorative.",
        [
            (
                "Threat and abuse model",
                "Cover event poisoning, identity abuse, model evasion, graph poisoning, prompt injection and insider misuse.",
                "Threat model and mitigations",
            ),
            (
                "Identity and least privilege",
                "Propagate user, service, tenant, case and purpose attributes across every read and action.",
                "Authorisation policy tests",
            ),
            (
                "Encryption and secrets",
                "Protect events, features, graphs, cases, models, logs and backups with rotation and separation of duties.",
                "Key and secret lifecycle",
            ),
            (
                "Audit and decision lineage",
                "Reconstruct who knew what, which model ran, what evidence existed and why an action occurred.",
                "Immutable audit contract",
            ),
            (
                "Fairness and customer outcomes",
                "Measure friction, false positives, delay and restriction outcomes across defensible cohorts.",
                "Outcome monitoring standard",
            ),
            (
                "Resilience and degradation",
                "Design replay, deduplication, circuit breaking, queue back-pressure, manual fallback and safe model bypass.",
                "Failure-mode catalogue",
            ),
            (
                "Incident response and kill switch",
                "Define severity, authority, containment, customer correction, regulatory notification and recovery.",
                "Exercised incident runbooks",
            ),
            (
                "Assurance and governance",
                "Use design authority, model risk, data governance, security and business owners with recorded decisions.",
                "Governance calendar and RACI",
            ),
        ],
    ),
    (
        "07",
        "Long-term delivery and portfolio proof",
        "Sequence a credible year of delivery and turn each milestone into interview-verifiable evidence.",
        [
            (
                "Twelve-month roadmap",
                "Stage foundation, proof, shadow, controlled pilot, scale and optimisation around evidence gates.",
                "Integrated programme plan",
            ),
            (
                "Team topology and ownership",
                "Define product, investigation, streaming, ML, graph, platform, security and design responsibilities.",
                "Team charter and dependency map",
            ),
            (
                "Backlog and architecture runway",
                "Prioritise vertical outcomes while funding schema, observability, security and replay capabilities early.",
                "Outcome-led backlog",
            ),
            (
                "Testing and quality strategy",
                "Cover domain, schema, stream, feature, model, graph, agent, security, performance and recovery layers.",
                "Risk-based test strategy",
            ),
            (
                "Pilot and benefits realisation",
                "Pre-register metrics, run matched queues, monitor customer outcomes and validate cashable value.",
                "Pilot protocol and benefits ledger",
            ),
            (
                "Open-source portfolio packaging",
                "Publish safe synthetic assets, reproducible commands, diagrams, ADRs, runbooks and claim boundaries.",
                "Interview-ready repository",
            ),
            (
                "Demonstration and defence",
                "Tell a 25-minute decision story and prepare challenges on data, models, graphs, controls and economics.",
                "Demo script and question bank",
            ),
            (
                "CV evidence ledger",
                "Attach every scale, quality, performance and value number to a command, artifact and truthful boundary.",
                "Auditable CV claim register",
            ),
        ],
    ),
]


def clean(s):
    return (
        s.replace("–", "-")
        .replace("—", "-")
        .replace("−", "-")
        .replace("’", "'")
        .replace("“", '"')
        .replace("”", '"')
        .replace("≥", ">=")
        .replace("≤", "<=")
    )


def wrap(s, n):
    return textwrap.wrap(
        clean(s), width=n, break_long_words=False, break_on_hyphens=False
    ) or [""]


class Book:
    def __init__(self):
        OUT.parent.mkdir(parents=True, exist_ok=True)
        self.c = Canvas(str(OUT), pagesize=A4)
        self.p = 0
        self.c.setTitle("PulseLedger - 75-Page Long-Term Delivery Blueprint")
        self.c.setAuthor("Pablo Williams")
        self.c.setSubject(
            "Human-centred real-time financial crime platform delivery plan"
        )

    def page(self, section="PULSELEDGER LONG-TERM DELIVERY BLUEPRINT"):
        if self.p:
            self.c.showPage()
        self.p += 1
        c = self.c
        c.setFillColor(PAPER)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        if self.p > 1:
            c.setStrokeColor(LINE)
            c.line(42, H - 39, W - 42, H - 39)
            c.line(42, 31, W - 42, 31)
            c.setFillColor(MUTED)
            c.setFont("Mono", 6.6)
            c.drawString(42, H - 29, section)
            c.drawRightString(W - 42, H - 29, f"PAGE {self.p:02d} / 75")
            c.drawString(42, 19, "SYNTHETIC PORTFOLIO PROGRAMME - 04 SEPTEMBER 2026")
            c.drawRightString(W - 42, 19, "PABLO WILLIAMS")

    def head(self, kicker, title, sub):
        c = self.c
        y = H - 72
        c.setFillColor(GREEN)
        c.setFont("Mono", 7)
        c.drawString(42, y, clean(kicker.upper()))
        y -= 22
        c.setFillColor(INK)
        c.setFont("SerifB", 25)
        for line in wrap(title, 40):
            c.drawString(42, y, line)
            y -= 29
        y -= 2
        c.setFont("Sans", 9)
        c.setFillColor(MUTED)
        for line in wrap(sub, 92):
            c.drawString(42, y, line)
            y -= 13
        c.setStrokeColor(INK)
        c.line(42, y - 7, W - 42, y - 7)
        return y - 25

    def label(self, t, x, y, col=GREEN):
        self.c.setFillColor(col)
        self.c.setFont("Mono", 6.5)
        self.c.drawString(x, y, clean(t.upper()))

    def para(self, t, x, y, n=88, size=8.3, lead=11.5, col=INK):
        self.c.setFillColor(col)
        self.c.setFont("Sans", size)
        for line in wrap(t, n):
            self.c.drawString(x, y, line)
            y -= lead
        return y

    def bullets(self, items, x, y, n=80, size=7.7, lead=10.2, gap=4):
        for item in items:
            self.c.setFillColor(GREEN)
            self.c.circle(x + 3, y + 2, 1.7, fill=1, stroke=0)
            self.c.setFillColor(INK)
            self.c.setFont("Sans", size)
            for line in wrap(item, n):
                self.c.drawString(x + 12, y, line)
                y -= lead
            y -= gap
        return y

    def card(self, x, y, w, h, fill=WHITE, stroke=LINE):
        self.c.setFillColor(fill)
        self.c.setStrokeColor(stroke)
        self.c.roundRect(x, y, w, h, 4, fill=1, stroke=1)

    def save(self):
        self.c.save()


def cover(b):
    b.page()
    c = b.c
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(ACID)
    c.roundRect(48, H - 104, 42, 42, 11, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont("SerifB", 22)
    c.drawCentredString(69, H - 91, "P")
    c.setFillColor(ACID)
    c.setFont("Mono", 8)
    c.drawString(48, H - 140, "PULSELEDGER / PROGRAMME BLUEPRINT")
    c.setFillColor(white)
    c.setFont("SerifB", 42)
    y = H - 205
    for line in ["Real-Time Financial", "Crime Intelligence"]:
        c.drawString(48, y, line)
        y -= 49
    c.setFillColor(HexColor("#c1d1c8"))
    c.setFont("Sans", 13)
    for line in [
        "A human-centred, graph-aware data and AI platform",
        "planned as a twelve-month portfolio programme.",
    ]:
        c.drawString(50, y, line)
        y -= 19
    c.setStrokeColor(HexColor("#49675a"))
    c.line(48, 194, W - 48, 194)
    items = [
        ("75", "pages"),
        ("1M", "event target"),
        ("7", "workstreams"),
        ("12", "months"),
    ]
    x = 48
    for value, label in items:
        c.setFillColor(white)
        c.setFont("SerifB", 20)
        c.drawString(x, 157, value)
        c.setFillColor(HexColor("#9eb1a6"))
        c.setFont("Sans", 7)
        c.drawString(x, 142, label.upper())
        x += 126
    c.setFillColor(white)
    c.setFont("SansB", 9)
    c.drawString(48, 69, "Long-term implementation and interview plan")
    c.setFillColor(HexColor("#9eb1a6"))
    c.setFont("Sans", 8)
    c.drawString(48, 53, "Pablo Williams | Version 1.0 | 04 September 2026")


def front(b, k, t, s, blocks):
    b.page("PROGRAMME FRAMING")
    y = b.head(k, t, s)
    for h, body in blocks:
        b.label(h, 42, y)
        y -= 14
        y = b.para(body, 42, y, 94, 9, 13)
        y -= 18


def contents(b):
    b.page("CONTENTS")
    y = b.head(
        "Contents",
        "Seventy-five pages, seven connected workstreams",
        "The plan moves from human decisions to data, intelligence, controlled agency, operations, assurance and portfolio proof.",
    )
    for n, title, purpose, _ in PHASES:
        b.card(42, y - 68, W - 84, 57)
        b.c.setFillColor(ACID)
        b.c.circle(65, y - 39, 15, fill=1, stroke=0)
        b.c.setFillColor(NAVY)
        b.c.setFont("SerifB", 12)
        b.c.drawCentredString(65, y - 43, n)
        b.c.setFillColor(INK)
        b.c.setFont("SansB", 10)
        b.c.drawString(95, y - 32, title)
        b.para(purpose, 95, y - 47, 73, 6.8, 9, MUTED)
        y -= 75


def phase_intro(b, n, title, purpose, mods):
    b.page(f"WORKSTREAM {n}")
    y = b.head(f"Workstream {n}", title, purpose)
    b.card(42, y - 94, W - 84, 80, NAVY, NAVY)
    b.c.setFillColor(ACID)
    b.c.setFont("SerifB", 30)
    b.c.drawString(59, y - 57, n)
    b.label("Exit condition", 121, y - 37, ACID)
    b.para(
        "Named owners can make the next delivery decision using accepted evidence, explicit residual risk and a rehearsed fallback.",
        121,
        y - 55,
        65,
        8,
        11,
        white,
    )
    y -= 122
    for i, (name, obj, out) in enumerate(mods):
        col = i % 2
        row = i // 2
        x = 42 + col * 257
        top = y - row * 105
        b.card(x, top - 89, 241, 79)
        b.label(f"{n}.{i+1}", x + 12, top - 27)
        b.c.setFillColor(INK)
        b.c.setFont("SansB", 8.5)
        b.c.drawString(x + 48, top - 27, clean(name))
        b.para(obj, x + 12, top - 44, 49, 6.7, 8.8, MUTED)
        b.c.setFillColor(GREEN)
        b.c.setFont("SansB", 6.2)
        b.c.drawString(x + 12, top - 79, clean(out.upper()))


def module(b, n, phase, i, name, obj, out):
    b.page(f"WORKSTREAM {n} / {phase.upper()}")
    y = b.head(f"Module {n}.{i}", name, obj)
    b.label("Detailed delivery sequence", 42, y)
    y -= 14
    steps = [
        f"Name the investigator or customer decision this module changes, its accountable owner and the consequence of delay or error.",
        f"Collect direct evidence from people, event data, existing controls, policies and system behaviour; keep hypotheses visibly separate.",
        f"Define the contract for {name.lower()}: inputs, outputs, state, ownership, quality rules, version and retention.",
        "Prototype the happy path, ambiguous path, harmful false positive, infrastructure failure and deliberate abuse path.",
        "Connect the output to streaming, graph, model, case, audit and benefits evidence through stable identifiers and trace context.",
        "Review with an investigator, control owner and engineer; capture disagreement and decide accept, revise, defer or stop.",
    ]
    for j, txt in enumerate(steps, 1):
        b.c.setFillColor(NAVY)
        b.c.circle(51, y + 2, 8, fill=1, stroke=0)
        b.c.setFillColor(ACID)
        b.c.setFont("Mono", 6)
        b.c.drawCentredString(51, y, str(j))
        y = b.para(txt, 67, y + 4, 82, 7.7, 10.4)
        y -= 4
    y -= 2
    b.card(42, y - 121, 247, 109)
    b.label("Acceptance evidence", 56, y - 31)
    b.bullets(
        [
            f"{out} is versioned and linked to its source evidence.",
            "Definitions, exclusions, failure behaviour and decision threshold are explicit.",
            "A named operational owner accepts maintenance and incident responsibility.",
            "Automated checks or a documented review verify the material requirement.",
        ],
        54,
        y - 50,
        43,
        6.8,
        8.9,
        2,
    )
    b.card(305, y - 121, 248, 109, NAVY, NAVY)
    b.label("Human-quality test", 319, y - 31, ACID)
    b.para(
        "Can a busy investigator understand the evidence, consequence and available correction without learning the internal implementation? Can a supervisor reconstruct and challenge the decision later?",
        319,
        y - 52,
        42,
        7.2,
        10,
        white,
    )
    y -= 145
    b.label("Delivery ownership", 42, y)
    y -= 15
    owners = [
        ("Product", "Outcome and adoption"),
        ("Engineering", "Service and failure"),
        ("Control", "Risk acceptance"),
        ("Evidence", "Metric and lineage"),
    ]
    x = 42
    for role, val in owners:
        b.card(x, y - 44, 121, 37)
        b.label(role, x + 8, y - 21)
        b.c.setFillColor(INK)
        b.c.setFont("SansB", 6.8)
        b.c.drawString(x + 8, y - 34, val)
        x += 130
    y -= 68
    b.card(42, y - 74, W - 84, 65, AMBER_BG, HexColor("#e6c88f"))
    b.label("Interview defence", 56, y - 29, AMBER)
    b.para(
        f"I designed {name.lower()} as part of the operating system, not an isolated feature. It has a human decision, typed contract, owner, measurable gate and safe failure path.",
        56,
        y - 46,
        88,
        7.8,
        10.5,
    )


def appendix(b, n, title, sub, left, right):
    b.page("APPENDICES")
    y = b.head(f"Appendix {n}", title, sub)
    b.card(42, 108, 248, y - 125)
    b.card(305, 108, 248, y - 125)
    b.label(left[0], 56, y - 18)
    b.bullets(left[1], 54, y - 40, 43, 7.4, 10, 4)
    b.label(right[0], 319, y - 18)
    b.bullets(right[1], 317, y - 40, 43, 7.4, 10, 4)


def build():
    b = Book()
    cover(b)
    front(
        b,
        "Executive decision",
        "Build a decision platform, not a fraud dashboard",
        "PulseLedger should prove that real-time data, machine learning, graph intelligence and controlled AI can improve investigator focus without hiding customer consequences.",
        [
            (
                "Programme thesis",
                "Process a reproducible million-event stream, rank alerts within a fixed investigation budget, expose network evidence and support a human investigator through a fully traceable decision.",
            ),
            (
                "Human principle",
                "The interface starts with consequence, evidence and correction. It avoids alarmist colour, false certainty, performative dashboards and autonomous account restriction.",
            ),
            (
                "Technical principle",
                "Every event, feature, score, graph signal, policy passage, proposal, approval and decision shares lineage. Replay and challenge are designed before optimisation.",
            ),
            (
                "Portfolio outcome",
                "An interviewer can run the platform locally, reproduce the backtest, inspect the graph and workflow, review contracts and infrastructure, and challenge every CV number.",
            ),
        ],
    )
    front(
        b,
        "Product north star",
        "Help investigators find the few cases that deserve attention",
        "The goal is not maximum alerts. It is the best customer-protecting allocation of constrained investigation capacity.",
        [
            (
                "Primary outcome",
                "Increase synthetic fraud-value capture at a fixed one-percent alert budget while reducing time spent assembling evidence.",
            ),
            (
                "Guardrails",
                "No autonomous account restriction; no hidden cohort trade-off; no untraceable feature or score; no model promotion without a fixed holdout and named risk acceptance.",
            ),
            (
                "Experience standard",
                "A reviewer sees reason codes, network context, source time, uncertainty and next action in one coherent workspace. Every material decision remains editable before approval and contestable after.",
            ),
            (
                "Success horizon",
                "A twelve-month programme ends with a controlled pilot decision, not a claim that synthetic performance guarantees banking outcomes.",
            ),
        ],
    )
    front(
        b,
        "Roadmap at a glance",
        "Twelve months of gated capability",
        "Each quarter ends in a decision based on working evidence rather than architecture completion alone.",
        [
            (
                "Quarter 1 - foundation",
                "Research investigators, define harm and metrics, build the event contract, generator, replay backbone, rules baseline and first human queue.",
            ),
            (
                "Quarter 2 - intelligence",
                "Add time-safe features, tabular model, Neo4j domain, graph features, calibrated ensemble, evaluation harness and evidence explanations.",
            ),
            (
                "Quarter 3 - controlled assistance",
                "Build the investigation agent, policy retrieval, MCP gateway, payload-bound approval, model registry, drift monitoring and failure exercises.",
            ),
            (
                "Quarter 4 - pilot readiness",
                "Run scale and adversarial tests, shadow champion/challenger models, rehearse incidents, validate benefits and package the production investment decision.",
            ),
        ],
    )
    contents(b)
    for n, title, purpose, mods in PHASES:
        phase_intro(b, n, title, purpose, mods)
        for i, (name, obj, out) in enumerate(mods, 1):
            module(b, n, title, i, name, obj, out)
    appendix(
        b,
        "A",
        "Reference technology map",
        "Local tools preserve reproducibility; target services show enterprise judgement.",
        (
            "Local proof",
            [
                "Next.js and TypeScript investigator experience",
                "Python streaming generator and evaluation harness",
                "Redpanda Kafka-compatible event backbone",
                "PostgreSQL cases and outcomes",
                "Neo4j account-device-payment graph",
                "OpenTelemetry-compatible trace contracts",
            ],
        ),
        (
            "AWS target",
            [
                "MSK or Kinesis for managed streaming",
                "Flink or Lambda for stateful enrichment",
                "S3 and Iceberg for historical data products",
                "SageMaker or container model serving",
                "Neptune or Neo4j Aura for graph intelligence",
                "EKS, ECS or Lambda chosen by workload evidence",
            ],
        ),
    )
    appendix(
        b,
        "B",
        "Metric and decision dictionary",
        "Metrics are tied to a fixed alert capacity and customer outcomes.",
        (
            "Detection",
            [
                "Precision and recall at one-percent alert budget",
                "Fraud value captured, not only fraud count",
                "False positives per 1,000 transactions",
                "Calibration error and threshold stability",
                "Graph uplift over tabular baseline",
                "Time-to-detection by fraud pattern",
            ],
        ),
        (
            "Platform and people",
            [
                "P95 scoring latency and event lag",
                "Sustained events per second and recovery time",
                "Investigator evidence-assembly minutes",
                "Override and escalation quality",
                "Customer restriction and delay outcomes",
                "Cost per million events and per useful alert",
            ],
        ),
    )
    appendix(
        b,
        "C",
        "Repository architecture",
        "A public repository that a senior engineer can navigate quickly.",
        (
            "Runtime",
            [
                "app and components - investigator product",
                "lib - domain, scoring, graph and workflow logic",
                "app/api - resource and action endpoints",
                "analytics - generator, backtest and validator",
                "data - aggregates and safe demonstration samples",
                "contracts - AsyncAPI, OpenAPI and MCP schemas",
            ],
        ),
        (
            "Delivery",
            [
                "infra - Terraform and deployment notes",
                "docs/adr - material architecture decisions",
                "docs/runbooks - operational response",
                "tests - domain, safety and contract checks",
                "docker-compose.yml - optional local dependencies",
                "GitHub Actions - reproducible quality gates",
            ],
        ),
    )
    appendix(
        b,
        "D",
        "Risk and control starter",
        "The first assurance conversation begins before model selection.",
        (
            "Customer and model",
            [
                "False positive restriction or delay",
                "Missed fraud and financial loss",
                "Unequal friction across customer cohorts",
                "Misleading explanation or false certainty",
                "Outcome label delay and feedback bias",
                "Concept drift and attacker adaptation",
            ],
        ),
        (
            "Platform and agent",
            [
                "Event or graph poisoning",
                "Training-serving skew",
                "Prompt injection and data exfiltration",
                "Excessive tool authority",
                "Approval bait-and-switch or replay",
                "Duplicate actions during retry and recovery",
            ],
        ),
    )
    appendix(
        b,
        "E",
        "Backtest protocol",
        "A reproducible synthetic evaluation that is difficult to misrepresent.",
        (
            "Design",
            [
                "One million streamed transactions",
                "Fixed seed and published generator",
                "Same holdout for rules, tabular and graph ensemble",
                "One-percent alert capacity constraint",
                "Ablation and pattern-level cohorts",
                "Bootstrap or Wilson uncertainty where appropriate",
            ],
        ),
        (
            "Claim boundary",
            [
                "All people, institutions and transactions are fictional",
                "Scores and outcomes are simulated",
                "No randomised or production experiment is implied",
                "Synthetic latency is not cloud load evidence",
                "Value capture is not recovered cash",
                "Every CV statement retains the boundary",
            ],
        ),
    )
    appendix(
        b,
        "F",
        "Twenty-five minute demonstration",
        "A deliberate interview story from operational problem to controlled decision.",
        (
            "Narrative",
            [
                "3 min - mandate, alert budget and human consequence",
                "4 min - live stream and data quality",
                "5 min - alert queue and network investigation",
                "4 min - agent evidence and approval boundary",
                "5 min - model operations and backtest",
                "4 min - architecture, risks and next investment gate",
            ],
        ),
        (
            "Challenge prompts",
            [
                "Why graph rather than more tabular features?",
                "How do you prevent training-serving leakage?",
                "What happens when Kafka or graph lookup fails?",
                "How do you set a threshold with limited investigators?",
                "How can a customer correct a false positive?",
                "Which result would make you stop the pilot?",
            ],
        ),
    )
    appendix(
        b,
        "G",
        "Completion and CV evidence checklist",
        "The repository is ready only when code, evidence and wording agree.",
        (
            "Release readiness",
            [
                "Fresh checkout runs without paid services",
                "Million-event backtest reproduces the aggregate",
                "All tests, types, lint and build pass locally and in CI",
                "Routine, ambiguous and blocked workflows work",
                "No secret or real personal data is committed",
                "Architecture and contracts match runtime behaviour",
            ],
        ),
        (
            "CV readiness",
            [
                "Every number links to an artifact and command",
                "Synthetic and simulated remain in outcome claims",
                "Scale claim states generated or processed events",
                "Latency claim identifies local test conditions",
                "Business value is modelled, not delivered",
                "Limitations are easy to find in README and UI",
            ],
        ),
    )
    assert b.p == 75, f"Expected 75 pages, created {b.p}"
    b.save()
    print(f"Created {OUT} with exactly {b.p} pages")


if __name__ == "__main__":
    build()
