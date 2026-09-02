import { useSidebarNestedItems } from "./useSidebarNestedItems.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, defineComponent, guardReactiveProps, normalizeProps, openBlock, renderSlot, resolveDynamicComponent, unref, withCtx } from "vue";
var ScalarSidebarItems_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarSidebarItems",
	props: { is: { default: "ul" } },
	setup(__props) {
		const { open } = useSidebarNestedItems();
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.is), normalizeProps(guardReactiveProps(unref(cx)("group/items relative flex flex-col p-(--scalar-sidebar-padding) gap-px transition-transform duration-300", unref(open) ? "-translate-x-full" : "translate-x-0"))), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
export { ScalarSidebarItems_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarSidebarItems.vue.script.js.map