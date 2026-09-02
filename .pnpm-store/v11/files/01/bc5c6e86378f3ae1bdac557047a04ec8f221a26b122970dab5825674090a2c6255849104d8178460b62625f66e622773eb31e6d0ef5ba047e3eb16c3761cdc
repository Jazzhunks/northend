import { resolveResponseBodyHandler } from "../helpers/resolve-response-body-handler.js";
import { getMediaTypeConfig } from "../helpers/media-types.js";
import CollapsibleSection_default from "../../../components/layout/CollapsibleSection.vue.js";
import { processResponseBody } from "../helpers/process-response-body.js";
import ResponseBodyDownload_default from "./ResponseBodyDownload.vue.js";
import ResponseBodyInfo_default from "./ResponseBodyInfo.vue.js";
import ResponseBodyRaw_default from "./ResponseBodyRaw.vue.js";
import ResponseBodyPreview_default from "./ResponseBodyPreview.vue.js";
import ResponseBodyToggle_default from "./ResponseBodyToggle.vue.js";
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, openBlock, ref, resolveDynamicComponent, toDisplayString, unref, withCtx } from "vue";
//#region src/v2/blocks/response-block/components/ResponseBody.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "bg-b-1 flex max-h-[calc(100%-32px)] flex-col overflow-hidden"
};
var _hoisted_2 = { class: "box-content flex min-h-8 items-center justify-between border-y px-3" };
var _hoisted_3 = { class: "text-xxs font-code leading-5" };
var ResponseBody_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ResponseBody",
	props: {
		title: {},
		layout: {},
		data: {},
		headers: {},
		plugins: { default: () => [] }
	},
	setup(__props) {
		/** Preview / Raw toggle */
		const toggle = ref(true);
		const responseBody = computed(() => processResponseBody({
			data: __props.data,
			headers: __props.headers
		}));
		const mimeEssence = computed(() => responseBody.value.mimeType.essence);
		const mediaConfig = computed(() => getMediaTypeConfig(mimeEssence.value));
		const pluginHandler = computed(() => resolveResponseBodyHandler(mimeEssence.value, __props.plugins));
		const hasRaw = computed(() => !!pluginHandler.value?.rawComponent || !!pluginHandler.value?.decode || !!mediaConfig.value?.raw);
		const hasPreview = computed(() => !!pluginHandler.value?.previewComponent || !!mediaConfig.value?.preview);
		const showToggle = computed(() => hasRaw.value && hasPreview.value);
		const showPreview = computed(() => toggle.value || !showToggle.value);
		const showRaw = computed(() => !toggle.value || !showToggle.value);
		const rawLanguage = computed(() => pluginHandler.value?.language ?? mediaConfig.value?.language);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(CollapsibleSection_default), {
				class: "max-h-content overflow-y-hidden",
				isStatic: __props.layout === "reference"
			}, createSlots({
				title: withCtx(() => [createTextVNode(toDisplayString(__props.title), 1)]),
				default: withCtx(() => [__props.data ? (openBlock(), createElementBlock("div", _hoisted_1, [
					createElementVNode("div", _hoisted_2, [createElementVNode("span", _hoisted_3, toDisplayString(mimeEssence.value), 1), showToggle.value ? (openBlock(), createBlock(ResponseBodyToggle_default, {
						key: 0,
						modelValue: toggle.value,
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => toggle.value = $event)
					}, null, 8, ["modelValue"])) : createCommentVNode("", true)]),
					pluginHandler.value?.previewComponent && hasPreview.value && showPreview.value ? (openBlock(), createBlock(resolveDynamicComponent(pluginHandler.value.previewComponent), {
						key: `plugin-preview-${responseBody.value.dataUrl}`,
						content: __props.data,
						contentType: mimeEssence.value,
						dataUrl: responseBody.value.dataUrl
					}, null, 8, [
						"content",
						"contentType",
						"dataUrl"
					])) : mediaConfig.value?.preview && showPreview.value ? (openBlock(), createBlock(ResponseBodyPreview_default, {
						key: `preview-${responseBody.value.dataUrl}`,
						alpha: mediaConfig.value.alpha,
						content: __props.data,
						mode: mediaConfig.value.preview,
						src: responseBody.value.dataUrl,
						type: mimeEssence.value
					}, null, 8, [
						"alpha",
						"content",
						"mode",
						"src",
						"type"
					])) : createCommentVNode("", true),
					pluginHandler.value?.rawComponent && hasRaw.value && showRaw.value ? (openBlock(), createBlock(resolveDynamicComponent(pluginHandler.value.rawComponent), {
						key: `plugin-raw-${responseBody.value.dataUrl}`,
						content: __props.data,
						contentType: mimeEssence.value
					}, null, 8, ["content", "contentType"])) : hasRaw.value && showRaw.value && !pluginHandler.value?.rawComponent ? (openBlock(), createBlock(ResponseBodyRaw_default, {
						key: `raw-${responseBody.value.dataUrl}`,
						content: __props.data,
						language: rawLanguage.value
					}, null, 8, ["content", "language"])) : createCommentVNode("", true),
					!hasRaw.value && !hasPreview.value ? (openBlock(), createBlock(ResponseBodyInfo_default, { key: 4 }, {
						default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode(" Binary file ", -1)])]),
						_: 1
					})) : createCommentVNode("", true)
				])) : createCommentVNode("", true)]),
				_: 2
			}, [__props.data && responseBody.value.dataUrl ? {
				name: "actions",
				fn: withCtx(() => [createVNode(ResponseBodyDownload_default, {
					filename: responseBody.value.attachmentFilename,
					href: responseBody.value.dataUrl,
					type: responseBody.value.mimeType?.essence
				}, null, 8, [
					"filename",
					"href",
					"type"
				])]),
				key: "0"
			} : void 0]), 1032, ["isStatic"]);
		};
	}
});
//#endregion
export { ResponseBody_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ResponseBody.vue.script.js.map