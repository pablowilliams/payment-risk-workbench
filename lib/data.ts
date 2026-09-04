import results from "@/data/backtest-results.json";
import rawAlerts from "@/data/alerts.json";
import type { GraphEdge, GraphNode, PaymentAlert } from "./types";
export const backtest = results;
export const alerts = rawAlerts as PaymentAlert[];
export const programme = {
  institution: "Verdant Bank",
  environment: "Synthetic evaluation",
  decision: "Recommend a twelve-week shadow-mode pilot after the two open gates close",
  sponsor: "Director of Financial Crime Operations",
  investigatorCapacity: 10000,
  serviceLevel: "30 minutes",
  modelVersion: "ensemble-2026.09.1",
};
export const graphNodes: GraphNode[] = [
  { id: "customer", label: "Maya Thompson", type: "customer", risk: 0.82, x: 48, y: 48 },
  { id: "account", label: "Primary account", type: "account", risk: 0.88, x: 30, y: 31 },
  { id: "device", label: "Device D-8402", type: "device", risk: 0.94, x: 68, y: 27 },
  { id: "ip", label: "IP 185.44.x.x", type: "ip", risk: 0.91, x: 84, y: 48 },
  { id: "beneficiary", label: "New beneficiary", type: "beneficiary", risk: 0.86, x: 63, y: 70 },
  { id: "linked1", label: "Linked account 1", type: "account", risk: 0.78, x: 35, y: 75 },
  { id: "linked2", label: "Linked account 2", type: "account", risk: 0.72, x: 15, y: 57 },
  { id: "merchant", label: "Exchange merchant", type: "merchant", risk: 0.64, x: 84, y: 78 },
];
export const graphEdges: GraphEdge[] = [
  { source: "customer", target: "account", label: "owns", weight: 1 },
  { source: "customer", target: "device", label: "uses", weight: 1 },
  { source: "device", target: "ip", label: "observed at", weight: 0.9 },
  { source: "account", target: "beneficiary", label: "paid", weight: 0.9 },
  { source: "device", target: "linked1", label: "shared", weight: 0.95 },
  { source: "device", target: "linked2", label: "shared", weight: 0.84 },
  { source: "beneficiary", target: "merchant", label: "funded", weight: 0.7 },
  { source: "linked1", target: "beneficiary", label: "paid", weight: 0.83 },
];
export function reasonCodesFor(alert: PaymentAlert) {
  return [
    {
      name: "Shared device network",
      value: Math.min(100, 35 + alert.signals.sharedDevices * 6),
      detail: `${alert.signals.sharedDevices} accounts share the observed device`,
    },
    {
      name: "Risky-neighbour ratio",
      value: Math.round(alert.signals.riskyNeighborRatio * 100),
      detail: `${alert.signals.riskyNeighborRatio.toFixed(2)} of weighted neighbours exceed threshold`,
    },
    {
      name: "Beneficiary recency",
      value: Math.max(0, 100 - Math.min(100, alert.signals.recipientAgeDays * 4)),
      detail: `Recipient first observed ${alert.signals.recipientAgeDays} days ago`,
    },
    {
      name: "Transaction velocity",
      value: Math.min(100, alert.signals.velocity1h * 8),
      detail: `${alert.signals.velocity1h} payments observed in the last hour`,
    },
  ];
}
export const pipeline = [
  { name: "payment.raw", rate: "2,840/s", lag: "18 ms", quality: 99.99, status: "healthy" },
  { name: "payment.validated", rate: "2,837/s", lag: "31 ms", quality: 99.97, status: "healthy" },
  { name: "feature.realtime", rate: "2,836/s", lag: "84 ms", quality: 99.94, status: "healthy" },
  { name: "risk.scored", rate: "2,836/s", lag: "112 ms", quality: 99.99, status: "healthy" },
  { name: "alert.created", rate: "28/s", lag: "141 ms", quality: 100, status: "healthy" },
  { name: "decision.audit", rate: "7/s", lag: "46 ms", quality: 100, status: "healthy" },
];
export const policies = [
  {
    id: "FC-04",
    title: "Temporary payment holds",
    excerpt:
      "A temporary hold requires a specific fraud concern, proportionate scope, named reviewer and a customer contact route.",
    effective: "2026-07-01",
  },
  {
    id: "VC-02",
    title: "Vulnerable customer support",
    excerpt:
      "Potential vulnerability requires a trained human route and prohibits fully automated adverse decisions.",
    effective: "2026-05-15",
  },
  {
    id: "INV-11",
    title: "Investigation evidence standard",
    excerpt:
      "Material decisions must link transaction, identity, device, network and model evidence with timestamps.",
    effective: "2026-08-10",
  },
];
