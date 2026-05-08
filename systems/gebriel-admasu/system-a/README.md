# System A - Attendance Tracker

## Purpose

This system assembles an attendance workflow for class tracking using shared feature composites.

## Architecture

- **Assembly layer only:** `src/App.tsx`
- **Imported composites:** `TaskSearchAndSortPanel` and `TaskBoardWithFilters` from `@monorepo/feature-x`
- **Shared package helpers:** `buildQueryString`, `formatDate`, `toTitleCase` from `@monorepo/utils`

## Behavior

- Supports task searching and sorting for attendance operations.
- Pipes visible search results into filtered task board workflows.
- Creates follow-up attendance tasks directly from the board.

## Run

```bash
npm run build -w @systems/gebriel-system-a
```
