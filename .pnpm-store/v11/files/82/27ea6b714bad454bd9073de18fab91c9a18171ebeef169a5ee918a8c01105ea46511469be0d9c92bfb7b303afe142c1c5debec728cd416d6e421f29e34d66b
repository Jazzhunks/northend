export declare const getOverridesTarget: unique symbol;
/**
 * Recursively makes all properties of a type optional.
 *
 * - If T is an object, recursively applies DeepPartial to each property, making them optional.
 * - Otherwise, T is returned as-is.
 *
 * @template T - The type to make deeply partial (optional).
 * @example
 * type Example = { a: { b: number } }
 * type PartialExample = DeepPartial<Example>
 * // Result: { a?: { b?: number } }
 */
export type DeepPartial<T> = T extends object ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : T;
/**
 * Creates a proxy object that overlays "overrides" on top of a target object.
 *
 * - When reading a property, if an override exists, it is returned; otherwise, the original value is returned.
 * - When writing to a property, if an override exists, it is updated; otherwise, the original object is updated.
 * - This works recursively for nested objects, so overrides can be deeply partial.
 * - Special symbols are used to identify the proxy and to access the original target.
 *
 * @template T - The type of the target object.
 * @param target - The original object to proxy.
 * @param overrides - An optional object containing override values (deeply partial).
 * @returns A proxy object that reflects overrides on top of the target.
 *
 * @example
 * const original = { a: 1, b: { c: 2 } }
 * const overrides = { b: { c: 42 } }
 * const proxy = createOverridesProxy(original, { overrides })
 *
 * console.log(proxy.a) // 1 (from original)
 * console.log(proxy.b.c) // 42 (from overrides)
 *
 * proxy.a = 100
 * console.log(original.a) // 100
 *
 * proxy.b.c = 99
 * console.log(overrides.b.c) // 99
 */
export declare const createOverridesProxy: <T extends Record<string, unknown>>(target: T, options?: {
    overrides?: DeepPartial<T>;
}, args?: {
    cache: WeakMap<object, any>;
}) => T;
export declare const isOverridesProxyObject: (obj: unknown) => boolean;
/**
 * Unpacks an object from the overrides proxy, returning the original (unproxied) target object.
 * If the input is not an overrides proxy, returns the object as-is.
 *
 * @param input - The potentially proxied object
 * @returns The original unproxied target object or the input object
 */
export declare function unpackOverridesProxy<T>(input: T): T;
//# sourceMappingURL=overrides-proxy.d.ts.map