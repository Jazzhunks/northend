import ScalarFormInputGroup_default from "../ScalarForm/ScalarFormInputGroup.vue.js";
import ScalarCheckboxInput_default from "./ScalarCheckboxInput.vue.js";
import { Fragment, createBlock, createElementBlock, createTextVNode, defineComponent, mergeModels, openBlock, renderList, toDisplayString, unref, useId, useModel, withCtx } from "vue";
var ScalarCheckboxGroup_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarCheckboxGroup",
	props: /* @__PURE__ */ mergeModels({ options: { default: () => [] } }, {
		"modelValue": { default: [] },
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props) {
		const model = useModel(__props, "modelValue");
		const name = useId();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarFormInputGroup_default), null, {
				default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (option) => {
					return openBlock(), createBlock(ScalarCheckboxInput_default, {
						key: option.value,
						modelValue: model.value?.some(({ value }) => value === option.value),
						name: unref(name),
						value: option.value,
						"onUpdate:modelValue": (checked) => model.value = checked ? [...model.value, option] : model.value.filter(({ value }) => value !== option.value)
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(option.label), 1)]),
						_: 2
					}, 1032, [
						"modelValue",
						"name",
						"value",
						"onUpdate:modelValue"
					]);
				}), 128))]),
				_: 1
			});
		};
	}
});
//#endregion
export { ScalarCheckboxGroup_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarCheckboxGroup.vue.script.js.map