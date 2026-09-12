import ScalarCheckbox_default from "./ScalarCheckbox.vue.js";
import ScalarFormInput_default from "../ScalarForm/ScalarFormInput.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createElementVNode, createVNode, defineComponent, mergeModels, mergeProps, openBlock, renderSlot, unref, useModel, vModelDynamic, withCtx, withDirectives } from "vue";
//#region src/components/ScalarCheckboxInput/ScalarCheckboxInput.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex-1 text-left min-w-0 truncate" };
var _hoisted_2 = ["type"];
var ScalarCheckboxInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarCheckboxInput",
	props: /* @__PURE__ */ mergeModels({
		type: { default: "checkbox" },
		indeterminate: {
			type: Boolean,
			default: false
		}
	}, {
		"modelValue": { type: Boolean },
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props) {
		const props = __props;
		const model = useModel(__props, "modelValue");
		const { stylingAttrsCx, otherAttrs } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarFormInput_default), mergeProps({ is: "label" }, unref(stylingAttrsCx)("cursor-pointer gap-2 hover:bg-b-2", { "text-c-1": model.value })), {
				default: withCtx(() => [
					createVNode(ScalarCheckbox_default, {
						class: "shrink-0",
						indeterminate: props.indeterminate && props.type === "checkbox",
						selected: model.value,
						type: props.type
					}, null, 8, [
						"indeterminate",
						"selected",
						"type"
					]),
					createElementVNode("div", _hoisted_1, [renderSlot(_ctx.$slots, "default")]),
					withDirectives(createElementVNode("input", mergeProps({
						ref: "inputEl",
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
						class: "sr-only",
						type: props.type
					}, unref(otherAttrs)), null, 16, _hoisted_2), [[vModelDynamic, model.value]])
				]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
export { ScalarCheckboxInput_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarCheckboxInput.vue.script.js.map