# Operator Audit Filtering, Correlation & Incident Context

Status: repository-side implemented.

## Purpose
M0.39 turns the M0.38 operator action history into operational context without widening the mutation surface.

## Read-only filtering
`/intern/operations` accepts bounded GET filters for:
- actor e-mail;
- action (`feed.retry`, `feed.pause`, `feed.resume`);
- outcome (`succeeded`, `failed`);
- merchant external key;
- feed source key.

Filters are normalized server-side and capped at 120 characters. The page reads at most 50 terminal audit events and applies filtering in the application layer.

## Incident correlation
Each feed incident is correlated to recent operator actions using the exact pair:

`merchantId + sourceKey`

The incident card shows at most three recent matching actions. This provides recovery context next to the current incident while avoiding fuzzy joins or assumptions based on display names.

## Safety
- No new write action or permission is introduced.
- No audit metadata or raw error message is rendered.
- The existing operator session remains mandatory.
- The existing service-role-only repository remains the data source.
- Query parameters influence only the read view; they never select mutation targets.
- Incident correlation is exact on stable merchant/feed identifiers.

## Performance boundary
The initial implementation intentionally reads a maximum of 50 recent terminal events. This is sufficient for the internal operations view while preventing unbounded audit reads. If history volume later requires deeper exploration, use a dedicated paginated/read-optimized audit query rather than increasing the dashboard bound indefinitely.
