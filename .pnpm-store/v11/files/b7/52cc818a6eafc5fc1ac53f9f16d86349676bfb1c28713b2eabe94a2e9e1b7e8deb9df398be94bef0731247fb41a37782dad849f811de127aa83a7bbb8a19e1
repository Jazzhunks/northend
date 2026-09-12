import { getMediaTypeConfig } from "../helpers/media-types.js";
import { computed, createElementBlock, createElementVNode, createVNode, defineComponent, openBlock, unref, withModifiers } from "vue";
import { ScalarIcon } from "@scalar/components/icon";
//#region src/v2/blocks/response-block/components/ResponseBodyDownload.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["download", "href"];
var ResponseBodyDownload_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ResponseBodyDownload",
	props: {
		href: {},
		type: {},
		filename: {}
	},
	setup(__props) {
		const props = __props;
		const filenameExtension = computed(() => {
			const extension = getMediaTypeConfig(props.type ?? "")?.extension ?? ".unknown";
			return props.filename ? props.filename : `response${extension}`;
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("a", {
				class: "text-c-3 text-xxs hover:bg-b-3 flex items-center gap-1 rounded px-1.5 py-0.5 no-underline",
				download: `${filenameExtension.value}`,
				href: __props.href,
				onClick: _cache[0] || (_cache[0] = withModifiers(() => {}, ["stop"]))
			}, [createVNode(unref(ScalarIcon), {
				icon: "Download",
				size: "xs"
			}), _cache[1] || (_cache[1] = createElementVNode("span", null, [createElementVNode("span", null, "Download"), createElementVNode("span", { class: "sr-only" }, "Response Body")], -1))], 8, _hoisted_1);
		};
	}
});
//#endregion
export { ResponseBodyDownload_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ResponseBodyDownload.vue.script.js.map