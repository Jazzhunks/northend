import type { WorkspaceGroup } from '@scalar/components/menu';
import { type DraggingItem, type HoveredItem, type SidebarState } from '@scalar/sidebar';
import type { WorkspaceDocument } from '@scalar/workspace-store/schemas';
import type { TraversedEntry } from '@scalar/workspace-store/schemas/navigation';
import type { ClientLayout } from '../../../v2/types/layout';
type __VLS_Props = {
    /** All documents to display sidebar items for */
    sidebarState: SidebarState<TraversedEntry>;
    /** Layout for the client */
    layout: ClientLayout;
    /** The currently active workspace */
    activeWorkspace: {
        id: string;
    };
    /** The list of all available workspaces */
    workspaces: WorkspaceGroup[];
    /** The documents belonging to the workspace */
    documents: WorkspaceDocument[];
    /**
     * Prevents sidebar items from being hovered and dropped into. Can be either a function or a boolean
     *
     * @default true
     */
    isDroppable?: boolean | ((draggingItem: DraggingItem, hoveredItem: HoveredItem) => boolean);
};
type __VLS_Slots = {
    /** Slot to add the workspace button */
    workspaceButton?(): unknown;
    /** Slot to add additional content to the decorator */
    decorator?(props: {
        item: TraversedEntry;
    }): unknown;
    /** Slot to add additional content to the footer */
    footer?(): unknown;
    /** Slot to add additional content to the empty folder */
    empty?(props: {
        item: TraversedEntry;
    }): unknown;
    /** Slot for customizing the actions section of the sidebar menu. */
    sidebarMenuActions?(): unknown;
    /** Slot to add additional content to the icon */
    icon?(props: {
        item: TraversedEntry;
        open: boolean;
    }): unknown;
};
type __VLS_ModelProps = {
    /** Controls the width of the sidebar */
    'sidebarWidth': number;
};
type __VLS_PublicProps = __VLS_Props & __VLS_ModelProps;
declare const __VLS_base: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:sidebarWidth": (value: number) => any;
} & {
    "create:workspace": () => any;
    "select:workspace": (id?: string | undefined) => any;
    "navigate:to:settings": () => any;
    selectItem: (id: string) => any;
    reorder: (draggingItem: DraggingItem, hoveredItem: HoveredItem) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onCreate:workspace"?: (() => any) | undefined;
    "onSelect:workspace"?: ((id?: string | undefined) => any) | undefined;
    "onNavigate:to:settings"?: (() => any) | undefined;
    onSelectItem?: ((id: string) => any) | undefined;
    onReorder?: ((draggingItem: DraggingItem, hoveredItem: HoveredItem) => any) | undefined;
    "onUpdate:sidebarWidth"?: ((value: number) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=Sidebar.vue.d.ts.map