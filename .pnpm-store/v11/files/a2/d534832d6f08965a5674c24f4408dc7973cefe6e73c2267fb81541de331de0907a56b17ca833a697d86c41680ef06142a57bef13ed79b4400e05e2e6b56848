import type { HttpMethod } from '@scalar/helpers/http/http-methods';
import { createSidebarState } from '@scalar/sidebar';
import type { WorkspaceStore } from '@scalar/workspace-store/client';
import type { TraversedEntry } from '@scalar/workspace-store/schemas/navigation';
import { type ComputedRef } from 'vue';
import type { RoutePayload } from '../../../../v2/features/modal/helpers/resolve-route-parameters.js';
export type UseModalSidebarReturn = {
    handleSelectItem: (id: string) => void;
    state: ReturnType<typeof createSidebarState<TraversedEntry>>;
    getEntryByLocation: (location: {
        document: string;
        path?: string;
        method?: HttpMethod;
        example?: string;
    }) => TraversedEntry | undefined;
};
/**
 * useSidebarState - Custom hook to manage the sidebar state and navigation logic in the Scalar API client
 *
 * This composable manages the sidebar structure, synchronizes selection state
 * with the current route, and provides a handler for selecting sidebar items.
 *
 * Example usage:
 *
 * const { handleSelectItem, sidebarState } = useSidebarState({
 *   workspaceStore,
 *   workspaceSlug,
 *   documentSlug,
 *   path,
 *   method,
 *   exampleName,
 * })
 */
export declare const useModalSidebar: ({ workspaceStore, documentSlug, path, method, exampleName, route, }: {
    workspaceStore: WorkspaceStore | null;
    documentSlug: ComputedRef<string | undefined>;
    path: ComputedRef<string | undefined>;
    method: ComputedRef<HttpMethod | undefined>;
    exampleName: ComputedRef<string | undefined>;
    route: (payload: RoutePayload) => void;
}) => UseModalSidebarReturn;
//# sourceMappingURL=use-modal-sidebar.d.ts.map