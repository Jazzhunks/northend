import ScalarFloating_default from "../ScalarFloating/ScalarFloating.vue.js";
import ScalarFloatingBackdrop_default from "../ScalarFloating/ScalarFloatingBackdrop.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createSlots, createVNode, defineComponent, guardReactiveProps, mergeProps, normalizeProps, openBlock, ref, renderSlot, unref, withCtx } from "vue";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
var ScalarComboboxPopover_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarComboboxPopover",
	props: {
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
	setup(__props, { expose: __expose }) {
		const { cx } = useBindCx();
		/** Expose the popover button so we can close the popup */
		const popoverButtonRef = ref(null);
		/** Open the popover of the up or down arrows are pressed */
		const handleKeydown = (e) => {
			if (!["ArrowUp", "ArrowDown"].includes(e.key)) return;
			e.preventDefault();
			e.target?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
		};
		__expose({ popoverButtonRef });
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Popover), { as: "template" }, {
				default: withCtx(({ open }) => [createVNode(unref(ScalarFloating_default), normalizeProps(guardReactiveProps(_ctx.$props)), createSlots({
					default: withCtx(() => [createVNode(unref(PopoverButton), {
						ref_key: "popoverButtonRef",
						ref: popoverButtonRef,
						as: "template",
						onKeydown: handleKeydown
					}, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open })]),
						_: 2
					}, 1536)]),
					_: 2
				}, [open ? {
					name: "floating",
					fn: withCtx(({ width }) => [createVNode(unref(PopoverPanel), mergeProps({ style: { width } }, unref(cx)("relative flex flex-col max-h-[inherit] w-40 rounded text-sm")), {
						default: withCtx(({ close }) => [renderSlot(_ctx.$slots, "popover", {
							close,
							open
						}), createVNode(unref(ScalarFloatingBackdrop_default))]),
						_: 2
					}, 1040, ["style"])]),
					key: "0"
				} : void 0]), 1040)]),
				_: 3
			});
		};
	}
});
//#endregion
export { ScalarComboboxPopover_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarComboboxPopover.vue.script.js.map