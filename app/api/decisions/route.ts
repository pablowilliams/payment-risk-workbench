import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { approveDecision, buildDecision } from "@/lib/engine";
import { decisions, idempotency } from "@/lib/store";

const proposal = z.object({ alertId: z.string().min(1) });
const approval = z.object({
  decisionId: z.string().min(1),
  payloadHash: z.string().length(64),
});
function error(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "cache-control": "no-store" } },
  );
}
function actor(request: NextRequest, requiredRole: "investigator" | "supervisor") {
  const role = request.headers.get("x-demo-role");
  const actorId = request.headers.get("x-actor-id")?.trim();
  if (role !== requiredRole || !actorId || actorId.length > 120) return null;
  return actorId;
}
export async function POST(request: NextRequest) {
  const actorId = actor(request, "investigator");
  if (!actorId) return error("Demo investigator identity is required", 403);
  const parsed = proposal.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return error("A valid alertId is required", 400);
  try {
    const key = request.headers.get("idempotency-key")?.trim();
    if (key && key.length > 128) return error("Idempotency key is too long", 400);
    if (key) {
      const existingId = idempotency.get(`${actorId}:${key}`);
      const existing = existingId ? decisions.get(existingId) : undefined;
      if (existing)
        return NextResponse.json(existing, { headers: { "cache-control": "no-store" } });
    }
    const decision = buildDecision(parsed.data.alertId, actorId);
    decisions.set(decision.id, decision);
    if (key) idempotency.set(`${actorId}:${key}`, decision.id);
    if (decisions.size > 500) decisions.delete(decisions.keys().next().value!);
    if (idempotency.size > 1000) idempotency.delete(idempotency.keys().next().value!);
    return NextResponse.json(decision, {
      status: 201,
      headers: { "cache-control": "no-store" },
    });
  } catch (cause) {
    return error(cause instanceof Error ? cause.message : "Decision proposal failed", 404);
  }
}
export async function PUT(request: NextRequest) {
  const actorId = actor(request, "supervisor");
  if (!actorId) return error("Demo supervisor identity is required", 403);
  const parsed = approval.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return error("decisionId and exact payloadHash are required", 400);
  const current = decisions.get(parsed.data.decisionId);
  if (!current) return error("Decision not found", 404);
  try {
    const approved = approveDecision(current, parsed.data.payloadHash, actorId);
    decisions.set(approved.id, approved);
    return NextResponse.json(approved, { headers: { "cache-control": "no-store" } });
  } catch (cause) {
    return error(cause instanceof Error ? cause.message : "Approval failed", 409);
  }
}
