import { type MaybeRef, type Ref } from 'vue';
/**
 * Drag offsets
 */
export type DragOffset = 'before' | 'after' | 'into' | null;
/**
 * Item you are currently dragging over
 */
export type HoveredItem = {
    id: string;
    parentId: string | null;
    offset: DragOffset;
};
/**
 * Item you are currently dragging
 */
export type DraggingItem = Omit<HoveredItem, 'offset'>;
export type UseDraggableOptions = {
    /**
     * Upper threshold (gets multiplied with height)
     *
     * @default 0.8
     */
    ceiling?: number;
    /**
     * Lower threshold (gets multiplied with height)
     *
     * @default 0.2
     */
    floor?: number;
    /**
     * Enable dragging. Can be a reactive ref or computed.
     *
     * @default true
     */
    isDraggable?: MaybeRef<boolean>;
    /**
     * Prevents items from being hovered and dropped into. Can be either a function or a boolean
     *
     * @default true
     */
    isDroppable?: MaybeRef<boolean> | ((draggingItem: DraggingItem, hoveredItem: HoveredItem) => boolean);
    /**
     * We pass an array of parents to make it easier to reverse traverse
     */
    parentIds?: string[];
    /**
     * ID for the current item
     */
    id: string;
    /**
     * Callback when drag starts
     */
    onDragStart?: (draggingItem: DraggingItem) => void;
    /**
     * Callback when drag ends
     */
    onDragEnd?: (draggingItem: DraggingItem, hoveredItem: HoveredItem) => void;
};
/**
 * Composable for handling drag and drop functionality
 */
export declare function useDraggable(options: UseDraggableOptions): {
    /**
     * Props object to bind to the draggable element.
     * Contains the class and draggable attribute.
     */
    draggableAttrs: import("vue").ComputedRef<{
        class: string | undefined;
        draggable: boolean | undefined;
    }>;
    /**
     * Event handlers object to bind to the draggable element.
     * Contains dragend, dragover, and dragstart handlers with proper event prevention.
     */
    draggableEvents: {
        dragend: () => void;
        dragover: (ev: DragEvent) => void;
        dragstart: (ev: DragEvent) => void;
    };
    draggingItem: Readonly<Ref<DraggingItem | null>>;
    hoveredItem: Readonly<Ref<HoveredItem | null>>;
};
//# sourceMappingURL=use-draggable.d.ts.map