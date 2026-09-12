import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createCommentVNode, createElementBlock, defineComponent, guardReactiveProps, normalizeClass, normalizeProps, openBlock, renderSlot, resolveDynamicComponent, unref, withCtx } from "vue";
//#region src/components/ScalarForm/ScalarFormField.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "flex items-start justify-between gap-2 text-sm/none text-c-1 whitespace-nowrap font-medium"
};
var ScalarFormField_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarFormField",
	props: { is: { default: "label" } },
	setup(__props) {
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.is), normalizeProps(guardReactiveProps(unref(cx)("flex flex-col gap-1.5 rounded"))), {
				default: withCtx(() => [
					_ctx.$slots.label ? (openBlock(), createElementBlock("div", _hoisted_1, [renderSlot(_ctx.$slots, "label")])) : createCommentVNode("", true),
					renderSlot(_ctx.$slots, "default"),
					_ctx.$slots.below ? (openBlock(), createElementBlock("span", {
						key: 1,
						class: normalizeClass(unref(cx)("-mt-1.5 text-sm"))
					}, [renderSlot(_ctx.$slots, "below")], 2)) : createCommentVNode("", true)
				]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
export { ScalarFormField_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarFormField.vue.script.js.map