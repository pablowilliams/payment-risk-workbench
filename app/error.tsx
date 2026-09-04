"use client";
import { AlertTriangle, RotateCcw } from "lucide-react";
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="full-state">
      <AlertTriangle size={30} />
      <h1>The investigation workspace could not load.</h1>
      <p>No decision was executed. Retry the request or inspect the service health endpoint.</p>
      <button className="primary" onClick={reset}>
        <RotateCcw size={14} />
        Retry safely
      </button>
    </main>
  );
}
