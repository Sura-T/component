# System A - Staff Onboarding Workflow

## Purpose

This system assembles onboarding modules for creating intake tasks and keeping staff profile status up to date.

## Architecture

- **Assembly layer only:** `src/App.tsx`
- **Imported composites:** `TaskCreationWizard` from `@monorepo/feature-x`, `UserProfileStatusPanel` from `@monorepo/feature-y`
- **Shared building blocks:** `Card`, `SectionHeader`, `Badge`, and `Stack` from `@monorepo/ui-components`
- **Shared utilities:** `formatDate` from `@monorepo/utils`

## Behavior

- Collects onboarding task details through reusable form composite.
- Tracks number of submitted task drafts in header state.
- Presents profile status editor using shared feature composition.

## Run

```bash
npm run build -w @systems/abdi-system-a
```
