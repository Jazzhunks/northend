import type { Ref } from 'vue';
type UseSplitResizeOptions = {
    /** Ref to the container used for horizontal resize (width + clientX). */
    horizontalContainerRef: Ref<HTMLElement | undefined>;
    /** Ref to the container used for vertical resize (height + clientY). */
    verticalContainerRef: Ref<HTMLElement | undefined>;
    /** Ref for the left (or first) pane width in percent (0–100). */
    leftPaneSize: Ref<number>;
    /** Ref for the top pane height in percent (0–100). */
    topPaneSize: Ref<number>;
    horizontalMin?: number;
    horizontalMax?: number;
    verticalMin?: number;
    verticalMax?: number;
};
/**
 * Shared pointer-based resize logic for split layouts with percentage sizes.
 * Use when you have both a horizontal split (e.g. left/right) and a vertical split (e.g. top/bottom).
 * Only one resize is active at a time; starting another stops the previous.
 */
export declare function useSplitResize(options: UseSplitResizeOptions): {
    onHorizontalResizeStart: (event: PointerEvent) => void;
    onVerticalResizeStart: (event: PointerEvent) => void;
    stopActiveResize: () => void;
};
export {};
//# sourceMappingURL=use-split-resize.d.ts.map