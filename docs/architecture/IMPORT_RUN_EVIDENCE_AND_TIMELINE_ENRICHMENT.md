# Import Run Evidence & Timeline Enrichment

M0.41 enriches the existing read-only feed timeline with bounded import-run evidence.

## Evidence exposed
- run status;
- started/finished timestamps;
- records seen, accepted and rejected;
- offers deactivated;
- review-required count;
- correlation id when available.

## Bounds
The server-side service reads at most 100 recent import runs. Timeline composition includes at most five matching runs per feed and caps the combined timeline length.

## Correlation
Import-run evidence is joined to a feed only when both merchant external key and source key match exactly through the relational feed source.

## Safety
No `error_summary`, reject payloads, raw records, partner credentials or secret references are exposed to the timeline contract. M0.41 adds no mutations, RPCs, privileges or schema changes.
