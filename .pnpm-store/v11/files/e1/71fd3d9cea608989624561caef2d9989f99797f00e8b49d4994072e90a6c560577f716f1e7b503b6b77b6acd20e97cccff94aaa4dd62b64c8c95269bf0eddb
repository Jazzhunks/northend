import ScalarSidebarButton_default from "./ScalarSidebarButton.vue.js";
import { useSidebarGroups } from "./useSidebarGroups.js";
import ScalarSidebarLoading_default from "./ScalarSidebarLoading.vue.js";
import ScalarSidebarSpacer_default from "./ScalarSidebarSpacer.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createCommentVNode, createElementVNode, createVNode, defineComponent, guardReactiveProps, normalizeProps, openBlock, renderSlot, resolveDynamicComponent, unref, withCtx } from "vue";
//#region src/components/ScalarSidebar/ScalarSidebarSection.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex flex-col gap-px" };
var ScalarSidebarSection_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarSidebarSection",
	props: {
		is: { default: "li" },
		icon: { type: [Object, Function] },
		active: { type: Boolean },
		selected: { type: Boolean },
		disabled: { type: Boolean },
		indent: {},
		loading: { type: Boolean }
	},
	setup(__props) {
		const { level } = useSidebarGroups({ increment: false });
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.is), normalizeProps(guardReactiveProps(unref(cx)("group/item group/sidebar-section contents"))), {
				default: withCtx(() => [
					createVNode(ScalarSidebarSpacer_default, {
						class: "group/spacer-before h-3",
						indent: unref(level)
					}, null, 8, ["indent"]),
					_ctx.$slots.default ? (openBlock(), createBlock(ScalarSidebarButton_default, {
						key: 0,
						is: "div",
						class: "text-sm/4 py-1.75 font-bold",
						disabled: "",
						icon: __props.icon,
						indent: unref(level)
					}, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
						_: 3
					}, 8, ["icon", "indent"])) : createCommentVNode("", true),
					createElementVNode("ul", _hoisted_1, [__props.loading ? (openBlock(), createBlock(ScalarSidebarLoading_default, { key: 0 })) : renderSlot(_ctx.$slots, "items", { key: 1 })]),
					createVNode(ScalarSidebarSpacer_default, {
						class: "group/spacer-after h-3",
						indent: unref(level)
					}, null, 8, ["indent"])
				]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
export { ScalarSidebarSection_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarSidebarSection.vue.script.js.map