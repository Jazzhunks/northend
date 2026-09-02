import ScalarSidebarButton_default from "./ScalarSidebarButton.vue.js";
import { useSidebarGroups } from "./useSidebarGroups.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createElementBlock, createSlots, createVNode, defineComponent, guardReactiveProps, mergeProps, normalizeProps, openBlock, renderSlot, unref, withCtx } from "vue";
var ScalarSidebarItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarSidebarItem",
	props: {
		is: {},
		icon: { type: [Object, Function] },
		active: { type: Boolean },
		selected: { type: Boolean },
		disabled: { type: Boolean },
		indent: {}
	},
	setup(__props) {
		const props = __props;
		const { level } = useSidebarGroups();
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("li", normalizeProps(guardReactiveProps(unref(cx)("group/item flex flex-col text-base"))), [
				renderSlot(_ctx.$slots, "before"),
				renderSlot(_ctx.$slots, "button", { level: unref(level) }, () => [createVNode(ScalarSidebarButton_default, mergeProps(props, { indent: __props.indent ?? unref(level) }), createSlots({ _: 2 }, [
					_ctx.$slots.default ? {
						name: "default",
						fn: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
						key: "0"
					} : void 0,
					_ctx.$slots.icon ? {
						name: "icon",
						fn: withCtx(() => [renderSlot(_ctx.$slots, "icon")]),
						key: "1"
					} : void 0,
					_ctx.$slots.aside ? {
						name: "aside",
						fn: withCtx(() => [renderSlot(_ctx.$slots, "aside")]),
						key: "2"
					} : void 0
				]), 1040, ["indent"])]),
				renderSlot(_ctx.$slots, "after")
			], 16);
		};
	}
});
//#endregion
export { ScalarSidebarItem_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarSidebarItem.vue.script.js.map