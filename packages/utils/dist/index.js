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
