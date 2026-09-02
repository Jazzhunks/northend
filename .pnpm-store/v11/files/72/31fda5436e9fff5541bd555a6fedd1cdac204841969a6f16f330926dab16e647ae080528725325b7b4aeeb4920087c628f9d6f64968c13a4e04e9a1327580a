import CollapsibleSection_default from "../../../components/layout/CollapsibleSection.vue.js";
import { processResponseBody } from "../helpers/process-response-body.js";
import ResponseBodyDownload_default from "./ResponseBodyDownload.vue.js";
import { computed, createBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, openBlock, unref, withCtx } from "vue";
import { formatJsonOrYamlString } from "@scalar/oas-utils/helpers";
import { ScalarVirtualText } from "@scalar/components/virtual-text";
//#region src/v2/blocks/response-block/components/ResponseBodyVirtual.vue?vue&type=script&setup=true&lang.ts
var ResponseBodyVirtual_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ResponseBodyVirtual",
	props: {
		content: {},
		data: {},
		headers: {}
	},
	setup(__props) {
		const textContent = computed(() => formatJsonOrYamlString(__props.content));
		const responseBody = computed(() => processResponseBody({
			data: __props.data,
			headers: __props.headers
		}));
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(CollapsibleSection_default), { class: "!max-h-100% response-body-virtual overflow-x-auto" }, createSlots({
				title: withCtx(() => [_cache[0] || (_cache[0] = createTextVNode("Body", -1))]),
				default: withCtx(() => [_cache[1] || (_cache[1] = createElementVNode("div", { class: "font-code text-xxs rounded-t border-x border-t px-2.5 py-1.5" }, " This response body is massive! Syntax highlighting won't work here. ", -1)), createVNode(unref(ScalarVirtualText), {
					containerClass: "custom-scroll scalar-code-block border rounded-b flex flex-1 max-h-screen",
					contentClass: "language-plaintext whitespace-pre font-code text-base",
					lineHeight: 20,
					searchable: "",
					text: textContent.value
				}, null, 8, ["text"])]),
				_: 2
			}, [responseBody.value.dataUrl ? {
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
			} : void 0]), 1024);
		};
	}
});
//#endregion
export { ResponseBodyVirtual_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ResponseBodyVirtual.vue.script.js.map