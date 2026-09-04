export type AlertStatus = "New" | "Investigating" | "Awaiting review" | "Closed";
export interface PaymentAlert {
  id: string;
  rank: number;
  account: string;
  customer: string;
  amount: number;
  exposure: number;
  pattern: string;
  fraud: boolean;
  region: string;
  ruleScore: number;
  tabularScore: number;
  graphScore: number;
  ensembleScore: number;
  status: AlertStatus;
  ageMinutes: number;
  signals: {
    velocity1h: number;
    newDevice: boolean;
    geoDistanceKm: number;
    failedAuth24h: number;
    recipientAgeDays: number;
    sharedDevices: number;
    riskyNeighborRatio: number;
    cycleScore: number;
  };
}
export interface InvestigationDecision {
  id: string;
  alertId: string;
  status: "draft" | "awaiting_approval" | "approved" | "rejected";
  recommendedAction: "continue_monitoring" | "request_verification" | "temporary_payment_hold";
  rationale: string;
  evidence: string[];
  payloadHash: string;
  createdAt: string;
  approvedAt?: string;
  approver?: string;
}
export interface GraphNode {
  id: string;
  label: string;
  type: "customer" | "account" | "device" | "beneficiary" | "merchant" | "ip";
  risk: number;
  x: number;
  y: number;
}
export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  weight: number;
}
