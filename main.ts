// The Battery's Last Text to Its Charger.
//
// Writes the phone battery's final one-line text message to the charger
// it waited for all day, to /output/entry.txt.
//
// The text is a single line of plain text, at most 200 characters, as the
// bounty requires. The program validates that before writing, and reads
// the file back after writing to confirm the bytes on disk are exactly
// the text it meant to submit.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const TEXT =
  "You charged the toothbrush first. It doesn't even leave the house.";

const MAX_CHARS = 200;
const OUT_PATH = "/output/entry.txt";

function validate(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("entry text must not be blank");
  }
  if (text.length > MAX_CHARS) {
    throw new Error(
      `entry text is ${text.length} characters, over the ${MAX_CHARS} limit`,
    );
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry text must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry text must not start or end with whitespace");
  }
  // The gate counts characters, but the file must also be exact bytes:
  // a multi-byte character would make byte length differ from char length.
  if (Buffer.byteLength(text, "utf-8") !== text.length) {
    throw new Error("entry text must be plain ASCII, one byte per character");
  }
}

function main(): void {
  validate(TEXT);
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, TEXT, "utf-8");
  const written = readFileSync(OUT_PATH, "utf-8");
  if (written !== TEXT) {
    throw new Error("verification failed: file content differs from entry text");
  }
  console.log(`wrote ${TEXT.length} characters to ${OUT_PATH}`);
}

main();
