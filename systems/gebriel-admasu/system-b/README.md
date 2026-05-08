# System B - Resource Monitor

## Purpose

This system assembles resource-monitor workflows using notification digest and activity severity composites.

## Architecture

- **Assembly layer only:** `src/App.tsx`
- **Imported composites:** `NotificationDigestList`, `ActivityFeedWithSeverity` from `@monorepo/feature-y`
- **Shared package helpers:** `appendQueryParams`, `formatDate` from `@monorepo/utils`

## Behavior

- Monitors unread and warning notifications through digest filters.
- Simulates refresh actions to append new digest and feed events.
- Displays API endpoint preview assembled through shared query helpers.

## Run

```bash
npm run build -w @systems/gebriel-system-b
```
