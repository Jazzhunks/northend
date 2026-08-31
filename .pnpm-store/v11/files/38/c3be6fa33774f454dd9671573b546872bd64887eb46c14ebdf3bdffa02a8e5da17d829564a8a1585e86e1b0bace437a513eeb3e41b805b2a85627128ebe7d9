import type { ServerObject } from '../../../schemas/v3.1/strict/server.js';
/**
 * Resolves the full request URL by:
 * 1. Applying OpenAPI server variables to the server URL template.
 * 2. Merging the resolved server URL with the OpenAPI path and optional URL parameters.
 * 3. Applying "allowReserved" query parameter logic if needed (for RFC3986 reserved chars).
 *
 * @param server - The OpenAPI server object or null
 * @param path - The OpenAPI operation path (may contain {variables})
 * @param urlParams - Optional URLSearchParams to include as query parameters
 * @param allowReservedQueryParameters - Optional set of parameter names for which reserved characters should not be percent-encoded
 * @returns The resolved URL as a string
 */
export declare const getResolvedUrl: ({ server, path, urlParams, }: {
    server: ServerObject | null;
    path: string;
    urlParams?: URLSearchParams;
    allowReservedQueryParameters?: Set<string>;
}) => string;
//# sourceMappingURL=get-resolved-url.d.ts.map