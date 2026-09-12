import { type Result } from '@scalar/helpers/types/result';
import type { RequestFactory } from '../../request-example/builder/request-factory.js';
import { type ResolveRequestFactoryUrlError } from '../../request-example/builder/resolve-request-factory-url.js';
/**
 * The payload to build a request, useful when bypassing limitations of the browser Request object
 */
export type RequestPayload = [string, RequestInit];
/**
 * Resolved request URL string (path vars, operation query, **security query**
 * params, env substitution, reserved-query rules) without proxy rewriting —
 * aligned with {@link buildRequest} before `redirectToProxy`.
 *
 * By default allows incomplete merged URLs (same as permissive copy / preview); pass
 * `allowMissingRequestServerBase: false` to enforce a complete absolute URL.
 */
export declare const resolveExecutableRequestUrl: (request: RequestFactory, envVariables: Record<string, string>, resolveOptions?: {
    allowMissingRequestServerBase?: boolean;
}) => string;
/**
 * Built request response
 *
 * We no longer return a Request object, but a tuple of [url, init] that maps directly to the fetch() argument list so
 * we can do things that the browser doesn't allow like GET + body
 * */
export type BuildRequestData = {
    /** Create a new request payload object with the replaced values ready to be sent to the server */
    requestPayload: RequestPayload;
    /** The abort controller */
    controller: AbortController;
    /** The flag indicating if the request is being proxied */
    isUsingProxy: boolean;
};
/** Catch-all code when an unexpected synchronous error escapes a helper during request construction. */
export declare const BUILD_REQUEST_FAILED: "BUILD_REQUEST_FAILED";
export type BuildRequestFailureCode = ResolveRequestFactoryUrlError | typeof BUILD_REQUEST_FAILED;
export type BuildRequestResult = Result<BuildRequestData, BuildRequestFailureCode>;
export declare const buildRequest: (request: RequestFactory, options: {
    envVariables: Record<string, string>;
    /**
     * When true, allows an empty resolved server base URL (embedded modal, API reference callbacks, tests).
     * @default false
     */
    allowMissingRequestServerBase?: boolean;
}) => BuildRequestResult;
//# sourceMappingURL=build-request.d.ts.map