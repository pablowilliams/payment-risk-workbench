import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      service: "pulseledger",
      version: "1.0.0",
      mode: "portfolio-simulation",
      time: new Date().toISOString(),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
