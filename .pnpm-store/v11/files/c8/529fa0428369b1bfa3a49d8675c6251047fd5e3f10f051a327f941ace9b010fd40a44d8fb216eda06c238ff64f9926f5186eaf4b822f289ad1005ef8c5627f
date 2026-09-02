import { useCardHeading } from "./useCardHeading.js";
import ScalarCardSection_default from "./ScalarCardSection.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createCommentVNode, createElementBlock, createElementVNode, defineComponent, guardReactiveProps, normalizeProps, openBlock, renderSlot, unref, useId, withCtx } from "vue";
//#region src/components/ScalarCard/ScalarCardHeader.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["id"];
var _hoisted_2 = {
	key: 0,
	class: "flex"
};
var ScalarCardHeader_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarCardHeader",
	setup(__props) {
		const { cx } = useBindCx();
		const id = useId();
		useCardHeading(id);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(ScalarCardSection_default, normalizeProps(guardReactiveProps(unref(cx)("scalar-card-header leading-[22px] font-medium py-[6.75px] px-3 shrink-0"))), {
				default: withCtx(() => [createElementVNode("div", {
					id: unref(id),
					class: "scalar-card-header-title min-w-0 flex-1 truncate"
				}, [renderSlot(_ctx.$slots, "default")], 8, _hoisted_1), _ctx.$slots.actions ? (openBlock(), createElementBlock("div", _hoisted_2, [renderSlot(_ctx.$slots, "actions")])) : createCommentVNode("", true)]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
export { ScalarCardHeader_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarCardHeader.vue.script.js.map