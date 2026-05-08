export function formatDate(input, locale = "en-US", options = { dateStyle: "medium" }) {
    const date = input instanceof Date ? input : new Date(input);
    return new Intl.DateTimeFormat(locale, options).format(date);
}
export function toTitleCase(value) {
    return value
        .trim()
        .split(/\s+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");
}
function normalizeQueryValues(value) {
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
export function buildQueryString(params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, rawValue]) => {
        const normalizedValues = normalizeQueryValues(rawValue);
        normalizedValues.forEach((value) => query.append(key, value));
    });
    const serialized = query.toString();
    return serialized ? `?${serialized}` : "";
}
export function appendQueryParams(baseUrl, params) {
    const query = buildQueryString(params);
    if (!query) {
        return baseUrl;
    }
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${query.replace("?", separator)}`;
}
function isObjectRecord(value) {
    return typeof value === "object" && value !== null;
}
export function parseApiError(error) {
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
export async function requestJson(url, init) {
    const response = await fetch(url, init);
    if (!response.ok) {
        const error = new Error(`Request failed: ${response.status} ${response.statusText}`);
        error.status = response.status;
        error.statusText = response.statusText;
        throw error;
    }
    return (await response.json());
}
export function required(message = "This field is required") {
    return (value) => (value.trim().length === 0 ? message : null);
}
export function minLength(minimum, message = `Must be at least ${minimum} characters`) {
    return (value) => (value.trim().length < minimum ? message : null);
}
export function email(message = "Must be a valid email address") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (value) => (emailPattern.test(value.trim()) ? null : message);
}
export function composeValidators(...validators) {
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
export function validateObject(data, schema) {
    const errors = {};
    for (const key of Object.keys(schema)) {
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
const defaultRetryStatuses = [408, 425, 429, 500, 502, 503, 504];
function shouldRetry(error, retryOnStatuses, attempt, attempts) {
    if (attempt >= attempts) {
        return false;
    }
    if (isObjectRecord(error) && typeof error.status === "number") {
        return retryOnStatuses.includes(error.status);
    }
    return true;
}
function wait(delayMs) {
    return new Promise((resolve) => {
        setTimeout(resolve, delayMs);
    });
}
export async function requestJsonWithRetry(url, init, options = {}) {
    const attempts = options.attempts ?? 3;
    const initialDelayMs = options.initialDelayMs ?? 250;
    const backoffMultiplier = options.backoffMultiplier ?? 2;
    const retryOnStatuses = options.retryOnStatuses ?? defaultRetryStatuses;
    let attempt = 1;
    let delayMs = initialDelayMs;
    let lastError = new Error("Unknown request error");
    while (attempt <= attempts) {
        try {
            return await requestJson(url, init);
        }
        catch (error) {
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
export function getDateAndStringExamples(referenceDate = new Date("2026-04-25T09:00:00.000Z")) {
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
function toUtcDate(value) {
    const rawDate = value instanceof Date ? value : new Date(value);
    return new Date(Date.UTC(rawDate.getUTCFullYear(), rawDate.getUTCMonth(), rawDate.getUTCDate()));
}
export function toDateKey(value) {
    return toUtcDate(value).toISOString().slice(0, 10);
}
export function getDateRange(start, end) {
    const startUtc = toUtcDate(start);
    const endUtc = toUtcDate(end);
    const rangeStart = startUtc.getTime() <= endUtc.getTime() ? startUtc : endUtc;
    const rangeEnd = startUtc.getTime() <= endUtc.getTime() ? endUtc : startUtc;
    const result = [];
    const cursor = new Date(rangeStart);
    while (cursor.getTime() <= rangeEnd.getTime()) {
        result.push(toDateKey(cursor));
        cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return result;
}
export function getDateRangeFrom(start, days) {
    const normalizedDays = Number.isFinite(days) ? Math.max(1, Math.floor(days)) : 1;
    const startDate = toUtcDate(start);
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + normalizedDays - 1);
    return getDateRange(startDate, endDate);
}
export function isDateWithinRange(date, start, end) {
    const currentDate = toUtcDate(date).getTime();
    const startDate = toUtcDate(start).getTime();
    const endDate = toUtcDate(end).getTime();
    const min = Math.min(startDate, endDate);
    const max = Math.max(startDate, endDate);
    return currentDate >= min && currentDate <= max;
}
export function groupEventsByDate(events, getDate) {
    return events.reduce((grouped, event) => {
        const key = toDateKey(getDate(event));
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(event);
        return grouped;
    }, {});
}
