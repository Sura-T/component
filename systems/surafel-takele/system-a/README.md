# System A - Operations Dashboard

## Purpose

This system assembles shared composites for an operations-focused dashboard where team members monitor tasks and activity severity.

## Architecture

- **Assembly layer only:** `src/App.tsx`
- **Imported composites:** `TaskBoardWithFilters` from `@monorepo/feature-x`, `ActivityFeedWithSeverity` from `@monorepo/feature-y`
- **Shared building blocks:** `Card`, `SectionHeader`, and `Stack` from `@monorepo/ui-components`
- **Shared utilities:** `formatDate` from `@monorepo/utils`

## Behavior

- Adds new operational tasks from the UI.
- Tracks generated activity events after task creation.
- Supports task-status and severity filtering using shared feature packages.

## Run

```bash
npm run build -w @systems/surafel-system-a
npm run dev -w @systems/surafel-system-a
```
