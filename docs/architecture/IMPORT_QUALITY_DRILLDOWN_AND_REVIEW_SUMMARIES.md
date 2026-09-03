# Import Quality Drilldown & Reject/Review Summaries

M0.42 adds bounded, read-only quality evidence to the internal operations timeline.

## Included
- number of recent import runs observed per feed;
- reject count observed across those runs;
- match-review counts by pending / approved / rejected;
- counts for `review` and `none` confidence outcomes;
- latest evidence timestamp.

## Privacy and safety boundary
The operations UI never reads or exposes `import_rejects.raw_record`, reject reason payloads, review reason payloads, `import_runs.error_summary`, partner credentials or other unrestricted source data.

The repository reads only a bounded recent import-run window and aggregates quality evidence server-side. Correlation uses exact merchant external key plus feed `sourceKey`.

## Write scope
M0.42 adds no mutations, RPCs, database schema changes or privileges.
