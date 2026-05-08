# System B - Campus Update Portal

## Purpose

This system assembles a campus communication portal with timeline navigation and digest monitoring.

## Architecture

- **Assembly layer only:** `src/App.tsx`
- **Imported composites:** `AnnouncementTimeline`, `NotificationDigestList` from `@monorepo/feature-y`
- **Shared utility usage:** `getDateRange`, `groupEventsByDate` from `@monorepo/utils`

## Behavior

- Presents campus announcements in a date-driven timeline.
- Tracks selected timeline day for focused review.
- Shows grouped announcement counts and digest summaries.

## Run

```bash
npm run build -w @systems/tamirat-system-b
```
