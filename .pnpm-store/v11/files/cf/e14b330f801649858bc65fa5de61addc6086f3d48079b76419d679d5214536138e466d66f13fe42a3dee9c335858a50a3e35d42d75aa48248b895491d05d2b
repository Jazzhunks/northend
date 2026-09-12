import { computed, ref, toValue } from "vue";
import { cva } from "@scalar/use-hooks/useBindCx";
//#region src/hooks/use-draggable.ts
/**
* Simple throttle function to avoid package dependencies
*/
var throttle = (callback, limit) => {
	let wait = false;
	return (...args) => {
		if (wait) return;
		callback(...args);
		wait = true;
		setTimeout(() => wait = false, limit);
	};
};
/** Draggable class variants to apply to the draggable element */
var draggableVariants = cva({
	base: "relative after:absolute after:inset-x-0 after:block after:bg-blue after:opacity-15 after:pointer-events-none after:rounded",
	variants: { position: {
		before: "after:-top-0.5 after:h-0.75",
		after: "after:-bottom-0.5 after:h-0.75",
		into: "after:inset-0"
	} }
});
/**
* Shared state for drag and drop operations
* These are module-level refs so all draggable instances share the same state
*/
var draggingItem = ref(null);
var hoveredItem = ref(null);
/**
* Composable for handling drag and drop functionality
*/
function useDraggable(options) {
	const { ceiling = .8, floor = .2, isDraggable = true, isDroppable = true, parentIds = [], id, onDragStart, onDragEnd } = options;
	const parentId = computed(() => parentIds.at(-1) ?? null);
	/** Check if isDroppable guard */
	const _isDroppable = (offset) => typeof isDroppable === "function" ? isDroppable(draggingItem.value, {
		id,
		parentId: parentId.value,
		offset
	}) : toValue(isDroppable);
	const handleDragStart = (ev) => {
		if (!toValue(isDraggable) || !ev.dataTransfer || !(ev.target instanceof HTMLElement)) return;
		ev.target.setAttribute("data-dragging", "true");
		ev.dataTransfer.dropEffect = "move";
		ev.dataTransfer.effectAllowed = "move";
		const item = {
			id,
			parentId: parentId.value
		};
		draggingItem.value = item;
		onDragStart?.(item);
	};
	const handleDragOver = throttle((ev) => {
		if (!draggingItem.value || draggingItem.value.id === id || parentIds.includes(draggingItem.value?.id ?? "")) return;
		const previousOffset = hoveredItem.value?.offset;
		const height = ev.target.offsetHeight;
		const _floor = floor * height;
		const _ceiling = ceiling * height;
		let offset = null;
		if (ev.offsetY <= 0 && previousOffset && previousOffset !== "after") offset = previousOffset;
		else if (ev.offsetY <= _floor) offset = "before";
		else if (ev.offsetY >= _ceiling) offset = "after";
		else if (ev.offsetY > _floor && ev.offsetY < _ceiling) offset = "into";
		if (!_isDroppable(offset)) return;
		hoveredItem.value = {
			id,
			parentId: parentId.value,
			offset
		};
	}, 25);
	const handleDragEnd = () => {
		if (!hoveredItem.value || !draggingItem.value) return;
		const _draggingItem = { ...draggingItem.value };
		const _hoveredItem = { ...hoveredItem.value };
		draggingItem.value = null;
		hoveredItem.value = null;
		document.querySelectorAll("[data-dragging]").forEach((el) => el.removeAttribute("data-dragging"));
		if (_draggingItem.id === _hoveredItem.id) return;
		onDragEnd?.(_draggingItem, _hoveredItem);
	};
	const draggableClass = computed(() => {
		const position = id === hoveredItem.value?.id ? hoveredItem.value.offset : void 0;
		if (!position) return "";
		return draggableVariants({ position });
	});
	return {
		draggableAttrs: computed(() => ({
			class: draggableClass.value || void 0,
			draggable: toValue(isDraggable) ? true : void 0
		})),
		draggableEvents: {
			dragend: handleDragEnd,
			dragover: (ev) => {
				ev.preventDefault();
				ev.stopPropagation();
				handleDragOver(ev);
			},
			dragstart: (ev) => {
				ev.stopPropagation();
				handleDragStart(ev);
			}
		},
		draggingItem,
		hoveredItem
	};
}
//#endregion
export { useDraggable };

//# sourceMappingURL=use-draggable.js.map