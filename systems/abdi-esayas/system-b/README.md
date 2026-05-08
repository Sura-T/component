# System B - Support Ticket Intake

## Purpose

This system assembles support ticket intake and profile status workflows for agents handling incoming requests.

## Architecture

- **Assembly layer only:** `src/App.tsx`
- **Imported composites:** `TaskCreationWizard` from `@monorepo/feature-x`, `UserProfileStatusPanel` from `@monorepo/feature-y`
- **Shared building blocks:** `Card`, `SectionHeader`, `Badge`, and `Stack` from `@monorepo/ui-components`
- **Shared utilities:** `toTitleCase` from `@monorepo/utils`

## Behavior

- Captures new ticket intake items with reusable task wizard.
- Tracks ticket submissions and most recent reporter email.
- Updates visible agent availability from profile status panel.

## Run

```bash
npm run build -w @systems/abdi-system-b
```
