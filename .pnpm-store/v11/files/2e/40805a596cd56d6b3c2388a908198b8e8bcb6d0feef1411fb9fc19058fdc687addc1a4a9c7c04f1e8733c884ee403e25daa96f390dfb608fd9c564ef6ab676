import type { HarRequest } from '@scalar/snippetz';
import type { RequestPayload } from '../../../request-example/builder/build-request.js';
type FetchRequestToHarProps = {
    /** The [url, RequestInit] tuple to convert, as returned by buildRequest */
    requestPayload: RequestPayload;
    /**
     * Whether to include the request body in the HAR postData.
     * @default true
     */
    includeBody?: boolean;
    /**
     * HTTP version string to use (Fetch API does not expose this).
     * @default 'HTTP/1.1'
     */
    httpVersion?: string;
    /**
     * Maximum body size in bytes to capture in the HAR postData. Bodies larger
     * than this are omitted and recorded with bodySize -1.
     * @default 1048576 (1 MB)
     */
    bodySizeLimit?: number;
};
/**
 * Converts a RequestPayload (url + RequestInit tuple) to HAR (HTTP Archive) Request format.
 *
 * The conversion handles:
 * - Request method and URL
 * - Headers extraction
 * - Query parameters extraction from URL
 * - Cookie extraction from headers
 * - Content-Type detection and MIME type extraction
 * - Size calculations for headers and body
 * - FormData and URLSearchParams bodies are converted to a params array
 * - String, Blob, and ArrayBuffer bodies are read as text
 * - Binary (octet-stream) and ReadableStream bodies are skipped
 *
 * @see https://w3c.github.io/web-performance/specs/HAR/Overview.html
 *
 * @example
 * const harRequest = await fetchRequestToHar({
 *   requestPayload: ['https://api.example.com/users', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ name: 'John' }),
 *   }],
 * })
 * console.log(harRequest.method) // 'POST'
 * console.log(harRequest.postData?.text) // '{"name":"John"}'
 */
export declare const fetchRequestToHar: ({ requestPayload, includeBody, httpVersion, bodySizeLimit, }: FetchRequestToHarProps) => Promise<HarRequest>;
export {};
//# sourceMappingURL=fetch-request-to-har.d.ts.map