/**
 * Scalar blocks will use vanilla events to allow more flexibility in integrations
 *
 * Event can include typed payloads using the `data` property. A target for the dispatch must be provided.
 *
 * @deprecated Use the the event bus instead
 */
export function emitCustomEvent(target, event, detail) {
    const instance = new CustomEvent(event, {
        detail: detail,
        bubbles: true,
        composed: true,
        cancelable: true,
    });
    target?.dispatchEvent(instance);
}
