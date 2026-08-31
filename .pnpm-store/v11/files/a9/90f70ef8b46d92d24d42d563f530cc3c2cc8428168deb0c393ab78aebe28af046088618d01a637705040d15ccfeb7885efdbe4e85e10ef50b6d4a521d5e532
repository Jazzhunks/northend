/**
 * Unpacks special vue reactivity & override & detect-changes & magic proxy from an input object or array,
 * returning the "raw" plain object or array.
 *
 * This function recursively traverses the input object or array, removing any proxies
 * (e.g. Vue reactivity proxies, magic proxies, override proxies, detect-changes proxies)
 * to obtain and return the underlying "raw" plain object or array.
 *
 * The recursion is controlled by the `depth` parameter. If `depth` is `null`, unlimited depth is allowed.
 * If a proxied object is detected and unwrapped at non-root level, a warning is logged.
 *
 * @param input - The object or array (possibly deeply nested or proxied) to recursively unwrap.
 * @param depth - Optional, limits recursion depth. `null` means unlimited depth (default is 1).
 * @returns - A plain object or array with all proxies removed up to the specified depth.
 */
export declare const unpackProxyObject: <T>(input: T, { depth }?: {
    depth?: number | null;
}) => T;
//# sourceMappingURL=unpack-proxy.d.ts.map