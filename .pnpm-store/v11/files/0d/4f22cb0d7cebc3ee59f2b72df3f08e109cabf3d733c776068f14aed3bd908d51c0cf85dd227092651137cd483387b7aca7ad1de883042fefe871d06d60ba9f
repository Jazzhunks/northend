import { computed, createCommentVNode, createElementBlock, createTextVNode, createVNode, defineComponent, normalizeClass, openBlock, toDisplayString, unref } from "vue";
import { ScalarIconCheck, ScalarIconXCircle } from "@scalar/icons";
import { ScalarLoading, useLoadingState } from "@scalar/components/loading";
//#region src/components/UploadSection.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "flex items-center gap-1.5"
};
var _hoisted_2 = {
	key: 0,
	class: "uploadText"
};
var _hoisted_3 = {
	key: 1,
	class: "uploadText"
};
var _hoisted_4 = {
	key: 2,
	class: "uploadText"
};
var _hoisted_5 = {
	key: 1,
	class: "uploadText flex items-center gap-1.5"
};
var _hoisted_6 = {
	key: 2,
	class: "uploadText flex items-center gap-1.5"
};
var UploadSection_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "UploadSection",
	props: { uploadState: {} },
	setup(__props) {
		const loadingState = useLoadingState();
		const isLoading = computed(() => [
			"uploading",
			"processing",
			"loading"
		].includes(__props.uploadState.type));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", { class: normalizeClass(["uploadSection", {
				error: __props.uploadState.type === "error",
				done: __props.uploadState.type === "done"
			}]) }, [
				isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_1, [createVNode(unref(ScalarLoading), {
					class: "text-blue",
					loader: {
						...unref(loadingState),
						isLoading: true
					},
					size: "lg"
				}, null, 8, ["loader"]), __props.uploadState.type === "loading" ? (openBlock(), createElementBlock("strong", _hoisted_2, " Loading OpenAPI document… ")) : __props.uploadState.type === "processing" ? (openBlock(), createElementBlock("strong", _hoisted_3, " Processing OpenAPI document… ")) : (openBlock(), createElementBlock("strong", _hoisted_4, " Uploading OpenAPI document… "))])) : createCommentVNode("", true),
				__props.uploadState.type === "done" ? (openBlock(), createElementBlock("strong", _hoisted_5, [createVNode(unref(ScalarIconCheck), { class: "icon text-green" }), _cache[0] || (_cache[0] = createTextVNode(" Your OpenAPI document has been processed successfully. ", -1))])) : createCommentVNode("", true),
				__props.uploadState.type === "error" ? (openBlock(), createElementBlock("strong", _hoisted_6, [createVNode(unref(ScalarIconXCircle), { class: "icon text-red" }), createTextVNode(" " + toDisplayString(__props.uploadState.error), 1)])) : createCommentVNode("", true)
			], 2);
		};
	}
});
//#endregion
export { UploadSection_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=UploadSection.vue.script.js.map