import { onBeforeUnmount, watch } from 'vue';
/**
 * Vue wrapper for attaching and removing event listeners
 *
 * @deprecated Use the the event bus instead
 */
export function onCustomEvent(el, event, handler) {
    // Any time the element reference changes, we need to add the event listener
    watch(() => el.value, (element) => {
        if (!element) {
            return;
        }
        element.addEventListener(event, handler);
    }, { immediate: true });
    onBeforeUnmount(() => {
        if (!el.value) {
            return;
        }
        el.value.removeEventListener(event, handler);
    });
}
