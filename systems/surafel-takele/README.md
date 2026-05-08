# Surafel Takele Systems

This folder contains individual assembly-only systems that compose features from workspace packages.

- `system-a`: Operations dashboard
- `system-b`: Student planner

## Shared imports used by both systems

- `@monorepo/feature-x` (`TaskBoardWithFilters`)
- `@monorepo/feature-y` (`ActivityFeedWithSeverity`)
- `@monorepo/ui-components` (layout and primitives)
- `@monorepo/utils` (data formatting helpers)

Implementation rule: keep this folder focused on configuration and assembly. Shared logic remains in `packages/`.
