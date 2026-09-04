import { pipeline } from "@/lib/data";

export const dynamic = "force-dynamic";
export function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      let cursor = 0;
      const emit = () => {
        const stage = pipeline[cursor % pipeline.length];
        controller.enqueue(
          encoder.encode(
            `event: telemetry\nid: ${cursor + 1}\ndata: ${JSON.stringify({ stage: stage.name, rate: stage.rate, lag: stage.lag, quality: stage.quality, observedAt: new Date().toISOString(), synthetic: true })}\n\n`,
          ),
        );
        cursor += 1;
        if (cursor === 6) {
          controller.close();
          return;
        }
        setTimeout(emit, 350);
      };
      emit();
    },
  });
  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}
