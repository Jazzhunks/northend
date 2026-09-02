import ScalarLoading_default from "../ScalarLoading/ScalarLoading.vue.js";
import { BUTTON_VARIANT_STYLES } from "./constants.js";
import { cva, useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createCommentVNode, createElementBlock, createVNode, defineComponent, mergeProps, normalizeClass, openBlock, renderSlot, resolveDynamicComponent, unref, withCtx } from "vue";
//#region src/components/ScalarButton/ScalarButton.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 3,
	class: "centered"
};
var ScalarButton_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarButton",
	props: {
		is: { default: "button" },
		variant: { default: "solid" },
		size: { default: "md" },
		disabled: { type: Boolean },
		icon: { type: [Object, Function] },
		loader: {}
	},
	setup(__props) {
		/** Variant styles for the button (wrapper) */
		const buttonVariants = cva({
			base: "scalar-button flex cursor-pointer items-center justify-center rounded font-medium -outline-offset-1",
			variants: {
				disabled: { true: "bg-b-2 text-color-3 shadow-none" },
				size: {
					xs: "px-2 py-1 text-xs/4",
					sm: "px-3.5 py-2 text-sm/4",
					md: "px-5 py-3 text-sm/4"
				},
				variant: BUTTON_VARIANT_STYLES
			},
			compoundVariants: [{
				disabled: true,
				variant: [
					"solid",
					"outlined",
					"ghost",
					"gradient",
					"danger"
				],
				class: "bg-b-2 text-c-3 shadow-none hover:bg-b-[_] cursor-not-allowed active:bg-b-[_] hover:text-c-[_] active:text-c-[_]"
			}, {
				disabled: true,
				variant: ["gradient"],
				class: "to-b-1.5 bg-linear-to-b hover:bg-linear-to-b dark:hover:bg-linear-to-t"
			}]
		});
		/** Variant styles for the button icon */
		const iconVariants = cva({
			base: "shrink-0",
			variants: { size: {
				xs: "size-2.75 -ml-0.25 mr-1",
				sm: "size-3.5 -ml-0.25 mr-1",
				md: "size-3.5 -ml-0.5 mr-1.5"
			} }
		});
		/** Variant styles for the loading icon */
		const loadingVariants = cva({ variants: { size: {
			xs: "size-4",
			sm: "size-5",
			md: "size-6"
		} } });
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.is), mergeProps({
				"aria-disabled": __props.disabled || void 0,
				type: __props.is === "button" ? "button" : void 0
			}, unref(cx)(unref(buttonVariants)({
				disabled: __props.disabled,
				size: __props.size,
				variant: __props.variant
			}), { relative: __props.loader?.isActive })), {
				default: withCtx(() => [
					_ctx.$slots.icon || __props.icon ? (openBlock(), createElementBlock("div", {
						key: 0,
						class: normalizeClass([unref(iconVariants)({ size: __props.size }), { invisible: __props.loader?.isActive }])
					}, [renderSlot(_ctx.$slots, "icon", {}, () => [(openBlock(), createBlock(resolveDynamicComponent(__props.icon), { class: "size-full" }))])], 2)) : createCommentVNode("", true),
					__props.loader ? (openBlock(), createElementBlock("span", {
						key: 1,
						class: normalizeClass({ invisible: __props.loader?.isActive })
					}, [renderSlot(_ctx.$slots, "default")], 2)) : renderSlot(_ctx.$slots, "default", { key: 2 }),
					__props.loader?.isActive ? (openBlock(), createElementBlock("div", _hoisted_1, [createVNode(unref(ScalarLoading_default), {
						class: normalizeClass(unref(loadingVariants)({ size: __props.size })),
						loader: __props.loader
					}, null, 8, ["class", "loader"])])) : createCommentVNode("", true)
				]),
				_: 3
			}, 16, ["aria-disabled", "type"]);
		};
	}
});
//#endregion
export { ScalarButton_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarButton.vue.script.js.map