import type { HarRequest } from '@scalar/types/snippetz';
type HeaderPair = {
    name: string;
    value: string;
};
type NameValuePair = {
    name: string;
    value: string;
};
type NameOptionalValuePair = {
    name: string;
    value?: string;
};
/**
 * Normalizes the request object with defaults
 */
export declare function normalizeRequest(request: Partial<HarRequest>): Partial<HarRequest> & {
    method: string;
};
/**
 * Builds the query string from request parameters
 */
export declare function buildQueryString(queryParams?: Array<{
    name: string;
    value: string;
}>): string;
/**
 * Normalizes a request method.
 */
export declare const normalizeMethod: (method?: string) => string;
/**
 * Normalizes URL formatting while preserving origin-only paths.
 */
export declare const normalizeUrl: (url: string) => string;
/**
 * Joins URL and query string while preserving existing query values.
 */
export declare const joinUrlAndQuery: (url: string, queryString?: NameValuePair[]) => string;
/**
 * Collects deduplicated headers and optional cookie headers.
 */
export declare const collectHeaders: (headers?: NameOptionalValuePair[], cookies?: NameValuePair[]) => HeaderPair[];
/**
 * Adds a named value while preserving repeated keys as arrays.
 */
export declare const accumulateRepeatedValue: (data: Record<string, string | string[]>, name: string, value: string) => void;
/**
 * Reduces query parameters into an object while preserving repeated keys as arrays.
 */
export declare function reduceQueryParams(query?: HarRequest['queryString']): Record<string, string | string[]>;
/**
 * Builds the complete URL with query string
 */
export declare function buildUrl(baseUrl: string, queryString: string): string;
/**
 * Processes headers and cookies into a headers object
 */
export declare function processHeaders(request: Partial<HarRequest>): Record<string, string>;
export {};
//# sourceMappingURL=http.d.ts.map