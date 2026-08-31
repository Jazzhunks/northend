import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, mergeProps, openBlock, renderSlot, toDisplayString, unref } from "vue";
import { ScalarIconUploadSimple } from "@scalar/icons";
//#region src/components/ScalarFileUpload/ScalarFileUploadInputCompact.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex items-center gap-1 whitespace-nowrap text-c-2" };
var _hoisted_2 = {
	key: 0,
	class: "text-c-3 text-xs"
};
var ScalarFileUploadInputCompact_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarFileUploadInputCompact",
	props: {
		multiple: { type: Boolean },
		extensions: {}
	},
	emits: ["click"],
	setup(__props) {
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("button", mergeProps({ type: "button" }, unref(cx)("flex items-center justify-center gap-1 rounded flex-col px-4 py-3 hover:bg-b-2"), { onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event)) }), [createElementVNode("div", _hoisted_1, [renderSlot(_ctx.$slots, "default", {}, () => [createVNode(unref(ScalarIconUploadSimple), { class: "size-3.5" }), createElementVNode("span", null, " Upload " + toDisplayString(__props.multiple ? "files" : "file"), 1)])]), renderSlot(_ctx.$slots, "sublabel", {}, () => [__props.extensions ? (openBlock(), createElementBlock("div", _hoisted_2, toDisplayString(__props.extensions.join(", ")), 1)) : createCommentVNode("", true)])], 16);
		};
	}
});
//#endregion
export { ScalarFileUploadInputCompact_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarFileUploadInputCompact.vue.script.js.map