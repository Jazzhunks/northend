import ScalarIconLegacyAdapter_default from "../ScalarIcon/ScalarIconLegacyAdapter.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createCommentVNode, createElementBlock, createElementVNode, defineComponent, mergeProps, openBlock, renderSlot, unref } from "vue";
//#region src/components/ScalarSearchResults/ScalarSearchResultItem.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-selected"];
var _hoisted_2 = {
	key: 0,
	class: "flex h-fit items-center text-sm font-medium text-c-3 group-hover:text-c-1"
};
var _hoisted_3 = { class: "flex min-w-0 flex-1 flex-col gap-0.5" };
var _hoisted_4 = { class: "flex items-center gap-1" };
var _hoisted_5 = { class: "flex-1 truncate zoomed:whitespace-normal! wrap-break-word font-medium" };
var _hoisted_6 = {
	key: 0,
	class: "text-base text-c-2"
};
var _hoisted_7 = {
	key: 0,
	class: "truncate zoomed:whitespace-normal! wrap-break-word text-c-2"
};
var ScalarSearchResultItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarSearchResultItem",
	props: {
		icon: { type: [Object, Function] },
		selected: { type: Boolean }
	},
	setup(__props) {
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("a", mergeProps({
				"aria-selected": __props.selected,
				role: "option",
				tabindex: "-1"
			}, unref(cx)("group flex cursor-pointer gap-2 rounded px-2 py-1.5 no-underline hover:bg-b-2 text-base/5", { "bg-b-2": __props.selected })), [__props.icon ? (openBlock(), createElementBlock("div", _hoisted_2, [renderSlot(_ctx.$slots, "icon", {}, () => [__props.icon ? (openBlock(), createBlock(unref(ScalarIconLegacyAdapter_default), {
				key: 0,
				class: "size-4",
				icon: __props.icon
			}, null, 8, ["icon"])) : createCommentVNode("", true)]), _cache[0] || (_cache[0] = createElementVNode("span", null, " ", -1))])) : createCommentVNode("", true), createElementVNode("div", _hoisted_3, [createElementVNode("div", _hoisted_4, [createElementVNode("div", _hoisted_5, [renderSlot(_ctx.$slots, "default")]), _ctx.$slots.addon ? (openBlock(), createElementBlock("div", _hoisted_6, [renderSlot(_ctx.$slots, "addon")])) : createCommentVNode("", true)]), _ctx.$slots.description ? (openBlock(), createElementBlock("div", _hoisted_7, [renderSlot(_ctx.$slots, "description")])) : createCommentVNode("", true)])], 16, _hoisted_1);
		};
	}
});
//#endregion
export { ScalarSearchResultItem_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarSearchResultItem.vue.script.js.map