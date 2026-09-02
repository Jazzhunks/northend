import { createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, openBlock, renderSlot, toDisplayString, unref, withCtx, withModifiers } from "vue";
import { ScalarButton } from "@scalar/components/button";
//#region src/v2/components/forms/ConfirmationForm.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex justify-between gap-10" };
var ConfirmationForm_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ConfirmationForm",
	props: {
		label: { default: "Save" },
		variant: { default: "solid" }
	},
	emits: ["cancel", "submit"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("form", {
				class: "flex flex-col gap-4 text-base",
				onSubmit: _cache[1] || (_cache[1] = withModifiers(($event) => emit("submit"), ["prevent"]))
			}, [renderSlot(_ctx.$slots, "default"), createElementVNode("div", _hoisted_1, [createVNode(unref(ScalarButton), {
				size: "sm",
				type: "button",
				variant: "outlined",
				onClick: _cache[0] || (_cache[0] = ($event) => emit("cancel"))
			}, {
				default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode(" Cancel ", -1)])]),
				_: 1
			}), createVNode(unref(ScalarButton), {
				size: "sm",
				type: "submit",
				variant: __props.variant
			}, {
				default: withCtx(() => [createTextVNode(toDisplayString(__props.label), 1)]),
				_: 1
			}, 8, ["variant"])])], 32);
		};
	}
});
//#endregion
export { ConfirmationForm_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ConfirmationForm.vue.script.js.map