import { debounce } from '@scalar/helpers/general/debounce';
import { unpackProxyObject } from '../helpers/unpack-proxy.js';
/**
 * Creates a type-safe event bus for workspace events
 *
 * This implementation uses a Map for O(1) lookups and maintains
 * a separate Set for each event type to efficiently manage listeners.
 *
 * Create this once per application instance.
 *
 * @param options - Configuration options
 * @returns A fully type-safe event bus instance
 *
 * @example
 * const bus = createWorkspaceEventBus()
 *
 * // Subscribe to events
 * const unsubscribe = bus.on('scalar-update-sidebar', (detail) => {
 *   console.log('Sidebar:', detail.value)
 * })
 *
 * // Emit events
 * bus.emit('scalar-update-sidebar', { value: true })
 *
 * // Clean up
 * unsubscribe()
 */
export const createWorkspaceEventBus = (options = {}) => {
    const { debug = false } = options;
    const events = new Map();
    /**
     * Set of wildcard listeners that receive every emitted event.
     * Using a Set keeps add/remove O(1) and iteration order stable.
     */
    const anyListeners = new Set();
    const pendingLogs = [];
    let logTimeout = null;
    /**
     * Single debounce instance for all debounced emits
     * Uses keys to separate different event + debounceKey combinations
     */
    const { execute: debouncedEmitter, flushAll: flushDebouncedEmitters } = debounce({
        delay: 328,
    });
    /**
     * Get or create a listener set for an event
     */
    const getListeners = (event) => {
        const listeners = events.get(event) ?? new Set();
        events.set(event, listeners);
        return listeners;
    };
    /**
     * Flush batched logs using console.groupCollapsed
     */
    const flushLogs = () => {
        if (pendingLogs.length === 0) {
            return;
        }
        if (debug) {
            if (pendingLogs.length === 1) {
                // Only one log, output it normally without grouping
                const firstLog = pendingLogs[0];
                if (firstLog) {
                    console.log(`[EventBus] ${firstLog.message}`, ...firstLog.args);
                }
            }
            else {
                // Multiple logs, use a collapsed group
                console.groupCollapsed(`[EventBus] ${pendingLogs.length} operations`);
                for (const { message, args } of pendingLogs) {
                    console.log(message, ...args);
                }
                console.groupEnd();
            }
        }
        pendingLogs.length = 0;
        logTimeout = null;
    };
    /**
     * Log debug information if debug mode is enabled
     * Batches multiple logs together using console.groupCollapsed
     */
    const log = (message, ...args) => {
        if (debug) {
            pendingLogs.push({ message, args });
            // Clear existing timeout and set a new one to batch logs
            if (logTimeout) {
                clearTimeout(logTimeout);
            }
            logTimeout = setTimeout(flushLogs, 500);
        }
    };
    const once = (event, listener) => {
        const wrapper = (payload) => {
            off(event, wrapper);
            listener(payload);
        };
        return on(event, wrapper);
    };
    const on = (event, listener) => {
        const listeners = getListeners(event);
        listeners.add(listener);
        log(`Added listener for "${String(event)}" (${listeners.size} total)`);
        return () => off(event, listener);
    };
    const off = (event, listener) => {
        const listeners = events.get(event);
        if (!listeners) {
            return;
        }
        listeners.delete(listener);
        log(`Removed listener for "${String(event)}" (${listeners.size} remaining)`);
        // Clean up empty listener sets to avoid memory leaks
        if (listeners.size === 0) {
            events.delete(event);
        }
    };
    const onAny = (listener) => {
        anyListeners.add(listener);
        log(`Added wildcard listener (${anyListeners.size} total)`);
        return () => offAny(listener);
    };
    const offAny = (listener) => {
        anyListeners.delete(listener);
        log(`Removed wildcard listener (${anyListeners.size} remaining)`);
    };
    /**
     * Internal function that performs the actual emission logic
     * This is extracted so it can be wrapped with debouncing
     */
    const performEmit = (event, payload, options) => {
        // We unpack the payload here to ensure that, within mutators, we are not assigning proxies directly,
        // but are always assigning plain objects 5 level depth.
        const unpackedPayload = options?.skipUnpackProxy ? payload : unpackProxyObject(payload, { depth: 5 });
        const listeners = events.get(event);
        const hasExactListeners = listeners !== undefined && listeners.size > 0;
        if (!hasExactListeners && anyListeners.size === 0) {
            log(`🛑 No listeners for "${String(event)}"`);
            return;
        }
        // Execute exact-match listeners first so the deterministic, type-specific
        // handlers see the event before any generic/wildcard observers.
        if (hasExactListeners && listeners) {
            log(`Emitting "${String(event)}" to ${listeners.size} listener(s)`, payload);
            // Convert to array to avoid issues if listeners modify the set during iteration
            const listenersArray = Array.from(listeners);
            for (const listener of listenersArray) {
                try {
                    listener(unpackedPayload);
                }
                catch (error) {
                    // Do not let one listener error break other listeners
                    console.error(`[EventBus] Error in listener for "${String(event)}":`, error);
                }
            }
        }
        // Notify wildcard listeners after specific ones have run.
        if (anyListeners.size > 0) {
            log(`Emitting "${String(event)}" to ${anyListeners.size} wildcard listener(s)`, payload);
            // Build the tagged-union argument once and reuse it across listeners.
            // The cast bridges from the loose internal `(event, payload)` pair to
            // the discriminated-union shape exposed to consumers.
            const anyEvent = { event, payload: unpackedPayload };
            const anyListenersArray = Array.from(anyListeners);
            for (const listener of anyListenersArray) {
                try {
                    listener(anyEvent);
                }
                catch (error) {
                    console.error(`[EventBus] Error in wildcard listener for "${String(event)}":`, error);
                }
            }
        }
    };
    const emit = (...args) => {
        const [event, payload, options] = args;
        // If no debounce key is provided, emit immediately
        if (!options?.debounceKey) {
            performEmit(event, payload, options);
            return;
        }
        // Create a unique key for this event + debounce key combination
        const debounceMapKey = `${event}-${options.debounceKey}`;
        // Pass the closure directly - debounce will store the latest version
        debouncedEmitter(debounceMapKey, () => performEmit(event, payload, options));
    };
    const flushDebouncedEmits = () => {
        flushDebouncedEmitters();
    };
    return {
        on,
        once,
        off,
        onAny,
        offAny,
        emit,
        flushDebouncedEmits,
    };
};
