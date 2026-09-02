import { createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock, ref, renderSlot } from "vue";
//#region src/v2/components/resize/Resize.vue?vue&type=script&setup=true&lang.ts
var draggingClassName = "scalar-dragging";
var Resize_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Resize",
	props: { width: {} },
	emits: ["update:width"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const isDragging = ref(false);
		const startDrag = (event) => {
			event.preventDefault();
			const startX = event.clientX;
			/** Current sidebar width when dragging starts */
			const startWidth = __props.width;
			const doDrag = (dragEvent) => {
				isDragging.value = true;
				document.body.classList.add(draggingClassName);
				let newWidth = startWidth + dragEvent.clientX - startX;
				if (newWidth > 420)
 /** Elastic effect */
				newWidth = 420 + (newWidth - 420) * .2;
				if (newWidth < 240) newWidth = 240;
				emit("update:width", newWidth);
			};
			const stopDrag = () => {
				isDragging.value = false;
				document.body.classList.remove(draggingClassName);
				document.documentElement.removeEventListener("mousemove", doDrag, false);
				document.documentElement.removeEventListener("mouseup", stopDrag, false);
				/** Reset to max width if exceeded */
				if (__props.width > 420) emit("update:width", 360);
				else if (__props.width < 240) emit("update:width", 240);
			};
			document.documentElement.addEventListener("mousemove", doDrag, false);
			document.documentElement.addEventListener("mouseup", stopDrag, false);
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: "relative",
				style: normalizeStyle({ width: `${__props.width}px` })
			}, [renderSlot(_ctx.$slots, "default", {}, void 0, true), createElementVNode("div", {
				class: "resizer",
				onMousedown: startDrag
			}, null, 32)], 4);
		};
	}
});
//#endregion
export { Resize_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=Resize.vue.script.js.map