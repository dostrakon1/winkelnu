# Quality Signal Prioritization & Dashboard Summary

M0.44 promotes existing read-only feed quality attention signals into a dashboard summary and priority queue.

## Summary metrics
The internal operations dashboard shows separate counts for quality `critical`, `attention` and `watch` signals alongside existing operational incident metrics.

## Prioritization
Only non-healthy signals enter the quality priority queue. Ordering is deterministic:
1. `critical`
2. `attention`
3. `watch`
4. newest evidence first within the same level
5. stable merchant/source key fallback

The default priority queue is bounded to eight feeds and the application contract caps it at twenty.

## Safety boundary
M0.44 performs no automatic remediation. A quality signal never pauses, retries, resumes, hides or mutates a feed or catalog record. Existing authorization and audited recovery flows remain the only mutation paths.

## Data boundary
The dashboard uses only the bounded aggregate quality signal contract introduced in M0.43. It does not expose raw records, reject payloads, review reasons, import error summaries, lease credentials or partner secrets.
