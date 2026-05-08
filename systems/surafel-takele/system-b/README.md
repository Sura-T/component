# System B - Student Planner

## Purpose

This system assembles student planning workflows using shared task and activity composites.

## Architecture

- **Assembly layer only:** `src/App.tsx`
- **Imported composites:** `TaskBoardWithFilters` from `@monorepo/feature-x`, `ActivityFeedWithSeverity` from `@monorepo/feature-y`
- **Shared UI package usage:** `Badge`, `Card`, `SectionHeader`, `Stack`
- **Shared utils package usage:** `toTitleCase`

## Behavior

- Adds study tasks into the planner.
- Surfaces completion progress summary in header cards.
- Uses severity filtering to prioritize warnings from timeline activity.

## Run

```bash
npm run build -w @systems/surafel-system-b
```
