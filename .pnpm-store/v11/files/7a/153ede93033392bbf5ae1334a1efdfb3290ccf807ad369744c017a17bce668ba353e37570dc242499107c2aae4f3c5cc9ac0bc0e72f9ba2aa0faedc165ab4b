import { BUTTON_VARIANT_STYLES } from "../ScalarButton/constants.js";
import ScalarIconLegacyAdapter_default from "../ScalarIcon/ScalarIconLegacyAdapter.vue.js";
import { useTooltip } from "../ScalarTooltip/useTooltip.js";
import { cva, useBindCx } from "@scalar/use-hooks/useBindCx";
import { computed, createCommentVNode, createElementBlock, createVNode, defineComponent, mergeProps, openBlock, toDisplayString, unref, useTemplateRef } from "vue";
//#region src/components/ScalarIconButton/ScalarIconButton.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-disabled"];
var _hoisted_2 = {
	key: 0,
	class: "sr-only"
};
var ScalarIconButton_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarIconButton",
	props: {
		label: {},
		icon: { type: [Object, Function] },
		disabled: { type: Boolean },
		variant: { default: "ghost" },
		size: { default: "md" },
		thickness: {},
		weight: {},
		tooltip: { type: [
			Boolean,
			String,
			Object
		] }
	},
	setup(__props) {
		const variants = cva({
			base: "scalar-icon-button grid aspect-square cursor-pointer rounded",
			variants: {
				size: {
					xxs: "size-3.5 p-0.5",
					xs: "size-5 p-1",
					sm: "size-6 p-1",
					md: "size-10 p-3",
					full: "size-full"
				},
				disabled: { true: "cursor-not-allowed shadow-none" },
				variant: BUTTON_VARIANT_STYLES
			},
			compoundVariants: [{
				size: "md",
				variant: "ghost",
				class: "size-8 p-2 m-1 -outline-offset-2 rounded-lg"
			}]
		});
		const { cx } = useBindCx();
		const button = useTemplateRef("ref");
		useTooltip({
			content: computed(() => __props.label),
			offset: computed(() => __props.variant === "ghost" ? 0 : 4),
			placement: computed(() => typeof __props.tooltip === "boolean" ? void 0 : __props.tooltip),
			targetRef: computed(() => __props.tooltip ? button.value : void 0)
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("button", mergeProps({
				ref: "ref",
				"aria-disabled": __props.disabled,
				type: "button"
			}, unref(cx)(unref(variants)({
				size: __props.size,
				variant: __props.variant,
				disabled: __props.disabled
			}))), [createVNode(unref(ScalarIconLegacyAdapter_default), {
				icon: __props.icon,
				thickness: __props.thickness,
				weight: __props.weight
			}, null, 8, [
				"icon",
				"thickness",
				"weight"
			]), !__props.tooltip ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString(__props.label), 1)) : createCommentVNode("", true)], 16, _hoisted_1);
		};
	}
});
//#endregion
export { ScalarIconButton_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarIconButton.vue.script.js.map