import { cva, useBindCx } from "@scalar/use-hooks/useBindCx";
import { computed, createBlock, createElementBlock, defineComponent, mergeProps, openBlock, renderSlot, resolveDynamicComponent, unref } from "vue";
import { ScalarIconWarning, ScalarIconWarningCircle } from "@scalar/icons";
var ScalarFormError_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarFormError",
	props: {
		variant: { default: "error" },
		icon: {}
	},
	setup(__props) {
		const iconIs = computed(() => {
			if (__props.icon) return __props.icon;
			return __props.variant === "error" ? ScalarIconWarningCircle : ScalarIconWarning;
		});
		const variants = cva({
			base: "flex items-baseline gap-1.5 rounded border p-2",
			variants: { variant: {
				error: "border-c-danger bg-b-danger text-c-danger",
				warning: "border-c-alert bg-b-alert text-c-alert"
			} }
		});
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", mergeProps({ role: "alert" }, unref(cx)(unref(variants)({ variant: __props.variant }))), [(openBlock(), createBlock(resolveDynamicComponent(iconIs.value), {
				class: "relative top-0.5 shrink-0",
				weight: "bold"
			})), renderSlot(_ctx.$slots, "default")], 16);
		};
	}
});
//#endregion
export { ScalarFormError_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarFormError.vue.script.js.map