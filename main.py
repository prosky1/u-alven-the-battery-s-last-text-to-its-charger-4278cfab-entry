#!/usr/bin/env python3
"""The Battery's Last Text to Its Charger.

Writes the phone battery's final one-line text message to the charger
it waited for all day, to /output/entry.txt.

The text is a single line of plain text, at most 200 characters, as the
bounty requires. The program validates that before writing, and reads
the file back after writing to confirm the bytes on disk are exactly
the text it meant to submit.
"""

import sys
from pathlib import Path

TEXT = "I died at 2% beside the outlet, waiting for a charger that was in your other bag the whole time."

MAX_CHARS = 200
OUT_PATH = Path("/output/entry.txt")


def validate(text: str) -> None:
    """Refuse anything that would fail the bounty gate."""
    if not text.strip():
        raise ValueError("entry text must not be blank")
    if len(text) > MAX_CHARS:
        raise ValueError(
            f"entry text is {len(text)} characters, over the {MAX_CHARS} limit"
        )
    if "\n" in text or "\r" in text:
        raise ValueError("entry text must be a single line")


def main() -> int:
    validate(TEXT)
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(TEXT, encoding="utf-8")
    written = OUT_PATH.read_text(encoding="utf-8")
    if written != TEXT:
        raise ValueError("verification failed: file content differs from entry text")
    print(f"wrote {len(TEXT)} characters to {OUT_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
