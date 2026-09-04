import { NextResponse } from "next/server";
import { backtest } from "@/lib/data";

export function GET() {
  return NextResponse.json(backtest, {
    headers: { "cache-control": "public, max-age=300, stale-while-revalidate=3600" },
  });
}
