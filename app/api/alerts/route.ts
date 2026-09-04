import { NextRequest, NextResponse } from "next/server";
import { alerts } from "@/lib/data";
import { z } from "zod";

const query = z.object({
  q: z.string().trim().max(100).default(""),
  minimumRisk: z.coerce.number().min(0).max(1).default(0),
  limit: z.coerce.number().int().min(1).max(60).default(20),
});

export function GET(request: NextRequest) {
  const parsed = query.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid alert query" }, { status: 400 });
  }
  const q = parsed.data.q.toLowerCase();
  const minimum = parsed.data.minimumRisk;
  const limit = parsed.data.limit;
  const matches = alerts.filter(
    (a) =>
      (!q || `${a.id} ${a.customer} ${a.account} ${a.pattern}`.toLowerCase().includes(q)) &&
      a.ensembleScore >= minimum,
  );
  return NextResponse.json({
    items: matches.slice(0, limit),
    total: matches.length,
    limit,
    disclosure: "Curated synthetic alerts generated from a fixed-seed portfolio evaluation.",
  });
}
