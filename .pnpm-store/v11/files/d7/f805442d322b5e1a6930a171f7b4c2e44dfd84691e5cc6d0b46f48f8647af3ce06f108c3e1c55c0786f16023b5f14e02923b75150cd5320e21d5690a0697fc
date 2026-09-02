//#region src/v2/components/resize/use-split-resize.ts
var clamp = (value, min, max) => Math.min(max, Math.max(min, value));
/**
* Shared pointer-based resize logic for split layouts with percentage sizes.
* Use when you have both a horizontal split (e.g. left/right) and a vertical split (e.g. top/bottom).
* Only one resize is active at a time; starting another stops the previous.
*/
function useSplitResize(options) {
	const { horizontalContainerRef, verticalContainerRef, leftPaneSize, topPaneSize, horizontalMin = 20, horizontalMax = 80, verticalMin = 25, verticalMax = 75 } = options;
	let activeResizeCleanup;
	const stopActiveResize = () => {
		activeResizeCleanup?.();
		activeResizeCleanup = void 0;
	};
	const startResize = (event, onMove, cursor) => {
		event.preventDefault();
		stopActiveResize();
		const previousUserSelect = document.body.style.userSelect;
		const previousCursor = document.body.style.cursor;
		document.body.style.userSelect = "none";
		document.body.style.cursor = cursor;
		const handleMove = (moveEvent) => {
			onMove(moveEvent);
		};
		const handleUp = () => {
			stopActiveResize();
		};
		window.addEventListener("pointermove", handleMove);
		window.addEventListener("pointerup", handleUp, { once: true });
		activeResizeCleanup = () => {
			window.removeEventListener("pointermove", handleMove);
			window.removeEventListener("pointerup", handleUp);
			document.body.style.userSelect = previousUserSelect;
			document.body.style.cursor = previousCursor;
		};
	};
	const onHorizontalResizeStart = (event) => {
		const el = horizontalContainerRef.value;
		if (!el) return;
		startResize(event, (moveEvent) => {
			const rect = el.getBoundingClientRect();
			leftPaneSize.value = clamp((moveEvent.clientX - rect.left) / rect.width * 100, horizontalMin, horizontalMax);
		}, "col-resize");
	};
	const onVerticalResizeStart = (event) => {
		const el = verticalContainerRef.value;
		if (!el) return;
		startResize(event, (moveEvent) => {
			const rect = el.getBoundingClientRect();
			topPaneSize.value = clamp((moveEvent.clientY - rect.top) / rect.height * 100, verticalMin, verticalMax);
		}, "row-resize");
	};
	return {
		onHorizontalResizeStart,
		onVerticalResizeStart,
		stopActiveResize
	};
}
//#endregion
export { useSplitResize };

//# sourceMappingURL=use-split-resize.js.map