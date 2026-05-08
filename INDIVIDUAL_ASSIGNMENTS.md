# Individual Assignments (5 Members)

Each member must deliver:

1. One major contribution to group packages (`ui-components`, `utils`, or monorepo tooling)
2. Two composites across `feature-x` and `feature-y` packages
3. Two assembled systems in `systems/<member>/system-a` and `systems/<member>/system-b`
4. One personal `README.md` documenting architecture and features

## Surafel Takele

- **Group package ownership**
  - Maintain root monorepo scripts, TypeScript base config, and cross-package integration checks.
  - Extend `ui-components` with `Button`, `Card`, and reusable layout primitives.
- **Feature composites**
  - `feature-x`: `TaskBoardWithFilters`
  - `feature-y`: `ActivityFeedWithSeverity`
- **Individual systems**
  - `systems/surafel-takele/system-a`: Operations dashboard (imports both feature packages)
  - `systems/surafel-takele/system-b`: Student planner panel (focus on task workflow)

## Gebriel Admasu

- **Group package ownership**
  - Maintain `utils` networking and query helpers (`requestJson`, query serialization, retry helper).
  - Add utility tests/examples for date and string helpers.
- **Feature composites**
  - `feature-x`: `TaskSearchAndSortPanel`
  - `feature-y`: `NotificationDigestList`
- **Individual systems**
  - `systems/gebriel-admasu/system-a`: Attendance tracker with filtered tasks
  - `systems/gebriel-admasu/system-b`: Resource monitor with notification digest

## Abdi Esayas

- **Group package ownership**
  - Add reusable form-related UI components (`InputField`, `SelectField`) in `ui-components`.
  - Add form validation helper functions in `utils`.
- **Feature composites**
  - `feature-x`: `TaskCreationWizard`
  - `feature-y`: `UserProfileStatusPanel`
- **Individual systems**
  - `systems/abdi-esayas/system-a`: Staff onboarding workflow
  - `systems/abdi-esayas/system-b`: Support ticket intake module

## Chera Mihretu

- **Group package ownership**
  - Add analytics-oriented UI components (`StatCard`, `MiniChartContainer`) in `ui-components`.
  - Add numeric aggregation helpers in `utils`.
- **Feature composites**
  - `feature-x`: `KanbanSummaryWidget`
  - `feature-y`: `KpiOverviewGrid`
- **Individual systems**
  - `systems/chera-mihretu/system-a`: Sales snapshot system
  - `systems/chera-mihretu/system-b`: Incident trend viewer

## Tamirat Kebede

- **Group package ownership**
  - Improve documentation quality, examples, and package-level READMEs.
  - Add utility helpers for date ranges and event grouping.
- **Feature composites**
  - `feature-x`: `DeadlineCalendarStrip`
  - `feature-y`: `AnnouncementTimeline`
- **Individual systems**
  - `systems/tamirat-kebede/system-a`: Event management board
  - `systems/tamirat-kebede/system-b`: Campus update portal

## Contribution Rules

- Every composite must import from both `@monorepo/ui-components` and `@monorepo/utils`.
- Every member must have visible commits in both shared packages and feature packages.
- Systems under `systems/` are assembly/configuration only; do not duplicate logic from packages.
- Each member creates a local README in their system folder describing architecture and run steps.
