import ScalarFormInput_default from "../ScalarForm/ScalarFormInput.vue.js";
import ScalarToggle_default from "./ScalarToggle.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createElementVNode, createVNode, defineComponent, mergeProps, openBlock, renderSlot, unref, useModel, withCtx } from "vue";
//#region src/components/ScalarToggle/ScalarToggleInput.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex-1 text-left min-w-0 truncate" };
var ScalarToggleInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarToggleInput",
	props: {
		"modelValue": { type: Boolean },
		"modelModifiers": {}
	},
	emits: ["update:modelValue"],
	setup(__props) {
		const model = useModel(__props, "modelValue");
		const { stylingAttrsCx, otherAttrs } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarFormInput_default), mergeProps({ is: "label" }, unref(stylingAttrsCx)("cursor-pointer gap-2 hover:bg-b-2", { "text-c-1": model.value })), {
				default: withCtx(() => [createElementVNode("div", _hoisted_1, [renderSlot(_ctx.$slots, "default")]), createVNode(ScalarToggle_default, mergeProps({
					modelValue: model.value,
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
					class: "shrink-0"
				}, unref(otherAttrs)), null, 16, ["modelValue"])]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
export { ScalarToggleInput_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarToggleInput.vue.script.js.map