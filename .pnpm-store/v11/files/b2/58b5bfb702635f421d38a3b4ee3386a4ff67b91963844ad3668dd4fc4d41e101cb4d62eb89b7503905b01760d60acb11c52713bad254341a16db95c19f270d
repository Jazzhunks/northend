import type { ClientPlugin, ResponseBodyHandler } from '@scalar/oas-utils/helpers';
/**
 * Find the first plugin response body handler that matches a given MIME type.
 * Plugins are checked in order — first match wins, allowing users to override native behavior.
 *
 * Matching supports:
 * - Exact match: "application/msgpack"
 * - Suffix wildcard: "application/vnd.*+json" matches "application/vnd.api+json"
 */
export declare const resolveResponseBodyHandler: (mimeType: string, plugins: ClientPlugin[]) => ResponseBodyHandler | undefined;
//# sourceMappingURL=resolve-response-body-handler.d.ts.map