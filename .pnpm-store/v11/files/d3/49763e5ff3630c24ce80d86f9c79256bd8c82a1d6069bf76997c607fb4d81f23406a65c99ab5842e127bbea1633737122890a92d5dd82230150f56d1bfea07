import { validateParameter } from "../helpers/validate-parameter.js";
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, defineComponent, openBlock, toDisplayString, unref, withCtx } from "vue";
import { ScalarIconInfo, ScalarIconWarning } from "@scalar/icons";
import { ScalarMarkdown } from "@scalar/components/markdown";
import { ScalarPopover } from "@scalar/components/popover";
//#region src/v2/blocks/request-block/components/RequestTableTooltip.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-label", "role"];
var _hoisted_2 = {
	class: "text-xxs text-c-1 grid w-fit max-w-xs min-w-0 gap-1.5 rounded px-1.5 pt-2 pb-1.5 leading-none break-words",
	"data-testid": "request-table-tooltip-content"
};
var _hoisted_3 = {
	key: 0,
	class: "text-error-1"
};
var _hoisted_4 = {
	key: 1,
	class: "schema text-c-2 truncate *:not-first:before:content-['_·_']"
};
var _hoisted_5 = { key: 0 };
var _hoisted_6 = { key: 1 };
var _hoisted_7 = { key: 2 };
var _hoisted_8 = { key: 3 };
var _hoisted_9 = { key: 4 };
var RequestTableTooltip_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "RequestTableTooltip",
	props: {
		schema: {},
		value: {},
		description: {}
	},
	setup(__props) {
		const invalidParameterMessage = computed(() => validateParameter(__props.schema, __props.value));
		const isInvalid = computed(() => invalidParameterMessage.value.ok === false);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarPopover), {
				offset: 4,
				placement: "left",
				teleport: ""
			}, {
				popover: withCtx(() => [createElementVNode("div", _hoisted_2, [invalidParameterMessage.value.ok === false ? (openBlock(), createElementBlock("div", _hoisted_3, toDisplayString(invalidParameterMessage.value.message), 1)) : __props.schema && ("type" in __props.schema || "format" in __props.schema || "minimum" in __props.schema || "maximum" in __props.schema || "default" in __props.schema) ? (openBlock(), createElementBlock("div", _hoisted_4, [
					"type" in __props.schema ? (openBlock(), createElementBlock("span", _hoisted_5, toDisplayString(__props.schema.type), 1)) : createCommentVNode("", true),
					"format" in __props.schema ? (openBlock(), createElementBlock("span", _hoisted_6, toDisplayString(__props.schema.format), 1)) : createCommentVNode("", true),
					"minimum" in __props.schema ? (openBlock(), createElementBlock("span", _hoisted_7, "min: " + toDisplayString(__props.schema.minimum), 1)) : createCommentVNode("", true),
					"maximum" in __props.schema ? (openBlock(), createElementBlock("span", _hoisted_8, "max: " + toDisplayString(__props.schema.maximum), 1)) : createCommentVNode("", true),
					"default" in __props.schema ? (openBlock(), createElementBlock("span", _hoisted_9, "default: " + toDisplayString(__props.schema.default), 1)) : createCommentVNode("", true)
				])) : createCommentVNode("", true), __props.description && !isInvalid.value ? (openBlock(), createBlock(unref(ScalarMarkdown), {
					key: 2,
					value: __props.description
				}, null, 8, ["value"])) : createCommentVNode("", true)])]),
				default: withCtx(() => [createElementVNode("button", {
					"aria-label": isInvalid.value ? "Input is invalid" : "More Information",
					class: "text-c-2 hover:text-c-1 hover:bg-b-2 rounded p-1",
					role: isInvalid.value ? "alert" : "none",
					type: "button"
				}, [isInvalid.value ? (openBlock(), createBlock(unref(ScalarIconWarning), {
					key: 0,
					class: "text-orange size-3.5 brightness-90 hover:brightness-75"
				})) : (openBlock(), createBlock(unref(ScalarIconInfo), {
					key: 1,
					class: "text-c-2 hover:text-c-1 size-3.5"
				}))], 8, _hoisted_1)]),
				_: 1
			});
		};
	}
});
//#endregion
export { RequestTableTooltip_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=RequestTableTooltip.vue.script.js.map