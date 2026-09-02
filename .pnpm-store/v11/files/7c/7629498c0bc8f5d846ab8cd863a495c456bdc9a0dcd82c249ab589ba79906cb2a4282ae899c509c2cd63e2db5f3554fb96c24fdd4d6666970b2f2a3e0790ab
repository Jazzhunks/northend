import { type Result } from '@scalar/helpers/types/result';
import type { RequestFactory } from '../../request-example/builder/request-factory.js';
/**
 * Discriminated error code when the merged request URL is not a complete absolute target
 * (for example no OpenAPI server, or unresolved `{{environment}}` segments left in the merged URL).
 */
export declare const MISSING_REQUEST_SERVER_BASE: "MISSING_REQUEST_SERVER_BASE";
/**
 * Discriminated error code when the merged URL cannot be encoded or parsed (invalid path params, malformed URL).
 */
export declare const INVALID_REQUEST_FACTORY_URL: "INVALID_REQUEST_FACTORY_URL";
export type ResolveRequestFactoryUrlError = typeof MISSING_REQUEST_SERVER_BASE | typeof INVALID_REQUEST_FACTORY_URL;
export type ResolveRequestFactoryUrlResult = Result<string, ResolveRequestFactoryUrlError>;
/**
 * Resolves the request URL string from a {@link RequestFactory} using the same
 * rules as {@link buildRequest} (path variables, query, security query params),
 * without proxy rewriting or reserved-query encoding.
 */
export declare const resolveRequestFactoryUrl: (request: RequestFactory, options: {
    envVariables: Record<string, string> | ((value: string) => string | null);
    securityQueryParams: URLSearchParams;
    /**
     * When true, skips incomplete-URL validation (embedded modal, copy URL, tests).
     * @default false
     */
    allowMissingRequestServerBase?: boolean;
}) => ResolveRequestFactoryUrlResult;
//# sourceMappingURL=resolve-request-factory-url.d.ts.map