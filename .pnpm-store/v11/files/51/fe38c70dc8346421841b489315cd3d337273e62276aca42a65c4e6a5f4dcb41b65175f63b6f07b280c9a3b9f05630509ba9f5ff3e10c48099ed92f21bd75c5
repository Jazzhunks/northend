import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createCommentVNode, createElementBlock, createElementVNode, defineComponent, mergeProps, openBlock, renderSlot, unref } from "vue";
var ScalarSearchResultList_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarSearchResultList",
	props: { noResults: { type: Boolean } },
	setup(__props) {
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", mergeProps({ role: "listbox" }, unref(cx)("flex flex-col")), [__props.noResults ? renderSlot(_ctx.$slots, "noResults", { key: 0 }, () => [_cache[0] || (_cache[0] = createElementVNode("div", { class: "flex flex-col items-center gap-2 px-3 py-4" }, [createElementVNode("div", {
				class: "text-base font-medium text-c-2",
				role: "alert"
			}, " No results found ")], -1))]) : createCommentVNode("", true), renderSlot(_ctx.$slots, "default")], 16);
		};
	}
});
//#endregion
export { ScalarSearchResultList_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarSearchResultList.vue.script.js.map