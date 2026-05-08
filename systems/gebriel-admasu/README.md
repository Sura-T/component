# Gebriel Admasu Systems

This folder contains individual assembly-only systems that compose features from workspace packages.

- `system-a`: Attendance tracker
- `system-b`: Resource monitor

## Shared imports used by both systems

- `@monorepo/feature-x` (`TaskSearchAndSortPanel`, `TaskBoardWithFilters`)
- `@monorepo/feature-y` (`NotificationDigestList`, `ActivityFeedWithSeverity`)
- `@monorepo/ui-components` (layout and badge/button primitives)
- `@monorepo/utils` (query/network/date/string helpers)

Implementation rule: consume shared package exports and keep this folder focused on assembly/configuration.
