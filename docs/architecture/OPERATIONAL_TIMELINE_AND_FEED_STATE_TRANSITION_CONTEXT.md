# Operational Timeline & Feed State Transition Context

M0.40 combines existing read-only operational evidence into a per-feed timeline.

## Sources
- current feed active/paused state;
- safe orchestration signals: health, failure count, last start, last success, next run and active-lease boolean;
- terminal human operator audit outcomes.

## Safety boundary
The timeline never exposes lease tokens, lease owners, secret references, raw audit metadata or raw orchestration error text. It adds no mutations, RPCs, privileges or schema changes.

## Correlation
Human actions are joined only when both `merchantId` and `sourceKey` match the feed exactly.

## Ordering
Events are sorted newest first. Future scheduled runs can therefore appear above the current snapshot and are explicitly labelled as scheduled events rather than completed history.

## Purpose
An operator investigating a feed incident can see its current state, recent import lifecycle signals and recent human recovery actions without reconstructing context across separate panels.
