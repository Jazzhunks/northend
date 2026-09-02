import "../../entities/tools/ask-for-authentication.js";
import "../../entities/tools/execute-request.js";
import "../../entities/tools/get-openapi-specs-summary.js";
import "../../entities/tools/search-openapi-operations.js";
import { useState } from "../../state/state.js";
import AskForAuthentication_default from "./Messages/AskForAuthentication.vue.js";
import ExecuteRequestTool_default from "./Messages/ExecuteRequestTool.vue.js";
import GetOpenAPISpecsSummary_default from "./Messages/GetOpenAPISpecsSummary.vue.js";
import SearchOpenAPIOperationsTool_default from "./Messages/SearchOpenAPIOperationsTool.vue.js";
import Text_default from "./Messages/Text.vue.js";
import PromptForm_default from "../PromptForm.vue.js";
import { Fragment, createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, openBlock, reactive, renderList, toDisplayString, toRef, unref } from "vue";
//#region src/views/Chat/Chat.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "chat" };
var _hoisted_2 = { key: 0 };
var _hoisted_3 = { class: "formContainer" };
var Chat_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Chat",
	emits: ["submit", "uploadApi"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const state = useState();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createElementVNode("div", _hoisted_1, [(openBlock(true), createElementBlock(Fragment, null, renderList(unref(state).chat.messages, (message) => {
				return openBlock(), createElementBlock(Fragment, { key: message.id }, [message.role === "user" ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(message.parts, (part, index) => {
					return openBlock(), createElementBlock("div", {
						key: `${message.id}-${index}`,
						class: "userMessage"
					}, [part.type === "text" ? (openBlock(), createElementBlock("p", _hoisted_2, toDisplayString(part.text), 1)) : createCommentVNode("", true)]);
				}), 128)) : createCommentVNode("", true), message.role === "assistant" ? (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(message.parts, (part, index) => {
					return openBlock(), createElementBlock("div", { key: `${message.id}-${index}` }, [
						part.type === "text" ? (openBlock(), createBlock(Text_default, {
							key: 0,
							messagePart: toRef(part)
						}, null, 8, ["messagePart"])) : createCommentVNode("", true),
						part.type === `tool-${unref("execute-request")}` ? (openBlock(), createBlock(ExecuteRequestTool_default, {
							key: 1,
							messagePart: toRef(part)
						}, null, 8, ["messagePart"])) : createCommentVNode("", true),
						part.type === `tool-${unref("search-openapi-operations")}` ? (openBlock(), createBlock(SearchOpenAPIOperationsTool_default, {
							key: 2,
							message: reactive(message),
							messagePart: toRef(part)
						}, null, 8, ["message", "messagePart"])) : createCommentVNode("", true),
						part.type === `tool-${unref("summarize-openapi-specs")}` ? (openBlock(), createBlock(GetOpenAPISpecsSummary_default, {
							key: 3,
							message: reactive(message),
							messagePart: toRef(part)
						}, null, 8, ["message", "messagePart"])) : createCommentVNode("", true),
						part.type === `tool-${unref("ask-for-authentication")}` ? (openBlock(), createBlock(AskForAuthentication_default, {
							key: 4,
							message: reactive(message),
							messagePart: toRef(part)
						}, null, 8, ["message", "messagePart"])) : createCommentVNode("", true)
					]);
				}), 128)) : createCommentVNode("", true)], 64);
			}), 128)), _cache[2] || (_cache[2] = createElementVNode("div", { class: "spacer" }, null, -1))]), createElementVNode("div", _hoisted_3, [createVNode(PromptForm_default, {
				onSubmit: _cache[0] || (_cache[0] = ($event) => emit("submit")),
				onUploadApi: _cache[1] || (_cache[1] = ($event) => emit("uploadApi"))
			})])], 64);
		};
	}
});
//#endregion
export { Chat_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=Chat.vue.script.js.map