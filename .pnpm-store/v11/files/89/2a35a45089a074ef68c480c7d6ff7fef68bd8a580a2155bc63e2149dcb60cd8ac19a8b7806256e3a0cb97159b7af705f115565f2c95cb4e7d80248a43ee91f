import ScalarIconLegacyAdapter_default from "../ScalarIcon/ScalarIconLegacyAdapter.vue.js";
import { cva, useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createElementVNode, createTextVNode, defineComponent, mergeProps, openBlock, renderSlot, resolveDynamicComponent, toDisplayString, unref, withCtx } from "vue";
import { ScalarIconCaretRight } from "@scalar/icons";
//#region src/components/ScalarSidebar/ScalarSidebarGroupToggle.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "sr-only" };
var ScalarSidebarGroupToggle_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarSidebarGroupToggle",
	props: {
		is: { default: "div" },
		open: {
			type: Boolean,
			default: false
		},
		icon: { type: [Object, Function] }
	},
	setup(__props) {
		const variants = cva({
			base: "size-4 flex items-center justify-center transition-transform duration-100",
			variants: { open: { true: "rotate-90" } },
			defaultVariants: { open: false }
		});
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.is), mergeProps({ type: __props.is === "button" ? "button" : void 0 }, unref(cx)(unref(variants)({ open: __props.open }))), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open: __props.open }, () => [__props.icon ? (openBlock(), createBlock(unref(ScalarIconLegacyAdapter_default), {
					key: 0,
					icon: __props.icon
				}, null, 8, ["icon"])) : (openBlock(), createBlock(unref(ScalarIconCaretRight), {
					key: 1,
					class: "size-3",
					weight: "bold"
				}))]), createElementVNode("span", _hoisted_1, [renderSlot(_ctx.$slots, "label", { open: __props.open }, () => [createTextVNode(toDisplayString(__props.open ? "Close" : "Open") + " Group ", 1)])])]),
				_: 3
			}, 16, ["type"]);
		};
	}
});
//#endregion
export { ScalarSidebarGroupToggle_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarSidebarGroupToggle.vue.script.js.map