import ScalarIconLegacyAdapter_default from "../ScalarIcon/ScalarIconLegacyAdapter.vue.js";
import ScalarSidebarIndent_default from "./ScalarSidebarIndent.vue.js";
import { cva, useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, mergeProps, openBlock, renderSlot, resolveDynamicComponent, unref, withCtx } from "vue";
//#region src/components/ScalarSidebar/ScalarSidebarButton.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "h-lh *:size-4 mr-1 flex items-center"
};
var _hoisted_2 = { class: "group/button-label flex-1 min-w-0" };
var ScalarSidebarButton_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarSidebarButton",
	props: {
		is: { default: "a" },
		icon: { type: [Object, Function] },
		active: { type: Boolean },
		selected: { type: Boolean },
		disabled: { type: Boolean },
		indent: { default: 0 }
	},
	setup(__props) {
		const variants = cva({
			base: ["group/button peer/button flex items-stretch rounded p-2", "font-sidebar text-base/4  text-sidebar-c-2 no-underline wrap-break-word"],
			variants: {
				active: { true: "text-sidebar-c-active font-sidebar-active" },
				disabled: { true: "cursor-auto" },
				selected: { true: "cursor-auto bg-sidebar-b-active text-sidebar-c-active font-sidebar-active" }
			},
			compoundVariants: [{
				selected: false,
				disabled: false,
				active: false,
				class: "hover:bg-sidebar-b-hover hover:text-sidebar-c-hover"
			}, {
				selected: false,
				disabled: false,
				active: true,
				class: "hover:bg-sidebar-b-hover"
			}],
			defaultVariants: {
				selected: false,
				disabled: false,
				active: false
			}
		});
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.is), mergeProps({
				"aria-selected": __props.selected,
				type: __props.is === "button" ? "button" : void 0
			}, unref(cx)(unref(variants)({
				selected: __props.selected,
				disabled: __props.disabled,
				active: __props.active
			}))), {
				default: withCtx(() => [
					renderSlot(_ctx.$slots, "indent", {}, () => [createVNode(ScalarSidebarIndent_default, {
						class: "-my-2",
						disabled: __props.disabled,
						indent: __props.indent,
						selected: __props.selected
					}, null, 8, [
						"disabled",
						"indent",
						"selected"
					])]),
					__props.icon || _ctx.$slots.icon ? (openBlock(), createElementBlock("div", _hoisted_1, [renderSlot(_ctx.$slots, "icon", {}, () => [__props.icon ? (openBlock(), createBlock(unref(ScalarIconLegacyAdapter_default), {
						key: 0,
						icon: __props.icon
					}, null, 8, ["icon"])) : createCommentVNode("", true)])])) : createCommentVNode("", true),
					createElementVNode("div", _hoisted_2, [renderSlot(_ctx.$slots, "default")]),
					renderSlot(_ctx.$slots, "aside")
				]),
				_: 3
			}, 16, ["aria-selected", "type"]);
		};
	}
});
//#endregion
export { ScalarSidebarButton_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarSidebarButton.vue.script.js.map