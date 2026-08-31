import ScalarFloating_default from "../ScalarFloating/ScalarFloating.vue.js";
import ScalarFloatingBackdrop_default from "../ScalarFloating/ScalarFloatingBackdrop.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createVNode, defineComponent, guardReactiveProps, mergeProps, normalizeProps, openBlock, renderSlot, unref, withCtx } from "vue";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
var ScalarPopover_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarPopover",
	props: {
		focus: { type: Boolean },
		placement: {},
		offset: { type: [
			Number,
			Object,
			Function
		] },
		resize: { type: Boolean },
		target: {},
		middleware: {},
		teleport: { type: [Boolean, String] }
	},
	setup(__props) {
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Popover), { as: "template" }, {
				default: withCtx(({ open }) => [createVNode(unref(ScalarFloating_default), normalizeProps(guardReactiveProps(_ctx.$props)), {
					floating: withCtx(({ width, height }) => [createVNode(unref(PopoverPanel), mergeProps({
						focus: __props.focus,
						style: {
							width,
							height
						}
					}, unref(cx)("relative flex flex-col p-0.75")), {
						default: withCtx(({ close }) => [renderSlot(_ctx.$slots, "popover", {
							close: () => close(),
							open
						}), renderSlot(_ctx.$slots, "backdrop", { open }, () => [createVNode(unref(ScalarFloatingBackdrop_default))])]),
						_: 2
					}, 1040, ["focus", "style"])]),
					default: withCtx(() => [createVNode(unref(PopoverButton), { as: "template" }, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open })]),
						_: 2
					}, 1024)]),
					_: 2
				}, 1040)]),
				_: 3
			});
		};
	}
});
//#endregion
export { ScalarPopover_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarPopover.vue.script.js.map