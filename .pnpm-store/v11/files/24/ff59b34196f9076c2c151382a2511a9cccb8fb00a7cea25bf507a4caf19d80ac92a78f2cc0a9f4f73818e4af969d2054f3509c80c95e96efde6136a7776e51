import { createElementBlock, createElementVNode, defineComponent, normalizeClass, openBlock, withModifiers } from "vue";
//#region src/components/ResponseBody/ResponseBodyToggle.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "text-c-3 text-xxs -my-1 flex justify-center gap-0.5 rounded p-0.5" };
var ResponseBodyToggle_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ResponseBodyToggle",
	props: { modelValue: {} },
	emits: ["toggle"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("button", {
				class: normalizeClass(["hover:bg-b-3 rounded px-1", { "bg-b-3 text-c-1 cursor-default": __props.modelValue === "preview" }]),
				type: "button",
				onClick: _cache[0] || (_cache[0] = withModifiers(($event) => emit("toggle", "preview"), ["stop"]))
			}, " Preview ", 2), createElementVNode("button", {
				class: normalizeClass(["hover:bg-b-3 rounded px-1", { "bg-b-3 text-c-1 cursor-default": __props.modelValue === "raw" }]),
				type: "button",
				onClick: _cache[1] || (_cache[1] = withModifiers(($event) => emit("toggle", "raw"), ["stop"]))
			}, " Raw ", 2)]);
		};
	}
});
//#endregion
export { ResponseBodyToggle_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ResponseBodyToggle.vue.script.js.map