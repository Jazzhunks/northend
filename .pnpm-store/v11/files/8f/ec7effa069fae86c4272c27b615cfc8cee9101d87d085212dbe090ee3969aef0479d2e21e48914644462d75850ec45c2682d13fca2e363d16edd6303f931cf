/**
 * Subscribes a single plugin's `on` listener to the given event bus via `onAny`.
 *
 * The plugin's `on` is passed straight through to `bus.onAny`, so it will
 * receive every event emitted on the bus as a `{ event, payload }` object.
 * Plugins without an `on` listener get a no-op unsubscribe.
 *
 * Returns an unsubscribe function. Call it when the plugin is torn down or
 * the bus is destroyed to remove the wildcard listener.
 *
 * @example
 * const unsubscribe = subscribePluginEvents(eventBus, plugin)
 * // later...
 * unsubscribe()
 */
export const subscribePluginEvents = (eventBus, plugin) => {
    if (!plugin.on) {
        return () => {
            // no-op
        };
    }
    return eventBus.onAny(plugin.on);
};
/**
 * Execute any hook with type-safe payload handling.
 * The payload type is inferred from the hook name to ensure correct usage.
 */
export const executeHook = async (payload, hookName, plugins) => {
    let currentPayload = payload;
    for (const plugin of plugins) {
        const hook = plugin.hooks?.[hookName];
        if (hook) {
            const modifiedPayload = await hook(currentPayload);
            currentPayload = (modifiedPayload ?? currentPayload);
        }
    }
    return currentPayload;
};
/**
 * Execute a WebSocket plugin hook across all plugins.
 *
 * For `beforeConnect`, the returned URL string (if any) is threaded through
 * sequentially so each plugin can transform the URL. For fire-and-forget hooks
 * (`onWebSocketMessage`, `onWebSocketClose`) the return value is ignored.
 */
export const executeWebSocketHook = async (payload, hookName, plugins) => {
    let currentPayload = payload;
    for (const plugin of plugins) {
        const hook = plugin.webSocketHooks?.[hookName];
        if (hook) {
            const result = await hook(currentPayload);
            if (hookName === 'beforeConnect' && typeof result === 'string') {
                currentPayload = { ...currentPayload, url: result };
            }
        }
    }
    return currentPayload;
};
