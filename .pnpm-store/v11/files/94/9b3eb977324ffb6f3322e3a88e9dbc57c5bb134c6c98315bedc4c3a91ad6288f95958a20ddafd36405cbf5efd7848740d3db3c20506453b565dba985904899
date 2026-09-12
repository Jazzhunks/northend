import type { ApiReferenceEvents } from './definitions/index.js';
type Unsubscribe = () => void;
/**
 * Helper type for event listeners that makes the payload optional
 * if the event allows undefined, otherwise requires it.
 */
type EventListener<E extends keyof ApiReferenceEvents> = undefined extends ApiReferenceEvents[E] ? (payload?: ApiReferenceEvents[E]) => void : (payload: ApiReferenceEvents[E]) => void;
/**
 * Tagged-union representation of every event — one branch per event key, each
 * pairing the event name with its specific payload type.
 *
 * Because `event` acts as the discriminant, TypeScript narrows `payload` to
 * the exact type of the matched event when you check `event === '...'` inside
 * a listener (including when the argument is destructured).
 */
export type AnyEvent = {
    [E in keyof ApiReferenceEvents]: {
        event: E;
        payload: ApiReferenceEvents[E];
    };
}[keyof ApiReferenceEvents];
/**
 * Listener type for `onAny` subscriptions.
 *
 * Receives a single tagged-union object containing the concrete `event` name
 * and its `payload`. Narrowing on `event` narrows `payload` to the exact type
 * for that event — no manual casting or runtime payload checks required just
 * to satisfy types.
 *
 * @example
 * bus.onAny(({ event, payload }) => {
 *   if (event === 'log:user-login') {
 *     // payload is { uid: string; email?: string; teamUid: string }
 *     posthog.identify(payload.uid)
 *   }
 * })
 */
export type AnyEventListener = (event: AnyEvent) => void;
/**
 * Helper type for emit parameters that uses rest parameters
 * for a cleaner API surface.
 *
 * @example
 * bus.emit('scalar-update-sidebar', { value: true }, { debounceKey: 'test' })
 */
type EmitParameters<E extends keyof ApiReferenceEvents> = undefined extends ApiReferenceEvents[E] ? [event: E, payload?: ApiReferenceEvents[E], options?: {
    skipUnpackProxy?: boolean;
    debounceKey?: string;
}] : [event: E, payload: ApiReferenceEvents[E], options?: {
    skipUnpackProxy?: boolean;
    debounceKey?: string;
}];
/**
 * Type-safe event bus for workspace events
 *
 * - Full type safety for event names and payloads
 * - Debug mode for development
 * - Listen to every event via `onAny` / `offAny`
 */
export type WorkspaceEventBus = {
    /**
     * Subscribe to an event
     *
     * @param event - The event name to listen for
     * @param listener - Callback function that receives the event detail
     * @returns Unsubscribe function to remove the listener
     *
     * @example
     * const unsubscribe = bus.on('scalar-update-sidebar', (detail) => {
     *   console.log('Sidebar state:', detail.value)
     * })
     *
     * // Later, clean up
     * unsubscribe()
     */
    on<E extends keyof ApiReferenceEvents>(event: E, listener: EventListener<E>): Unsubscribe;
    /**
     * Remove a specific event listener
     *
     * @param event - The event name
     * @param listener - The listener function to remove
     *
     * @example
     * const handler = (detail) => console.log(detail)
     * bus.on('scalar-update-sidebar', handler)
     * bus.off('scalar-update-sidebar', handler)
     */
    off<E extends keyof ApiReferenceEvents>(event: E, listener: EventListener<E>): void;
    /**
     * Subscribe to an event, but only trigger the listener once.
     * The listener is automatically removed after the first invocation.
     *
     * @param event - The event name to listen for
     * @param listener - Callback function that receives the event detail
     * @returns Unsubscribe function to remove the listener before it fires
     *
     * @example
     * bus.once('scalar-update-sidebar', (detail) => {
     *   console.log('Fired once:', detail.value)
     * })
     */
    once<E extends keyof ApiReferenceEvents>(event: E, listener: EventListener<E>): Unsubscribe;
    /**
     * Subscribe to every event emitted on the bus.
     *
     * The listener receives the concrete event name as the first argument and
     * the (proxy-unpacked) payload as the second. Use this on the consumer side
     * when you need to handle every event generically — for example, analytics,
     * logging, or forwarding events across a boundary.
     *
     * Because the listener type is a discriminated union over every event key,
     * narrowing on `event` inside the listener body also narrows `payload` to
     * its exact type.
     *
     * @param listener - Callback invoked for every emitted event
     * @returns Unsubscribe function to remove the listener
     *
     * @example
     * const off = bus.onAny((event, payload) => {
     *   if (event === 'log:user-login') {
     *     // payload is narrowed to the login payload type
     *     posthog.identify(payload.uid)
     *   }
     * })
     *
     * // Clean up
     * off()
     */
    onAny(listener: AnyEventListener): Unsubscribe;
    /**
     * Remove a wildcard listener previously registered with `onAny`.
     *
     * @param listener - The listener function to remove
     *
     * @example
     * const handler = (event, payload) => console.log(event, payload)
     * bus.onAny(handler)
     * bus.offAny(handler)
     */
    offAny(listener: AnyEventListener): void;
    /**
     * Emit an event with its payload
     *
     * @param event - The event name to emit
     * @param payload - The event detail payload (optional if event allows undefined)
     * @param options.skipUnpackProxy - Whether to skip unpacking the proxy object,
     * useful if we are sure there is no proxy OR when passing js events like keyboard events.
     * @param options.debounceKey - If present we will debounce the event by the key + event name.
     *
     * @example
     * bus.emit('scalar-update-sidebar', { value: true })
     */
    emit<E extends keyof ApiReferenceEvents>(...args: EmitParameters<E>): void;
    /**
     * Flush all queued debounced emits immediately.
     */
    flushDebouncedEmits?(): void;
};
/**
 * Options for creating an event bus
 */
type EventBusOptions = {
    /**
     * Enable debug mode to log all events and listener operations
     * Useful for development and troubleshooting
     */
    debug?: boolean;
};
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
export declare const createWorkspaceEventBus: (options?: EventBusOptions) => WorkspaceEventBus;
export {};
//# sourceMappingURL=bus.d.ts.map