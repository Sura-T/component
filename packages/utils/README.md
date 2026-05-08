# @monorepo/utils

Utility helpers consumed by all feature packages.

## Exports

- `formatDate`
- `toTitleCase`
- `buildQueryString`
- `appendQueryParams`
- `requestJson`
- `required`
- `minLength`
- `email`
- `composeValidators`
- `validateObject`
- `requestJsonWithRetry`
- `parseApiError`
- `getDateAndStringExamples`

## Validation examples

```ts
import { required, minLength, email, composeValidators } from "@monorepo/utils";
```

## Date/String examples
```ts
import { formatDate, getDateAndStringExamples, toTitleCase } from "@monorepo/utils";

formatDate("2026-04-25T09:00:00.000Z");
toTitleCase("attendance summary panel");
getDateAndStringExamples();
```

## Networking examples

```ts
import { appendQueryParams, requestJsonWithRetry } from "@monorepo/utils";

const url = appendQueryParams("/api/attendance", {
  classId: "section-a",
  status: ["present", "late"]
});

const data = await requestJsonWithRetry(url, undefined, {
  attempts: 3,
  initialDelayMs: 200
});
```

## Build

```bash
npm run build -w @monorepo/utils
```
