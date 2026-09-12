import { createCommentVNode, createElementBlock, createElementVNode, defineComponent, guardReactiveProps, normalizeClass, normalizeProps, normalizeStyle, openBlock, renderSlot, unref } from "vue";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
//#region src/v2/components/data-table/DataTable.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["role"];
var _hoisted_2 = {
	key: 0,
	class: "sr-only"
};
var DataTable_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DataTable",
	props: {
		columns: {},
		scroll: { type: Boolean },
		presentational: { type: Boolean }
	},
	setup(__props) {
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", normalizeProps(guardReactiveProps(unref(cx)(__props.scroll ? "overflow-x-auto custom-scroll" : "overflow-visible", "scalar-data-table"))), [createElementVNode("table", {
				class: normalizeClass(["mb-0 grid min-h-8 auto-rows-auto", { "w-max min-w-full": __props.scroll }]),
				role: __props.presentational ? "presentation" : "table",
				style: normalizeStyle({ gridTemplateColumns: __props.columns.map((col) => col || "1fr").join(" ") })
			}, [_ctx.$slots.caption ? (openBlock(), createElementBlock("caption", _hoisted_2, [renderSlot(_ctx.$slots, "caption")])) : createCommentVNode("", true), renderSlot(_ctx.$slots, "default")], 14, _hoisted_1)], 16);
		};
	}
});
//#endregion
export { DataTable_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=DataTable.vue.script.js.map