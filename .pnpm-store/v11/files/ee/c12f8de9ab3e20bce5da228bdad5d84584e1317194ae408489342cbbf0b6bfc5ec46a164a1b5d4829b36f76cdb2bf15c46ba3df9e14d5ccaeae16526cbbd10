import { createBlock, defineComponent, mergeProps, openBlock, renderSlot, resolveDynamicComponent, unref, withCtx } from "vue";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
//#region src/v2/components/data-table/DataTableCell.vue?vue&type=script&setup=true&lang.ts
var DataTableCell_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "DataTableCell",
	props: { is: { default: "td" } },
	setup(__props) {
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.is), mergeProps(unref(cx)("box-content max-h-8 min-h-8 min-w-8 border-l-0 border-t border-b-0 border-r flex text-base/5 last:border-r-0 group-last:border-b-transparent p-0 m-0 relative"), { class: "group-[.alert]:bg-b-alert group-[.error]:bg-b-danger" }), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
export { DataTableCell_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=DataTableCell.vue.script.js.map