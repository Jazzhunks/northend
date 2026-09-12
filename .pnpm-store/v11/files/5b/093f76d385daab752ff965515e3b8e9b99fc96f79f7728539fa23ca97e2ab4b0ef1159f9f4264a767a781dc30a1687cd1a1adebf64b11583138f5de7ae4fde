import { AgentErrorCodes } from "../entities/error/constants.js";
import { createCommentVNode, createElementBlock, createTextVNode, createVNode, defineComponent, openBlock, toDisplayString, unref } from "vue";
import { ScalarIconInfo } from "@scalar/icons";
//#region src/components/ErrorMessage.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "error gap-1.5"
};
var ErrorMessage_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ErrorMessage",
	props: { error: {} },
	setup(__props) {
		const HIDDEN_ERROR_CODES = [AgentErrorCodes.LIMIT_REACHED];
		return (_ctx, _cache) => {
			return !HIDDEN_ERROR_CODES.includes(__props.error.code) ? (openBlock(), createElementBlock("div", _hoisted_1, [createVNode(unref(ScalarIconInfo), {
				class: "text-red size-4",
				weight: "bold"
			}), createTextVNode(" " + toDisplayString(__props.error.message), 1)])) : createCommentVNode("", true);
		};
	}
});
//#endregion
export { ErrorMessage_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ErrorMessage.vue.script.js.map