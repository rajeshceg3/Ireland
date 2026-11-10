---
name: verify-ireland
description: Verifies the Ireland tourist map app - CRA production build plus the Jest suites - with machine-readable evidence.
---

# Verify Ireland

## Launch

```bash
python3 .cursor/skills/verify-ireland/verify.py
```

Exit 0 and `FAILURES=0` mean green.

## Doctor

Gates on `npm`. Runs `npm ci` when node_modules is absent.

## Drive

1. `npm test -- --watchAll=false` with CI=true - the Jest suites
   (Map, Header, ItineraryContext, restore).
2. `npm run build` - the CRA production build must compile
   successfully.

## Evidence

Each run writes a fresh `EVIDENCE_DIR` with `evidence.json`.
`FAILURES=n` is the last line; the exit code mirrors it.

## Maintenance

The suites are the app's own; new specs are picked up automatically.
BUG_REPORT.md is a historical static-analysis document - its high
severity items (e.g. map not following filters) are fixed in current
code (MapUpdater); keep the report and code in sync when behavior
changes.
