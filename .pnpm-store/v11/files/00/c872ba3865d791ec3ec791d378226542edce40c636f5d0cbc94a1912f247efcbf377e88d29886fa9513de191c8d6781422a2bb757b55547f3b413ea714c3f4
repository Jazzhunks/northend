import { X_SCALAR_DATE, X_SCALAR_DNT, X_SCALAR_REFERER, X_SCALAR_USER_AGENT } from '@scalar/helpers/http/scalar-headers';
import { replaceEnvVariables } from '@scalar/helpers/regex/replace-variables';
import { err, ok } from '@scalar/helpers/types/result';
import { safeRun } from '@scalar/helpers/types/safe-run';
import { redirectToProxy, shouldUseProxy } from '@scalar/helpers/url/redirect-to-proxy';
import { encode as encodeBase64 } from 'js-base64';
import { buildRequestCookieHeader } from '../../request-example/builder/header/build-request-cookie-header.js';
import { applyAllowReservedToUrl } from '../../request-example/builder/helpers/apply-allow-reserved-to-url.js';
import { resolveRequestFactoryUrl, } from '../../request-example/builder/resolve-request-factory-url.js';
import { contextFunctions, isContextFunctionName } from '../../request-example/functions.js';
const FORBIDDEN_HEADERS = [
    { header: 'date', scalarHeader: X_SCALAR_DATE },
    { header: 'dnt', scalarHeader: X_SCALAR_DNT },
    { header: 'referer', scalarHeader: X_SCALAR_REFERER },
    { header: 'user-agent', scalarHeader: X_SCALAR_USER_AGENT },
];
const formatSecurityValue = (security, replace) => {
    const substitutedValue = replaceEnvVariables(security.value, replace);
    if (security.format === 'basic') {
        return `Basic ${encodeBase64(substitutedValue)}`;
    }
    if (security.format === 'bearer') {
        return `Bearer ${substitutedValue}`;
    }
    return substitutedValue;
};
const createEnvReplaceFn = (envVariables) => {
    return (value) => {
        if (isContextFunctionName(value)) {
            return contextFunctions[value].fn() ?? null;
        }
        return envVariables[value] ?? null;
    };
};
/**
 * Resolved request URL string (path vars, operation query, **security query**
 * params, env substitution, reserved-query rules) without proxy rewriting —
 * aligned with {@link buildRequest} before `redirectToProxy`.
 *
 * By default allows incomplete merged URLs (same as permissive copy / preview); pass
 * `allowMissingRequestServerBase: false` to enforce a complete absolute URL.
 */
export const resolveExecutableRequestUrl = (request, envVariables, resolveOptions) => {
    const replace = createEnvReplaceFn(envVariables);
    const securityQueryParams = new URLSearchParams();
    if (!request.options?.disableSecurity) {
        request.security.forEach((security) => {
            if (security.in !== 'query') {
                return;
            }
            const name = replaceEnvVariables(security.name, replace);
            securityQueryParams.append(name, formatSecurityValue(security, replace));
        });
    }
    const requestUrl = resolveRequestFactoryUrl(request, {
        envVariables: replace,
        securityQueryParams,
        allowMissingRequestServerBase: resolveOptions?.allowMissingRequestServerBase ?? true,
    });
    if (!requestUrl.ok) {
        throw new Error(requestUrl.message ?? requestUrl.error);
    }
    return applyAllowReservedToUrl(requestUrl.data, request.allowedReservedQueryParameters ?? new Set());
};
/** Catch-all code when an unexpected synchronous error escapes a helper during request construction. */
export const BUILD_REQUEST_FAILED = 'BUILD_REQUEST_FAILED';
export const buildRequest = (request, options) => {
    const guarded = safeRun(() => buildRequestInner(request, options));
    if (!guarded.ok) {
        return err(BUILD_REQUEST_FAILED, guarded.error);
    }
    return guarded.data;
};
const buildRequestInner = (request, options) => {
    /** Replace the value with the environment variable or context function */
    const replace = createEnvReplaceFn(options.envVariables);
    /** Create a new abort controller */
    const controller = new AbortController();
    /** Create a new headers object with the replaced values */
    const headers = (() => {
        const headers = new Headers();
        request.headers.forEach((value, key) => {
            headers.set(replaceEnvVariables(key, replace), replaceEnvVariables(value, replace));
        });
        return headers;
    })();
    /** Create a new body object with the replaced values */
    const body = (() => {
        if (request.body?.mode === 'raw') {
            if (typeof request.body.value === 'string') {
                return replaceEnvVariables(request.body.value, replace);
            }
            return request.body.value;
        }
        if (request.body?.mode === 'formdata') {
            const form = new FormData();
            request.body.value.forEach((item) => {
                if (item.type === 'text') {
                    form.append(replaceEnvVariables(item.key, replace), replaceEnvVariables(item.value, replace));
                    return;
                }
                form.append(replaceEnvVariables(item.key, replace), item.value);
            });
            return form;
        }
        if (request.body?.mode === 'urlencoded') {
            return new URLSearchParams(request.body.value.map((item) => [
                replaceEnvVariables(item.key, replace),
                replaceEnvVariables(item.value, replace),
            ]));
        }
        return null;
    })();
    const securityQueryParams = new URLSearchParams();
    const securityCookies = [];
    /** Build the request security unless the consumer opted out via disableSecurity  */
    if (!request.options?.disableSecurity) {
        request.security.forEach((security) => {
            const name = replaceEnvVariables(security.name, replace);
            // Format the security value based on its authentication scheme.
            // - For 'basic': prefix with 'Basic' and base64-encode the value (username:password).
            // - For 'bearer': prefix with 'Bearer'.
            // - Otherwise: use the substituted value as is (for API keys, etc).
            const securityValue = formatSecurityValue(security, replace);
            if (security.in === 'header') {
                // Set the header (use replaced header name so {{ env }} placeholders work)
                headers.append(name, securityValue);
                return;
            }
            if (security.in === 'query') {
                securityQueryParams.append(name, securityValue);
                return;
            }
            if (security.in === 'cookie') {
                securityCookies.push({
                    name: name,
                    value: securityValue,
                    isDisabled: false,
                });
            }
        });
    }
    /** Resolve the request URL with the replaced values */
    const requestUrlResult = resolveRequestFactoryUrl(request, {
        envVariables: replace,
        securityQueryParams: securityQueryParams,
        allowMissingRequestServerBase: options.allowMissingRequestServerBase,
    });
    if (!requestUrlResult.ok) {
        return err(requestUrlResult.error, requestUrlResult.message);
    }
    const requestUrl = requestUrlResult.data;
    /** Check if the request should be proxied */
    const isUsingProxy = shouldUseProxy(request.proxyUrl, requestUrl);
    /** Create a new cookies array with the replaced values */
    const cookies = [...request.cookies, ...securityCookies].map((c) => ({
        ...c,
        name: replaceEnvVariables(c.name, replace),
        value: replaceEnvVariables(c.value, replace),
    }));
    /** Build the request cookie header */
    const cookieHeader = buildRequestCookieHeader({
        cookies,
        originalCookieHeader: headers.get('cookie'),
        url: requestUrl,
        useCustomCookieHeader: (isUsingProxy || request.options?.isElectron) ?? false,
    });
    /** Add the cookie header to the headers */
    if (cookieHeader) {
        headers.set(cookieHeader.name, cookieHeader.value);
    }
    /**
     * Browsers strip some forbidden headers from outgoing requests.
     * For a small, explicit allowlist we mirror those values to `X-Scalar-*`
     * so proxy/Electron can apply them server-side.
     */
    if (isUsingProxy || request.options?.isElectron) {
        FORBIDDEN_HEADERS.forEach(({ header, scalarHeader }) => {
            const headerValue = headers.get(header);
            if (headerValue) {
                headers.set(scalarHeader, headerValue);
                headers.delete(header);
            }
        });
    }
    /** Encode the URL with the allowed reserved query parameters */
    const encodedUrl = applyAllowReservedToUrl(requestUrl, request.allowedReservedQueryParameters ?? new Set());
    const finalUrl = isUsingProxy ? redirectToProxy(request.proxyUrl, encodedUrl) : encodedUrl;
    return ok({
        requestPayload: [
            finalUrl,
            {
                /**
                 * Ensure that all methods are uppercased (though only needed for patch)
                 *
                 * @see https://github.com/whatwg/fetch/issues/50
                 */
                method: request.method.toUpperCase(),
                headers,
                body,
                cache: request.cache,
                signal: controller.signal,
            },
        ],
        controller,
        isUsingProxy,
    });
};
