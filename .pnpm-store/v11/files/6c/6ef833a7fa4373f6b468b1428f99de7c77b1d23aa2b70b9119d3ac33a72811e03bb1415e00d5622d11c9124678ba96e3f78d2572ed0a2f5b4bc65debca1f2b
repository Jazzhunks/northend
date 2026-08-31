import type { SecuritySchemeObjectSecret } from '../../../request-example/builder/security/secret-types.js';
/**
 * BuildRequestSecurityResult
 *
 * Represents an extracted and normalized security credential for an OpenAPI operation input,
 * to be used directly when building HTTP requests (headers, query params, or cookies).
 *
 * This type is produced by the security builder whenever a user selects a security scheme
 * (such as API key, HTTP Basic, or HTTP Bearer) for an operation. Each object here maps directly
 * to one HTTP request authentication mechanism, with its resolved, ready-to-use value.
 *
 * Detailed Fields:
 * - `in`: Where to apply this security value in the outgoing HTTP request.
 *   - `'header'`: Set as an HTTP header (e.g., `Authorization`, or API key header).
 *   - `'query'`: Set as a query parameter (e.g., `/path?apikey=123`).
 *   - `'cookie'`: Set as a cookie header (`Cookie: apikey=123`).
 *
 * - `name`: The key name to use for the security credential in the selected location.
 *   - For headers/params, the header or query name.
 *   - For cookies, the cookie key.
 *
 * - `format` (optional): Clarifies the expected format, especially for HTTP schemes.
 *   - `'basic'`: HTTP Basic Auth.
 *   - `'bearer'`: HTTP Bearer token.
 *   - Not present for schemes without a special format (e.g., generic API keys).
 *
 * - `value`: The fully resolved secret value to use in the request.
 *   - This may already include necessary prefixes (e.g., "Bearer x", "Basic y"),
 *     or be a direct value depending on the scheme and usage.
 *
 * NOTE: This type does not capture UI display info, secret labels, or environment binding.
 * It is intended purely for producing the final request input object. Multiple
 * BuildRequestSecurityResult objects may be generated from a single operation if multiple
 * security schemes are selected and must be included simultaneously.
 */
export type BuildRequestSecurityResult = {
    /** The location of the security scheme in the HTTP request */
    in: 'header' | 'query' | 'cookie';
    /** The key/name for the authentication value (header/query/cookie name) */
    name: string;
    /** Format code for HTTP schemes (e.g., 'basic' | 'bearer'), if relevant */
    format?: 'basic' | 'bearer';
    /**
     * The fully resolved authentication value to use (may include tokens, encoded credentials, etc.)
     */
    value: string;
};
/**
 * Generates the headers, cookies and query params for selected security schemes
 * In the future we can add customization for where the security is applied
 */
export declare const buildRequestSecurity: (
/** Currently selected security for the current operation */
selectedSecuritySchemes: SecuritySchemeObjectSecret[], 
/** Include this parameter to set the placeholder for empty tokens */
emptyTokenPlaceholder?: string) => BuildRequestSecurityResult[];
//# sourceMappingURL=build-request-security.d.ts.map