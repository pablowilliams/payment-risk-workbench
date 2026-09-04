import { NextRequest, NextResponse } from "next/server";
import { alerts } from "@/lib/data";

export function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").toLowerCase();
  const minimum = Math.min(
    1,
    Math.max(0, Number(request.nextUrl.searchParams.get("minimumRisk") ?? 0)),
  );
  const limit = Math.min(60, Math.max(1, Number(request.nextUrl.searchParams.get("limit") ?? 20)));
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
