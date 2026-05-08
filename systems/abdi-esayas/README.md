# Abdi Esayas Systems

This folder contains individual assembly-only systems that compose features from workspace packages.

- `system-a`: Staff onboarding workflow
- `system-b`: Support ticket intake

Implementation rule: consume shared feature composites and shared utility contracts.

## Build Commands

```bash
npm run build -w @systems/abdi-system-a
npm run build -w @systems/abdi-system-b
```
