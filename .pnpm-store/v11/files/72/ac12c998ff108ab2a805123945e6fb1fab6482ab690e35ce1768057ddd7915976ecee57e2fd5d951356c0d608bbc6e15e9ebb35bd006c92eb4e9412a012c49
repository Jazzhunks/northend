import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, normalizeClass, openBlock, toDisplayString, unref, withCtx } from "vue";
import { ScalarButton } from "@scalar/components/button";
import { ScalarListbox } from "@scalar/components/listbox";
import { ScalarIconCaretDown } from "@scalar/icons";
//#region src/components/Server/ServerVariablesSelect.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "sr-only"
};
var ServerVariablesSelect_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ServerVariablesSelect",
	props: {
		enum: {},
		value: {},
		controls: {}
	},
	emits: ["change"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const options = computed(() => props.enum.map((s) => ({
			id: s,
			label: s
		})));
		const selected = computed({
			get: () => options.value.find((opt) => opt.id === props.value),
			set: (opt) => emit("change", opt?.id ?? "")
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarListbox), {
				modelValue: selected.value,
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => selected.value = $event),
				options: options.value
			}, {
				default: withCtx(() => [createVNode(unref(ScalarButton), {
					"aria-controls": __props.controls,
					class: "group/button h-8 gap-1.5 p-1.5 text-base font-normal",
					variant: "ghost"
				}, {
					default: withCtx(() => [createElementVNode("span", { class: normalizeClass({ "text-c-1": __props.value }) }, [__props.value ? (openBlock(), createElementBlock("span", _hoisted_1, " Selected: ")) : createCommentVNode("", true), createTextVNode(" " + toDisplayString(__props.value || "Select value"), 1)], 2), createVNode(unref(ScalarIconCaretDown), {
						weight: "bold",
						class: "mt-0.25 size-3 transition-transform duration-100 group-aria-expanded/button:rotate-180"
					})]),
					_: 1
				}, 8, ["aria-controls"])]),
				_: 1
			}, 8, ["modelValue", "options"]);
		};
	}
});
//#endregion
export { ServerVariablesSelect_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ServerVariablesSelect.vue.script.js.map