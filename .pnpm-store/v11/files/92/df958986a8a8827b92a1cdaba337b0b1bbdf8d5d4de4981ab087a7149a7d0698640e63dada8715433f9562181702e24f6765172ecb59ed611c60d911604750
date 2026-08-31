import { createBlock, createVNode, defineComponent, normalizeClass, openBlock, renderSlot, unref, withCtx } from "vue";
import { ContextMenuContent, ContextMenuItem, ContextMenuPortal, ContextMenuRoot, ContextMenuTrigger } from "radix-vue";
//#region src/v2/components/context-menu/ContextMenu.vue?vue&type=script&setup=true&lang.ts
var ContextMenu_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ContextMenu",
	props: {
		align: { default: "center" },
		side: { default: "bottom" },
		sideOffset: {},
		disabled: {
			type: Boolean,
			default: false
		},
		triggerClass: {}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ContextMenuRoot), null, {
				default: withCtx(() => [createVNode(unref(ContextMenuTrigger), {
					class: normalizeClass(__props.triggerClass),
					disabled: props.disabled
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "trigger")]),
					_: 3
				}, 8, ["class", "disabled"]), createVNode(unref(ContextMenuPortal), null, {
					default: withCtx(() => [createVNode(unref(ContextMenuContent), {
						align: props.align,
						class: "scalar-api-client-context-menu",
						side: props.side,
						sideOffset: props.sideOffset
					}, {
						default: withCtx(() => [createVNode(unref(ContextMenuItem), null, {
							default: withCtx(() => [renderSlot(_ctx.$slots, "content")]),
							_: 3
						})]),
						_: 3
					}, 8, [
						"align",
						"side",
						"sideOffset"
					])]),
					_: 3
				})]),
				_: 3
			});
		};
	}
});
//#endregion
export { ContextMenu_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ContextMenu.vue.script.js.map