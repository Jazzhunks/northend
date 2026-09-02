import ScalarHeaderButton_default from "../ScalarHeader/ScalarHeaderButton.vue.js";
import ScalarIcon_default from "../ScalarIcon/ScalarIcon.vue.js";
import { createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, normalizeClass, openBlock, renderSlot, toDisplayString, unref, withCtx } from "vue";
import { ScalarIconCaretDown } from "@scalar/icons";
//#region src/components/ScalarMenu/ScalarMenuButton.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "h-5 w-auto" };
var _hoisted_2 = {
	key: 0,
	class: "ml-1 truncate text-sm font-medium"
};
var _hoisted_3 = { class: "sr-only" };
var ScalarMenuButton_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarMenuButton",
	props: { open: { type: Boolean } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarHeaderButton_default), { class: "gap-0.75 px-2 py-1.5 text-c-header-1 hover:bg-b-header-2" }, {
				default: withCtx(() => [
					createElementVNode("div", _hoisted_1, [renderSlot(_ctx.$slots, "logo", {}, () => [createVNode(unref(ScalarIcon_default), { icon: "Logo" })])]),
					_ctx.$slots.title ? (openBlock(), createElementBlock("span", _hoisted_2, [renderSlot(_ctx.$slots, "title")])) : createCommentVNode("", true),
					createElementVNode("span", _hoisted_3, [renderSlot(_ctx.$slots, "label", {}, () => [createTextVNode(toDisplayString(__props.open ? "Close Menu" : "Open Menu"), 1)])]),
					createVNode(unref(ScalarIconCaretDown), {
						class: normalizeClass(["shrink-0 text-c-header-2 group-hover/button:text-c-header-1 size-3.5", __props.open ? "rotate-180" : ""]),
						weight: "bold"
					}, null, 8, ["class"])
				]),
				_: 3
			});
		};
	}
});
//#endregion
export { ScalarMenuButton_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarMenuButton.vue.script.js.map