import type { HarResponse } from '@scalar/snippetz';
type FetchResponseToHarProps = {
    /** The Fetch API Response object to convert */
    response: Response;
    /**
     * Whether to include the response body in the HAR content.
     * Note: Reading the body consumes it, so the response will be cloned automatically.
     * Bodies will only be included if they meet the following criteria:
     * - Not a streaming response (text/event-stream)
     * - Text-based content (not binary)
     * - Under 1MB in size
     * @default true
     */
    includeBody?: boolean;
    /**
     * HTTP version string to use (since Fetch API does not expose this)
     * @default 'HTTP/1.1'
     */
    httpVersion?: string;
    /**
     * The maximum size of the response body to include in the HAR content.
     * @default 1MB
     */
    bodySizeLimit?: number;
};
/**
 * Converts a Fetch API Response object to HAR (HTTP Archive) Response format.
 *
 * This function transforms a standard JavaScript Fetch API Response into the
 * HAR format, which is useful for:
 * - Recording HTTP responses for replay or analysis
 * - Creating test fixtures from real API responses
 * - Debugging and monitoring HTTP traffic
 * - Generating API documentation from real responses
 *
 * The conversion handles:
 * - Response status and status text
 * - Headers extraction (including Set-Cookie headers converted to cookies)
 * - Response body reading (with automatic cloning to preserve the original)
 * - Content-Type detection and MIME type extraction
 * - Size calculations for headers and body
 * - Redirect URL extraction from Location header
 *
 * Note: The Fetch API does not expose the HTTP version, so it defaults to HTTP/1.1
 * unless specified otherwise.
 *
 * @see https://w3c.github.io/web-performance/specs/HAR/Overview.html
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response
 *
 * @example
 * const response = await fetch('https://api.example.com/users')
 * const harResponse = await fetchResponseToHar({ response })
 * console.log(harResponse.status) // 200
 */
export declare const fetchResponseToHar: ({ response, includeBody, httpVersion, bodySizeLimit, }: FetchResponseToHarProps) => Promise<HarResponse>;
/**
 * Checks if the content type is text-based and should be included in HAR.
 * Text-based content types include:
 * - text/* (text/plain, text/html, text/css, etc.)
 * - application/json
 * - application/xml and text/xml
 * - application/javascript
 * - application/*+json and application/*+xml variants
 */
export declare const isTextBasedContent: (contentType: string) => boolean;
export {};
//# sourceMappingURL=fetch-response-to-har.d.ts.map