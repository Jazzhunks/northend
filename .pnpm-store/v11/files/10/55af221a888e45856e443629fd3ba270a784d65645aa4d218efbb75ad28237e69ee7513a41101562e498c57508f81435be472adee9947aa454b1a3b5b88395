import { createCommentVNode, createElementBlock, createElementVNode, defineComponent, onErrorCaptured, openBlock, ref, renderSlot, toDisplayString } from "vue";
//#region src/components/ScalarErrorBoundary/ScalarErrorBoundary.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 1,
	class: "rounded border bg-b-2 p-3 text-sm"
};
var _hoisted_2 = {
	key: 0,
	class: "mt-2 rounded border bg-b-1 p-2 font-code text-c-2"
};
var ScalarErrorBoundary_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarErrorBoundary",
	setup(__props) {
		const hasError = ref(false);
		const error = ref();
		onErrorCaptured((err, _, info) => {
			console.error("[ERROR]", err, info);
			hasError.value = true;
			error.value = err;
			return false;
		});
		return (_ctx, _cache) => {
			return !hasError.value ? renderSlot(_ctx.$slots, "default", { key: 0 }) : (openBlock(), createElementBlock("div", _hoisted_1, [_cache[0] || (_cache[0] = createElementVNode("div", { class: "p-2" }, "Oops, something went wrong here.", -1)), error.value ? (openBlock(), createElementBlock("div", _hoisted_2, toDisplayString(error.value?.name) + ": " + toDisplayString(error.value?.message), 1)) : createCommentVNode("", true)]));
		};
	}
});
//#endregion
export { ScalarErrorBoundary_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarErrorBoundary.vue.script.js.map