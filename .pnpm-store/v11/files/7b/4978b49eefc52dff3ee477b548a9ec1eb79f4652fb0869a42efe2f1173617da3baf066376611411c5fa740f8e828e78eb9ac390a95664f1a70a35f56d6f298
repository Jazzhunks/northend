import { isObject } from '@scalar/helpers/object/is-object';
const isOverridesProxy = Symbol('isOverridesProxy');
export const getOverridesTarget = Symbol('getOverridesTarget');
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
export const createOverridesProxy = (target, options, args = {
    cache: new WeakMap(),
}) => {
    if (!target || typeof target !== 'object') {
        return target;
    }
    // Return existing proxy for the same target to ensure referential stability
    if (args.cache.has(target)) {
        return args.cache.get(target);
    }
    const { overrides } = options ?? {};
    // Proxy handler to intercept get/set operations
    const handler = {
        get(target, prop, receiver) {
            // Special symbol to identify this as an overrides proxy
            if (prop === isOverridesProxy) {
                return true;
            }
            // Special symbol to access the original target object
            if (prop === getOverridesTarget) {
                return target;
            }
            const value = Reflect.get(target, prop, receiver);
            // Return early if the value is already an overrides proxy
            if (isOverridesProxyObject(value)) {
                return value;
            }
            // If the value is not an object, return the override if it exists, else the original value
            if (!isObject(value)) {
                return Reflect.get(overrides ?? {}, prop) ?? value;
            }
            // For nested objects, recursively create a proxy with the corresponding overrides
            return createOverridesProxy(value, { overrides: Reflect.get(overrides ?? {}, prop) }, args);
        },
        set(target, prop, value, receiver) {
            // Prevent setting special symbols
            if (prop === isOverridesProxy || prop === getOverridesTarget) {
                return false;
            }
            // If an override exists for this property, update it
            const hasOverride = overrides && Reflect.has(overrides, prop);
            if (hasOverride && overrides && typeof overrides === 'object') {
                ;
                overrides[prop] = value;
                return true;
            }
            // Otherwise, update the original target
            return Reflect.set(target, prop, value, receiver);
        },
    };
    // Return the proxy object
    const proxy = new Proxy(target, handler);
    args.cache.set(target, proxy);
    return proxy;
};
export const isOverridesProxyObject = (obj) => {
    return typeof obj === 'object' && obj !== null && obj[isOverridesProxy] === true;
};
/**
 * Unpacks an object from the overrides proxy, returning the original (unproxied) target object.
 * If the input is not an overrides proxy, returns the object as-is.
 *
 * @param input - The potentially proxied object
 * @returns The original unproxied target object or the input object
 */
export function unpackOverridesProxy(input) {
    if (typeof input === 'object' &&
        input !== null &&
        input[isOverridesProxy]) {
        return input[getOverridesTarget];
    }
    return input;
}
