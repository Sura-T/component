# Tamirat Kebede Systems

This folder contains individual assembly-only systems that compose features from workspace packages.

- `system-a`: Event management board
- `system-b`: Campus update portal

## Shared imports used by both systems

- `@monorepo/feature-x` (`DeadlineCalendarStrip`, `TaskBoardWithFilters`)
- `@monorepo/feature-y` (`AnnouncementTimeline`, `NotificationDigestList`)
- `@monorepo/ui-components` (cards, badges, layout primitives)
- `@monorepo/utils` (date ranges and event grouping helpers)

Implementation rule: this folder remains assembly/configuration-only, while reusable logic stays in `packages/`.
