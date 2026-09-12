import { canMethodHaveBody } from '@scalar/helpers/http/can-method-have-body';
import { replacePathVariables } from '@scalar/helpers/regex/replace-variables';
import { getResolvedRef } from '@scalar/workspace-store/helpers/get-resolved-ref';
import { getServerVariables } from '../../request-example/builder/helpers/get-server-variables.js';
import { buildRequestSecurity, } from '../../request-example/builder/security/build-request-security.js';
import { filterDisabledDefaultHeaders } from '../context/headers.js';
import { buildRequestBody } from './body/build-request-body.js';
import { buildRequestParameters } from './header/build-request-parameters.js';
/**
 * Builds a request object fastory which can be used to build a request object.
 * @returns A request object factory
 */
export const requestFactory = ({ exampleName, globalCookies, method, operation, path, proxyUrl, server, defaultHeaders, isElectron, selectedSecuritySchemes, requestBodyCompositionSelection, }) => {
    const requestBody = getResolvedRef(operation.requestBody);
    /** Build out the request parameters */
    const params = buildRequestParameters(operation.parameters ?? [], exampleName);
    const security = buildRequestSecurity(selectedSecuritySchemes);
    const headers = new Headers({
        ...filterDisabledDefaultHeaders(operation, exampleName, defaultHeaders),
        ...params.headers,
    });
    // If the method can have a body, build the request body, otherwise set it to null
    const body = canMethodHaveBody(method)
        ? buildRequestBody(requestBody, exampleName, requestBodyCompositionSelection)
        : null;
    // Delete the Content-Type header so the browser will set it automatically based on the request body
    if (body?.mode === 'formdata' || body?.mode === 'urlencoded') {
        headers.delete('Content-Type');
    }
    /** Combine the server url, path and url params into a single url */
    const serverVariables = getServerVariables(server);
    const baseUrl = replacePathVariables(server?.url ?? '', serverVariables);
    const globalCookieFilter = operation['x-scalar-disable-parameters']?.['global-cookies']?.[exampleName] ?? {};
    const cookiesList = [
        ...globalCookies.map((c) => ({
            ...c,
            isDisabled: (c.isDisabled || globalCookieFilter[c.name.toLowerCase()]) ?? false,
        })),
        ...params.cookies,
    ];
    const acceptHeader = headers.get('Accept');
    const isSseAcceptHeader = acceptHeader?.toLowerCase().includes('text/event-stream') ?? false;
    const requestCacheMode = isSseAcceptHeader ? 'no-store' : 'default';
    if (isSseAcceptHeader) {
        headers.set('Cache-Control', 'no-cache');
        headers.set('Pragma', 'no-cache');
    }
    const request = {
        baseUrl,
        proxyUrl,
        path: {
            variables: params.pathVariables,
            raw: path,
        },
        query: params.urlParams,
        method: method.toUpperCase(),
        headers,
        body,
        cookies: cookiesList,
        cache: requestCacheMode,
        security,
        options: {
            isElectron,
        },
        allowedReservedQueryParameters: params.allowReservedQueryParameters,
    };
    return {
        request,
    };
};
