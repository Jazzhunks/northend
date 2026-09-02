import type { WorkspacePlugin } from '../../workspace-plugin.js';
/**
 * Plugin to persist workspace state changes with debounced writes.
 * Each type of change (meta, documentConfigs, documents, etc.) is debounced by key (type + workspaceId + optional documentName).
 * The debounce delay can be customized, defaults to 500ms.
 *
 * This avoids excessive writes to IndexedDB or other persistence layer when changes occur rapidly.
 */
export declare const persistencePlugin: ({ workspaceId, debounceDelay, maxWait, }: {
    workspaceId: string;
    debounceDelay?: number;
    maxWait?: number;
}) => Promise<WorkspacePlugin>;
//# sourceMappingURL=persistence.d.ts.map