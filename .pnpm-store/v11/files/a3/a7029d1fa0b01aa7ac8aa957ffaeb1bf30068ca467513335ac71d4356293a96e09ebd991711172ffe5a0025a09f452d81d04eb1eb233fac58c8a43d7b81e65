import type { HttpMethod } from '@scalar/helpers/http/http-methods';
import type { OperationObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
/**
 * Restores conventional casing for well-known default headers.
 *
 * We keep this intentionally scoped to the defaults we auto-generate so we do not
 * unexpectedly rewrite user-defined header parameter names.
 */
export declare const restoreConventionalHeaderName: (headerName: string) => string;
/**
 * Restores conventional casing for default header keys.
 */
export declare const restoreConventionalDefaultHeaderNames: (headers: Record<string, string>) => Record<string, string>;
/**
 * Drops default header entries that are disabled for this example via
 * `operation['x-scalar-disable-parameters']['default-headers'][exampleName]`.
 *
 * Context builders keep the full default header map for the UI; call this when merging into the
 * outbound request (for example in `requestFactory`).
 */
export declare const filterDisabledDefaultHeaders: (operation: OperationObject, exampleName: string, headers: Record<string, string>) => Record<string, string>;
/**
 * Generates default headers for an OpenAPI operation and HTTP method.
 *
 * This function adds standard HTTP headers based on the request context:
 * - Content-Type: Added only if the HTTP method supports a request body and the OpenAPI operation
 *   defines a request body content type. Uses the selected content type from the operation or the
 *   first defined request body content type. Omitted when the selection is `none` or `other`.
 * - Accept: Derived from the 2xx response content types in the spec (joined as a comma-separated list), falling back to a wildcard.
 * - User-Agent: Added in Electron environments (desktop app or proxy) to identify the client.
 *
 * @param hideDisabledHeaders If true, filters out headers marked as disabled for this example via
 *   `x-scalar-disable-parameters.default-headers`.
 * @param hideOverriddenHeaders If true, omits any default header whose name matches an **enabled**
 *   operation parameter with `in: header` (disabled optional header parameters do not shadow defaults).
 */
export declare const getDefaultHeaders: ({ method, operation, exampleName, hideDisabledHeaders, hideOverriddenHeaders, options, }: {
    method: HttpMethod;
    operation: OperationObject;
    exampleName: string;
    hideDisabledHeaders?: boolean;
    hideOverriddenHeaders?: boolean;
    options?: {
        appVersion: string;
        isElectron: boolean;
    };
}) => Record<string, string>;
//# sourceMappingURL=headers.d.ts.map