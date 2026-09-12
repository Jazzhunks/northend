import ScalarButton_default from "../ScalarButton/ScalarButton.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, guardReactiveProps, normalizeProps, openBlock, renderSlot, toDisplayString, unref, withCtx } from "vue";
//#region src/components/ScalarFileUpload/ScalarFileUploadInput.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex items-center gap-1.5 whitespace-nowrap" };
var _hoisted_2 = { class: "text-c-2" };
var _hoisted_3 = {
	key: 0,
	class: "text-c-3 text-xs"
};
var ScalarFileUploadInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarFileUploadInput",
	props: {
		multiple: { type: Boolean },
		extensions: {}
	},
	emits: ["click"],
	setup(__props) {
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", normalizeProps(guardReactiveProps(unref(cx)("flex items-center justify-center gap-2 flex-col px-6 py-4"))), [createElementVNode("div", _hoisted_1, [createElementVNode("span", _hoisted_2, [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode("Drop " + toDisplayString(__props.multiple ? "files" : "file") + " here to upload", 1)]), _cache[1] || (_cache[1] = createElementVNode("span", { class: "text-c-3" }, " or", -1))]), createVNode(unref(ScalarButton_default), {
				size: "xs",
				tabindex: "-1",
				variant: "outlined",
				onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
			}, {
				default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode(" Browse files ", -1)])]),
				_: 1
			})]), renderSlot(_ctx.$slots, "sublabel", {}, () => [__props.extensions ? (openBlock(), createElementBlock("div", _hoisted_3, [_cache[3] || (_cache[3] = createElementVNode("span", { class: "font-medium" }, "Supported file types:", -1)), createTextVNode(" " + toDisplayString(__props.extensions.join(", ")), 1)])) : createCommentVNode("", true)])], 16);
		};
	}
});
//#endregion
export { ScalarFileUploadInput_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarFileUploadInput.vue.script.js.map