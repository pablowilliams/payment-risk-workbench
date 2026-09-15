import { cp, mkdir, rm } from "node:fs/promises";

const copies = [
  [".next/static", ".next/standalone/.next/static"],
  ["public", ".next/standalone/public"],
];

await mkdir(".next/standalone/.next", { recursive: true });

for (const [source, destination] of copies) {
  await rm(destination, { recursive: true, force: true });
  await cp(source, destination, { recursive: true });
}
