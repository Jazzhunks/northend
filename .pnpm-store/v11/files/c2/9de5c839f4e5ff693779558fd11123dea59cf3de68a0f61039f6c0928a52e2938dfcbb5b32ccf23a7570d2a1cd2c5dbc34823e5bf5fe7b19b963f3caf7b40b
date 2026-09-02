import { cva, useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, defineComponent, mergeProps, openBlock, renderSlot, resolveDynamicComponent, unref, withCtx } from "vue";
var ScalarHeaderButton_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarHeaderButton",
	props: {
		is: { default: "button" },
		cta: { type: Boolean }
	},
	setup(__props) {
		const variants = cva({
			base: "group/button flex items-center rounded px-3 py-2 text-base/4 no-underline",
			variants: { cta: {
				true: "font-bold bg-b-header-cta text-sm/4 text-c-header-cta hover:bg-h-header-cta",
				false: "text-c-header-2 hover:text-c-header-1"
			} }
		});
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.is), mergeProps({ type: __props.is === "button" ? "button" : void 0 }, unref(cx)(unref(variants)({ cta: __props.cta }))), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["type"]);
		};
	}
});
//#endregion
export { ScalarHeaderButton_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarHeaderButton.vue.script.js.map