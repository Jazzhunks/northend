import { computed, createElementBlock, defineComponent, mergeProps, openBlock, vModelText, withDirectives } from "vue";
//#region src/components/Server/ServerVariablesTextbox.vue?vue&type=script&setup=true&lang.ts
var ServerVariablesTextbox_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ServerVariablesTextbox",
	props: {
		value: {},
		controls: {}
	},
	emits: ["change"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const model = computed({
			get: () => props.value,
			set: (v) => emit("change", v)
		});
		return (_ctx, _cache) => {
			return withDirectives((openBlock(), createElementBlock("input", mergeProps({ "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event) }, __props.controls ? {
				..._ctx.$attrs,
				"aria-controls": __props.controls
			} : {}, {
				autocomplete: "off",
				class: "text-c-1 w-full border-transparent px-1.5 py-1.25 -outline-offset-1 group-last/label:rounded-br-lg",
				placeholder: "value",
				spellcheck: "false",
				type: "text"
			}), null, 16)), [[vModelText, model.value]]);
		};
	}
});
//#endregion
export { ServerVariablesTextbox_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ServerVariablesTextbox.vue.script.js.map