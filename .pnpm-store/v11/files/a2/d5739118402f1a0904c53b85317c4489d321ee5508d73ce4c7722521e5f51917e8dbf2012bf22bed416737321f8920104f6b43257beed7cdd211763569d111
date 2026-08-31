import type { XScalarCookie } from '@scalar/workspace-store/schemas/extensions/general/x-scalar-cookies';
/**
 * Generate a cookie header from the cookie params
 */
export declare const getCookieHeader: (cookieParams: XScalarCookie[], originalCookieHeader: string | undefined) => string;
/**
 * Build out the cookies header taking in global, param and security scheme cookies
 */
export declare const buildRequestCookieHeader: ({ cookies, originalCookieHeader, url, useCustomCookieHeader, }: {
    /** Parsed/replaced cookies from the parameters and security schemes */
    cookies: XScalarCookie[];
    /** Cookie header that previously exists from the spec OR from the user */
    originalCookieHeader: string | undefined | null;
    /** The url of the request used to filter global cookies by domain */
    url: string;
    /**
     * If we are running in Electron or using the proxy, we need to add a custom header
     * that's then forwarded as a `Cookie` header.
     */
    useCustomCookieHeader: boolean;
}) => null | {
    name: string;
    value: string;
};
//# sourceMappingURL=build-request-cookie-header.d.ts.map