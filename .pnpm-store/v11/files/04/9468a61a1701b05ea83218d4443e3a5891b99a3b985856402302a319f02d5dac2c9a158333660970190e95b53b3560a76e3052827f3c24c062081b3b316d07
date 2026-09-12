import { type MaybeRefOrGetter } from 'vue';
type SidebarStateOptions = Partial<{
    /** The key used to access child items in the sidebar tree. Defaults to "children". */
    key: string;
    /** Optional event hooks for sidebar item lifecycle */
    hooks: Partial<{
        /**
         * Called before an item is expanded.
         * @param id - The ID of the item to expand.
         */
        onBeforeExpand: (id: string) => void;
        /**
         * Called after an item is expanded.
         * @param id - The ID of the item that was expanded.
         */
        onAfterExpand: (id: string) => void;
        /**
         * Called just before a sidebar item selection changes.
         * @param id - The ID of the item that is about to be selected, or null if deselecting.
         */
        onBeforeSelect: (id: string | null) => void;
        /**
         * Called immediately after a sidebar item has been selected.
         * @param id - The ID of the item that was selected, or null if selection was cleared.
         */
        onAfterSelect: (id: string | null) => void;
    }>;
}>;
/**
 * Creates and manages the state for a sidebar tree, including selection and expansion of items.
 *
 * @template T - The type of sidebar items, which must include an `id` property.
 * @param items - The array of sidebar items.
 * @param options - Optional configuration for customizing behavior and hooks.
 * @returns An object containing sidebar state and methods to manipulate it.
 *
 * ## Example Usage
 *
 * ```ts
 * // Example sidebar items
 * const sidebarItems = [
 *   { id: 'root', label: 'Root', children: [
 *     { id: 'child1', label: 'Child 1' },
 *     { id: 'child2', label: 'Child 2', children: [
 *       { id: 'grandchild1', label: 'Grandchild 1' }
 *     ]}
 *   ]}
 * ]
 *
 * // Create sidebar state
 * const sidebarState = createSidebarState(sidebarItems, {
 *   key: 'children',
 *   hooks: {
 *     onBeforeSelect: (id) => console.log('Before select:', id),
 *     onAfterSelect: (id) => console.log('After select:', id),
 *     onBeforeExpand: (id) => console.log('Before expand:', id),
 *     onAfterExpand: (id) => console.log('After expand:', id),
 *   }
 * })
 *
 * // Select an item
 * await sidebarState.setSelected('grandchild1')
 * // Expand an item
 * await sidebarState.setExpanded('child2', true)
 * ```
 */
export declare const createSidebarState: <T extends {
    id: string;
}>(items: MaybeRefOrGetter<T[]>, options?: SidebarStateOptions) => {
    items: import("vue").ComputedRef<T[]>;
    index: import("vue").ComputedRef<Map<string, T & {
        parent?: T | undefined;
    }>>;
    selectedItems: import("vue").Ref<Record<string, boolean>, Record<string, boolean>>;
    expandedItems: import("vue").Ref<Record<string, boolean>, Record<string, boolean>>;
    selectedItem: import("vue").Ref<string | null, string | null>;
    setSelected: (id: string | null) => void;
    setExpanded: (id: string, value: boolean) => void;
    isExpanded: (id: string) => boolean;
    isSelected: (id: string) => boolean;
    getEntryById: (id: string) => (T & {
        parent?: T | undefined;
    }) | undefined;
    reset: () => void;
};
export type SidebarState<Item extends {
    id: string;
}> = ReturnType<typeof createSidebarState<Item>>;
export {};
//# sourceMappingURL=create-sidebar-state.d.ts.map