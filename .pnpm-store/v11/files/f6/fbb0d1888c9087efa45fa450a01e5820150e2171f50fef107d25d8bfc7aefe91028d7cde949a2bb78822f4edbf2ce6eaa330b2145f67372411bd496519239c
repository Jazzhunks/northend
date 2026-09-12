import ScalarFormInputGroup_default from "../ScalarForm/ScalarFormInputGroup.vue.js";
import ScalarToggleInput_default from "./ScalarToggleInput.vue.js";
import { Fragment, createBlock, createElementBlock, createTextVNode, defineComponent, mergeModels, openBlock, renderList, toDisplayString, unref, useModel, withCtx } from "vue";
var ScalarToggleGroup_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarToggleGroup",
	props: /* @__PURE__ */ mergeModels({ options: { default: () => [] } }, {
		"modelValue": { default: [] },
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props) {
		const model = useModel(__props, "modelValue");
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarFormInputGroup_default), null, {
				default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (option) => {
					return openBlock(), createBlock(ScalarToggleInput_default, {
						key: option.value,
						modelValue: model.value?.some(({ value }) => value === option.value),
						"onUpdate:modelValue": (checked) => model.value = checked ? [...model.value, option] : model.value.filter(({ value }) => value !== option.value)
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(option.label), 1)]),
						_: 2
					}, 1032, ["modelValue", "onUpdate:modelValue"]);
				}), 128))]),
				_: 1
			});
		};
	}
});
//#endregion
export { ScalarToggleGroup_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarToggleGroup.vue.script.js.map