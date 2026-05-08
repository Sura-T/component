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
export function buildQueryString(params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, rawValue]) => {
        if (rawValue === undefined) {
            return;
        }
        query.set(key, String(rawValue));
    });
    const serialized = query.toString();
    return serialized ? `?${serialized}` : "";
}
export async function requestJson(url, init) {
    const response = await fetch(url, init);
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
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
