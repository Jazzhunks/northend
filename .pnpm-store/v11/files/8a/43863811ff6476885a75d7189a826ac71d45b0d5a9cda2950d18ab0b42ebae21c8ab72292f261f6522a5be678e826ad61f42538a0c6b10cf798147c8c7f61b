import { useState } from "../../../state/state.js";
import RequestPreview_default from "../../../components/RequestPreview.vue.js";
import { requestPartRequiresApproval } from "../../../hooks/use-chat-approvals.js";
import { computed, createBlock, createCommentVNode, createElementBlock, defineComponent, openBlock } from "vue";
//#region src/views/Chat/Messages/ExecuteRequestTool.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "executeRequestTool" };
var ExecuteRequestTool_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ExecuteRequestTool",
	props: { messagePart: {} },
	setup(__props) {
		const state = useState();
		const requestState = computed(() => {
			if (__props.messagePart.value.state === "input-streaming") return "buildingRequest";
			if (__props.messagePart.value.state === "approval-responded" && state.chat.status === "submitted") return "sendingRequest";
			if (requestPartRequiresApproval(__props.messagePart.value)) return "requiresApproval";
			if (__props.messagePart.value.state === "output-available") return __props.messagePart.value.output.success ? "requestSucceeded" : "requestFailed";
			if (__props.messagePart.value.state === "output-error") return "rejected";
			return null;
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [requestState.value ? (openBlock(), createBlock(RequestPreview_default, {
				key: 0,
				request: __props.messagePart.value.input,
				response: __props.messagePart.value.output,
				state: requestState.value
			}, null, 8, [
				"request",
				"response",
				"state"
			])) : createCommentVNode("", true)]);
		};
	}
});
//#endregion
export { ExecuteRequestTool_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ExecuteRequestTool.vue.script.js.map