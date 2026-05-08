export declare function formatDate(input: string | Date, locale?: string, options?: Intl.DateTimeFormatOptions): string;
export declare function toTitleCase(value: string): string;
export declare function buildQueryString(params: Record<string, string | number | boolean | undefined>): string;
export declare function requestJson<T>(url: string, init?: RequestInit): Promise<T>;
export type Validator<T> = (value: T) => string | null;
export declare function required(message?: string): Validator<string>;
export declare function minLength(minimum: number, message?: string): Validator<string>;
export declare function email(message?: string): Validator<string>;
export declare function composeValidators<T>(...validators: Validator<T>[]): Validator<T>;
export declare function validateObject<T extends object>(data: T, schema: Partial<{
    [K in keyof T]: Validator<T[K]>;
}>): Partial<Record<keyof T, string>>;
//# sourceMappingURL=index.d.ts.map