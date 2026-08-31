import type { ApiReferenceEvents } from '@scalar/workspace-store/events';
/**
 * Allowlist of events that should be forwarded to PostHog.
 *
 * Each key is an event name; its value is an extractor that pulls only the
 * safe, non-PII properties we want to track. Events not in this map are
 * silently dropped — this keeps the analytics surface explicit and auditable.
 */
type PayloadExtractor<K extends keyof ApiReferenceEvents = keyof ApiReferenceEvents> = (payload: ApiReferenceEvents[K]) => Record<string, unknown> | ApiReferenceEvents[K];
/** Maps every event to either a typed extractor or `undefined` (opt-out) */
type TrackedEventsMap = {
    [K in keyof ApiReferenceEvents]: PayloadExtractor<K> | undefined;
};
export declare const TRACKED_EVENTS: TrackedEventsMap;
/**
 * Returns sanitized properties for a tracked event, or `null` if the event
 * should not be captured at all.
 *
 * This is the only function that the PostHog plugin needs to call — it
 * encapsulates both the "should we track this?" decision and the "what
 * properties are safe to send?" extraction in one step.
 */
export declare const sanitizeEventPayload: <K extends keyof ApiReferenceEvents>(event: K, payload: ApiReferenceEvents[K]) => Record<string, unknown> | ApiReferenceEvents[K] | null;
export {};
//# sourceMappingURL=sanitize-event-payload.d.ts.map