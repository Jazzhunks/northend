import type { WorkspaceStore } from '@scalar/workspace-store/client';
import type { ApiReferenceEvents, WorkspaceEventBus } from '@scalar/workspace-store/events';
import { type Ref } from 'vue';
type Hook<T extends keyof ApiReferenceEvents> = Partial<{
    onBeforeExecute: (payload: ApiReferenceEvents[T]) => void | Promise<void> | ApiReferenceEvents[T] | Promise<ApiReferenceEvents[T]>;
    onAfterExecute: (payload: ApiReferenceEvents[T]) => void | Promise<void>;
}>;
type Hooks = {
    [key in keyof ApiReferenceEvents]?: Hook<key>;
};
/**
 * Initializes all Workspace Event Handlers by subscribing eventBus listeners
 * to each relevant mutator operation. Hooks are used for before/after execution.
 *
 * @param eventBus The WorkspaceEventBus to subscribe to
 * @param store The WorkspaceStore instance
 * @param hooks Object containing optional before/after hooks for each event
 */
export declare function initializeWorkspaceEventHandlers({ eventBus, store, hooks, }: {
    eventBus: WorkspaceEventBus;
    store: Ref<WorkspaceStore | null>;
    hooks: Hooks;
}): void;
export {};
//# sourceMappingURL=workspace-events.d.ts.map