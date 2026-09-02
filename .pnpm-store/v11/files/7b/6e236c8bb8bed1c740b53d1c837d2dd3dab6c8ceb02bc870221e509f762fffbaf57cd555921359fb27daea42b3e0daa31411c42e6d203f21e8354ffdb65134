import { getOperations } from "../../../helpers.js";
import { useState } from "../../../state/state.js";
import ContextItem_default from "../../../components/ContextItem.vue.js";
import LoadingSearchOpenAPIOperations_default from "../../../components/LoadingSearchOpenAPIOperations.vue.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, openBlock, ref, renderList, toDisplayString, unref, watch, withCtx } from "vue";
import { ScalarPopover } from "@scalar/components/popover";
//#region src/views/Chat/Messages/SearchOpenAPIOperationsTool.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { key: 0 };
var _hoisted_2 = {
	key: 1,
	class: "operations"
};
var _hoisted_3 = { class: "overflowPopover" };
var MAX_VISIBLE = 5;
var SearchOpenAPIOperationsTool_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "SearchOpenAPIOperationsTool",
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
		const operations = computed(() => {
			if (!__props.messagePart.value.output) return;
			return __props.messagePart.value.output.flatMap((spec) => {
				const title = spec.info?.title;
				return getOperations(spec).map((operation) => `${title ? `${title} - ` : ""}${operation.summary ?? ""}`).filter(Boolean);
			});
		});
		const visibleOperations = computed(() => operations.value?.slice(0, MAX_VISIBLE));
		const hiddenOperations = computed(() => operations.value?.slice(MAX_VISIBLE) ?? []);
		const state = useState();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [__props.messagePart.value.state === "input-available" && unref(state).chat.status === "streaming" ? (openBlock(), createElementBlock("div", _hoisted_1, [createVNode(LoadingSearchOpenAPIOperations_default)])) : createCommentVNode("", true), operations.value ? (openBlock(), createElementBlock("div", _hoisted_2, [(openBlock(true), createElementBlock(Fragment, null, renderList(visibleOperations.value, (operation) => {
				return openBlock(), createBlock(ContextItem_default, {
					key: operation,
					loading: !messageFinished.value
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(operation), 1)]),
					_: 2
				}, 1032, ["loading"]);
			}), 128)), hiddenOperations.value.length ? (openBlock(), createBlock(unref(ScalarPopover), {
				key: 0,
				placement: "bottom-start"
			}, {
				popover: withCtx(() => [createElementVNode("div", _hoisted_3, [(openBlock(true), createElementBlock(Fragment, null, renderList(hiddenOperations.value, (operation) => {
					return openBlock(), createBlock(ContextItem_default, {
						key: operation,
						loading: !messageFinished.value
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(operation), 1)]),
						_: 2
					}, 1032, ["loading"]);
				}), 128))])]),
				default: withCtx(() => [createVNode(ContextItem_default, { loading: !messageFinished.value }, {
					default: withCtx(() => [createTextVNode(" +" + toDisplayString(hiddenOperations.value.length), 1)]),
					_: 1
				}, 8, ["loading"])]),
				_: 1
			})) : createCommentVNode("", true)])) : createCommentVNode("", true)], 64);
		};
	}
});
//#endregion
export { SearchOpenAPIOperationsTool_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=SearchOpenAPIOperationsTool.vue.script.js.map