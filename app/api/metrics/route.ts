import { NextResponse } from "next/server";
import { alerts, backtest, pipeline, programme } from "@/lib/data";

export function GET() {
  return NextResponse.json({
    evaluation: backtest.metadata,
    operatingModel: {
      institution: programme.institution,
      alertBudget: programme.investigatorCapacity,
      serviceLevel: programme.serviceLevel,
    },
    population: backtest.population,
    champion: backtest.models.graph_ensemble,
    uplift: backtest.uplift,
    curatedAlerts: alerts.length,
    pipeline,
  });
}
