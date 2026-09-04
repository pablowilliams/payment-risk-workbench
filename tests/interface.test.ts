import test from "node:test";
import assert from "node:assert/strict";
import { globSync, readFileSync } from "node:fs";

const root = new URL("..", import.meta.url);

test("interface text never drops below ten pixels", () => {
  const css = readFileSync(new URL("app/globals.css", root), "utf8");
  const sizes = [...css.matchAll(/(?:font-size:\s*|font:\s*\d+\s+)(\d+)px/g)].map((match) =>
    Number(match[1]),
  );
  assert.ok(sizes.length > 50);
  assert.ok(
    sizes.every((size) => size >= 10),
    `Found undersized text: ${sizes.filter((x) => x < 10)}`,
  );
});

test("every visible button has an implemented click action", () => {
  const files = globSync("{app,components}/**/*.tsx", { cwd: new URL(root).pathname });
  for (const file of files) {
    const source = readFileSync(new URL(file, root), "utf8");
    const buttons = source.match(/<button\b[\s\S]*?>/g) ?? [];
    for (const button of buttons) {
      assert.match(button, /onClick=/, `${file} contains a decorative button: ${button}`);
    }
  }
});

test("retired branding and unsupported confidence language do not return", () => {
  const files = globSync("{app,components,docs}/**/*.{ts,tsx,md}", { cwd: new URL(root).pathname });
  const source = files.map((file) => readFileSync(new URL(file, root), "utf8")).join("\n");
  assert.doesNotMatch(source, /pulseledger|Protect attention|Evidence confidence/i);
});
