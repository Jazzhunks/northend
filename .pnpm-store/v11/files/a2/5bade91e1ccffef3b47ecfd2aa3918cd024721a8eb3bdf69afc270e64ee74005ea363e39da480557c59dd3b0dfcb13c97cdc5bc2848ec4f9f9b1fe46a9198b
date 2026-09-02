type OnBeforeChangeHook = (path: string[], value?: unknown) => void;
type OnAfterChangeHook = (path: string[], value?: unknown) => void;
/**
 * createDetectChangesProxy - Creates a proxy for an object or array that detects and triggers hooks on changes.
 *
 * This proxy enables detection of set operations, triggering optional hooks (onBeforeChange, onAfterChange) with the path and value changed.
 * The proxy can be applied recursively to all nested objects/arrays, and caches proxies to prevent creating multiple proxies for the same object.
 *
 * Example usage:
 *
 * const obj = { foo: 1, bar: { baz: 2 } };
 * const proxy = createDetectChangesProxy(obj, {
 *   hooks: {
 *     onBeforeChange: (path, value) => console.log('Before', path, value),
 *     onAfterChange: (path, value) => console.log('After', path, value),
 *   }
 * });
 * proxy.foo = 42; // Console: Before ['foo'] '42', After ['foo'] '42'
 * proxy.bar.baz = 99; // Console: Before ['bar', 'baz'] '99', After ['bar', 'baz'] '99'
 *
 * @param target The target object or array to wrap in a proxy
 * @param options Optional: hooks for change detection
 * @param args Internal: proxy cache and current property path (used for recursion)
 * @returns The proxied object/array with change detection capabilities
 */
export declare const createDetectChangesProxy: <T>(target: T, options?: {
    hooks: Partial<{
        onBeforeChange: OnBeforeChangeHook;
        onAfterChange: OnAfterChangeHook;
    }>;
}, args?: {
    /** Cache for storing proxies */
    proxyCache: WeakMap<object, unknown>;
    /** Path for the target */
    path: string[];
}) => T;
export declare const isDetectChangesProxyObject: (obj: unknown) => boolean;
/**
 * Returns the raw/original (non-proxy) object if the passed object is a detect-changes proxy.
 * If the object is not a proxy, it returns the same object.
 *
 * @example
 * const proxy = createDetectChangesProxy({ a: 1 });
 * const raw = unpackDetectChangesProxy(proxy); // Gets the original object { a: 1 }
 * const notProxy = { b: 2 };
 * const stillRaw = unpackDetectChangesProxy(notProxy); // Returns { b: 2 }, unchanged
 */
export declare const unpackDetectChangesProxy: <T>(obj: T) => T;
export {};
//# sourceMappingURL=detect-changes-proxy.d.ts.map