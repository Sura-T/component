# System A - Event Management Board

## Purpose

This system assembles event planning workflows with deadline-based scheduling and task execution tracking.

## Architecture

- **Assembly layer only:** `src/App.tsx`
- **Imported composites:** `DeadlineCalendarStrip`, `TaskBoardWithFilters` from `@monorepo/feature-x`
- **Shared utility usage:** `getDateRangeFrom`, `toDateKey`, and `toTitleCase` from `@monorepo/utils`

## Behavior

- Displays deadline counts in a calendar strip across a 7-day window.
- Links selected calendar day to a daily task snapshot.
- Supports follow-up task creation through shared task board composites.

## Run

```bash
npm run build -w @systems/tamirat-system-a
```
