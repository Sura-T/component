export function formatDate(
  input: string | Date,
  locale = "en-US",
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }
): string {
  const date = input instanceof Date ? input : new Date(input);
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function toTitleCase(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

type QuerySingleValue = string | number | boolean | Date;
export type QueryValue = QuerySingleValue | QuerySingleValue[] | null | undefined;

function normalizeQueryValues(value: QueryValue): string[] {
  if (value === undefined || value === null) {
    return [];
  }

  const sourceValues = Array.isArray(value) ? value : [value];

  return sourceValues.map((entry) => {
    if (entry instanceof Date) {
      return entry.toISOString();
    }

    return String(entry);
  });
}

export function buildQueryString(params: Record<string, QueryValue>): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, rawValue]) => {
    const normalizedValues = normalizeQueryValues(rawValue);
    normalizedValues.forEach((value) => query.append(key, value));
  });

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export function appendQueryParams(
  baseUrl: string,
  params: Record<string, QueryValue>
): string {
  const query = buildQueryString(params);
  if (!query) {
    return baseUrl;
  }

  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${query.replace("?", separator)}`;
}

type HttpRequestError = Error & {
  status?: number;
  statusText?: string;
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseApiError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (isObjectRecord(error)) {
    const message = error.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return "Unexpected API error";
}

export async function requestJson<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    const error = new Error(
      `Request failed: ${response.status} ${response.statusText}`
    ) as HttpRequestError;
    error.status = response.status;
    error.statusText = response.statusText;
    throw error;
  }

  return (await response.json()) as T;
}

export type Validator<T> = (value: T) => string | null;

export function required(message = "This field is required"): Validator<string> {
  return (value) => (value.trim().length === 0 ? message : null);
}

export function minLength(
  minimum: number,
  message = `Must be at least ${minimum} characters`
): Validator<string> {
  return (value) => (value.trim().length < minimum ? message : null);
}

export function email(message = "Must be a valid email address"): Validator<string> {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (value) => (emailPattern.test(value.trim()) ? null : message);
}

export function composeValidators<T>(...validators: Validator<T>[]): Validator<T> {
  return (value) => {
    for (const validate of validators) {
      const error = validate(value);
      if (error) {
        return error;
      }
    }
    return null;
  };
}

export function validateObject<T extends object>(
  data: T,
  schema: Partial<{ [K in keyof T]: Validator<T[K]> }>
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const key of Object.keys(schema) as Array<keyof T>) {
    const validator = schema[key];
    if (!validator) {
      continue;
    }

    const validationError = validator(data[key]);
    if (validationError) {
      errors[key] = validationError;
    }
  }

  return errors;
}

export interface RetryOptions {
  attempts?: number;
  initialDelayMs?: number;
  backoffMultiplier?: number;
  retryOnStatuses?: number[];
}

const defaultRetryStatuses = [408, 425, 429, 500, 502, 503, 504];

function shouldRetry(
  error: unknown,
  retryOnStatuses: number[],
  attempt: number,
  attempts: number
): boolean {
  if (attempt >= attempts) {
    return false;
  }

  if (isObjectRecord(error) && typeof error.status === "number") {
    return retryOnStatuses.includes(error.status);
  }

  return true;
}

function wait(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

export async function requestJsonWithRetry<T>(
  url: string,
  init?: RequestInit,
  options: RetryOptions = {}
): Promise<T> {
  const attempts = options.attempts ?? 3;
  const initialDelayMs = options.initialDelayMs ?? 250;
  const backoffMultiplier = options.backoffMultiplier ?? 2;
  const retryOnStatuses = options.retryOnStatuses ?? defaultRetryStatuses;

  let attempt = 1;
  let delayMs = initialDelayMs;
  let lastError: unknown = new Error("Unknown request error");

  while (attempt <= attempts) {
    try {
      return await requestJson<T>(url, init);
    } catch (error) {
      lastError = error;
      const retryable = shouldRetry(error, retryOnStatuses, attempt, attempts);
      if (!retryable) {
        throw error;
      }

      await wait(delayMs);
      delayMs *= backoffMultiplier;
      attempt += 1;
    }
  }

  throw lastError;
}

export interface UtilityExampleSnapshot {
  formattedDate: string;
  normalizedTitle: string;
  queryPreview: string;
}

export function getDateAndStringExamples(
  referenceDate: Date = new Date("2026-04-25T09:00:00.000Z")
): UtilityExampleSnapshot {
  return {
    formattedDate: formatDate(referenceDate),
    normalizedTitle: toTitleCase("student portal update"),
    queryPreview: buildQueryString({
      from: referenceDate,
      search: "attendance summary",
      view: "weekly"
    })
  };
}

function toUtcDate(value: string | Date): Date {
  const rawDate = value instanceof Date ? value : new Date(value);
  return new Date(
    Date.UTC(rawDate.getUTCFullYear(), rawDate.getUTCMonth(), rawDate.getUTCDate())
  );
}

export function toDateKey(value: string | Date): string {
  return toUtcDate(value).toISOString().slice(0, 10);
}

export function getDateRange(start: string | Date, end: string | Date): string[] {
  const startUtc = toUtcDate(start);
  const endUtc = toUtcDate(end);
  const rangeStart = startUtc.getTime() <= endUtc.getTime() ? startUtc : endUtc;
  const rangeEnd = startUtc.getTime() <= endUtc.getTime() ? endUtc : startUtc;

  const result: string[] = [];
  const cursor = new Date(rangeStart);
  while (cursor.getTime() <= rangeEnd.getTime()) {
    result.push(toDateKey(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return result;
}

export function getDateRangeFrom(start: string | Date, days: number): string[] {
  const normalizedDays = Number.isFinite(days) ? Math.max(1, Math.floor(days)) : 1;
  const startDate = toUtcDate(start);
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + normalizedDays - 1);
  return getDateRange(startDate, endDate);
}

export function isDateWithinRange(
  date: string | Date,
  start: string | Date,
  end: string | Date
): boolean {
  const currentDate = toUtcDate(date).getTime();
  const startDate = toUtcDate(start).getTime();
  const endDate = toUtcDate(end).getTime();
  const min = Math.min(startDate, endDate);
  const max = Math.max(startDate, endDate);
  return currentDate >= min && currentDate <= max;
}

export function groupEventsByDate<T>(
  events: T[],
  getDate: (item: T) => string | Date
): Record<string, T[]> {
  return events.reduce<Record<string, T[]>>((grouped, event) => {
    const key = toDateKey(getDate(event));
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(event);
    return grouped;
  }, {});
}
