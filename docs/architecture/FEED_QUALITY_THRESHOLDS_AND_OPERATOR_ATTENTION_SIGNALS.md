# Feed Quality Thresholds & Operator Attention Signals

M0.43 derives read-only operator attention signals from recent bounded import evidence.

## Threshold policy
Ratio-based alerts require at least 100 observed records for a feed.

- reject ratio >= 5%: attention
- reject ratio >= 15%: critical
- review load `(pending reviews + no-match confidence) / records seen` >= 10%: attention
- review load >= 20%: critical
- 25 or more pending reviews without a stronger ratio signal: watch

These are operational defaults, not partner-specific acceptance rules. They can be calibrated later using real production evidence.

## Safety boundary
Signals do not pause, retry, disable, rank, hide or otherwise mutate feeds or catalog data. They are presentation/read-model signals only.

The signal layer consumes only already-sanitized import-run counts and aggregate quality summaries. It never reads raw rejected records, reject reasons, review reasons, `error_summary`, credentials or lease secrets.

## Correlation
Evidence is correlated by exact `merchantId + sourceKey` only.
