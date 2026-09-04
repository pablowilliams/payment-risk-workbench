import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { approveDecision, buildDecision } from "@/lib/engine";
import { decisions } from "@/lib/store";

const proposal = z.object({ alertId: z.string().min(1) });
const approval = z.object({
  decisionId: z.string().min(1),
  payloadHash: z.string().length(20),
  approver: z.string().min(2).max(120),
});
function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
export async function POST(request: NextRequest) {
  const parsed = proposal.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return error("A valid alertId is required", 400);
  try {
    const decision = buildDecision(parsed.data.alertId);
    decisions.set(decision.id, decision);
    return NextResponse.json(decision, { status: 201 });
  } catch (cause) {
    return error(cause instanceof Error ? cause.message : "Decision proposal failed", 404);
  }
}
export async function PUT(request: NextRequest) {
  const parsed = approval.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return error("decisionId, exact payloadHash and approver are required", 400);
  const current = decisions.get(parsed.data.decisionId);
  if (!current) return error("Decision not found", 404);
  try {
    const approved = approveDecision(current, parsed.data.payloadHash, parsed.data.approver);
    decisions.set(approved.id, approved);
    return NextResponse.json(approved);
  } catch (cause) {
    return error(cause instanceof Error ? cause.message : "Approval failed", 409);
  }
}
