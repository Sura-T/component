# Group Project: Monorepo System Development

This repository implements a modular monorepo with reusable shared libraries and feature packages. The goal is to support collaborative development while preserving clear ownership and code reuse.

## Monorepo Structure

```text
.
|-- package.json
|-- tsconfig.base.json
|-- packages
|   |-- ui-components
|   |   |-- src
|   |   `-- README.md
|   |-- utils
|   |   |-- src
|   |   `-- README.md
|   |-- feature-x
|   |   |-- src
|   |   `-- README.md
|   `-- feature-y
|       |-- src
|       `-- README.md
`-- systems
    `-- <student-name>
        |-- system-a
        `-- system-b
```

## Package Responsibilities

- `@monorepo/ui-components`: shared presentational components (`Button`, `Card`, `Badge`)
- `@monorepo/utils`: shared utility functions (`formatDate`, `toTitleCase`, `buildQueryString`, `requestJson`)
- `@monorepo/feature-x`: task board feature composites, built with shared UI and utils
- `@monorepo/feature-y`: activity feed feature composites, built with shared UI and utils

## Setup

```bash
npm install
```

## Build

```bash
npm run build
```

## Development

Use your preferred app framework (for example Next.js) inside each student system folder under `systems/<student-name>/system-a` and `systems/<student-name>/system-b`. Each system should import composited features from workspace packages instead of duplicating logic.

## Individual Work Plan

Detailed ownership and deliverables for all five team members are documented in `INDIVIDUAL_ASSIGNMENTS.md`.
