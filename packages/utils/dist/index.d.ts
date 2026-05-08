export declare function formatDate(input: string | Date, locale?: string, options?: Intl.DateTimeFormatOptions): string;
export declare function toTitleCase(value: string): string;
type QuerySingleValue = string | number | boolean | Date;
export type QueryValue = QuerySingleValue | QuerySingleValue[] | null | undefined;
export declare function buildQueryString(params: Record<string, QueryValue>): string;
export declare function appendQueryParams(baseUrl: string, params: Record<string, QueryValue>): string;
export declare function parseApiError(error: unknown): string;
export declare function requestJson<T>(url: string, init?: RequestInit): Promise<T>;
export type Validator<T> = (value: T) => string | null;
export declare function required(message?: string): Validator<string>;
export declare function minLength(minimum: number, message?: string): Validator<string>;
export declare function email(message?: string): Validator<string>;
export declare function composeValidators<T>(...validators: Validator<T>[]): Validator<T>;
export declare function validateObject<T extends object>(data: T, schema: Partial<{
    [K in keyof T]: Validator<T[K]>;
}>): Partial<Record<keyof T, string>>;
export interface RetryOptions {
    attempts?: number;
    initialDelayMs?: number;
    backoffMultiplier?: number;
    retryOnStatuses?: number[];
}
export declare function requestJsonWithRetry<T>(url: string, init?: RequestInit, options?: RetryOptions): Promise<T>;
export interface UtilityExampleSnapshot {
    formattedDate: string;
    normalizedTitle: string;
    queryPreview: string;
}
export declare function getDateAndStringExamples(referenceDate?: Date): UtilityExampleSnapshot;
export {};
//# sourceMappingURL=index.d.ts.map