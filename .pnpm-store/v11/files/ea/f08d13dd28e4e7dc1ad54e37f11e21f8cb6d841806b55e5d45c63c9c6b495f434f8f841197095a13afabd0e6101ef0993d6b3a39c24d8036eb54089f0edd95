import ResponseBodyInfo_default from "./ResponseBodyInfo.vue.js";
import ResponseBodyPreview_default from "./ResponseBodyPreview.vue.js";
import ResponseBodyRaw_default from "./ResponseBodyRaw.vue.js";
import { Fragment, createBlock, createCommentVNode, createElementBlock, createTextVNode, defineComponent, openBlock, watch, withCtx } from "vue";
//#region src/components/ResponseBody/ResponseBody.vue?vue&type=script&setup=true&lang.ts
var ResponseBody_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ResponseBody",
	props: {
		data: {},
		responseBody: {},
		mediaConfig: {},
		display: {}
	},
	setup(__props) {
		watch(() => __props.display, (v) => console.log(v));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [
				__props.mediaConfig?.raw && __props.display === "raw" && __props.mediaConfig.language ? (openBlock(), createBlock(ResponseBodyRaw_default, {
					key: __props.responseBody.dataUrl,
					content: __props.data,
					language: __props.mediaConfig.language
				}, null, 8, ["content", "language"])) : createCommentVNode("", true),
				__props.mediaConfig?.preview && __props.display === "preview" ? (openBlock(), createBlock(ResponseBodyPreview_default, {
					key: __props.responseBody.dataUrl,
					alpha: __props.mediaConfig.alpha,
					mode: __props.mediaConfig.preview,
					src: __props.responseBody.dataUrl,
					type: __props.responseBody.mimeType?.essence ?? ""
				}, null, 8, [
					"alpha",
					"mode",
					"src",
					"type"
				])) : createCommentVNode("", true),
				!__props.mediaConfig?.raw && !__props.mediaConfig?.preview ? (openBlock(), createBlock(ResponseBodyInfo_default, { key: 2 }, {
					default: withCtx(() => [..._cache[0] || (_cache[0] = [createTextVNode(" Binary file ", -1)])]),
					_: 1
				})) : createCommentVNode("", true)
			], 64);
		};
	}
});
//#endregion
export { ResponseBody_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ResponseBody.vue.script.js.map