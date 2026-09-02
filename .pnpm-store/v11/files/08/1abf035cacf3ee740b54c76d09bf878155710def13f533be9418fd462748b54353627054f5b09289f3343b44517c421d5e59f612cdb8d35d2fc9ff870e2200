import LoadingOpenAPISpecsSummary_default from "../../../components/LoadingOpenAPISpecsSummary.vue.js";
import { createCommentVNode, createElementBlock, createVNode, defineComponent, openBlock, ref, watch } from "vue";
//#region src/views/Chat/Messages/GetOpenAPISpecsSummary.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { key: 0 };
var GetOpenAPISpecsSummary_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "GetOpenAPISpecsSummary",
	props: {
		messagePart: {},
		message: {}
	},
	setup(__props) {
		const messageFinished = ref(false);
		watch(() => __props.message, () => {
			const parts = __props.message.parts;
			const index = parts.findIndex((part) => "toolCallId" in part && part.toolCallId === __props.messagePart.value.toolCallId);
			messageFinished.value = Boolean(parts[index + 1]);
		});
		return (_ctx, _cache) => {
			return !messageFinished.value ? (openBlock(), createElementBlock("div", _hoisted_1, [createVNode(LoadingOpenAPISpecsSummary_default)])) : createCommentVNode("", true);
		};
	}
});
//#endregion
export { GetOpenAPISpecsSummary_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=GetOpenAPISpecsSummary.vue.script.js.map