import ScalarSidebarIndent_default from "./ScalarSidebarIndent.vue.js";
import ScalarSidebarButton_default from "./ScalarSidebarButton.vue.js";
import ScalarSidebarGroupToggle_default from "./ScalarSidebarGroupToggle.vue.js";
import { useSidebarGroups } from "./useSidebarGroups.js";
import ScalarSidebarLoading_default from "./ScalarSidebarLoading.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, guardReactiveProps, mergeModels, normalizeClass, normalizeProps, openBlock, renderSlot, resolveDynamicComponent, toDisplayString, unref, useModel, withCtx } from "vue";
//#region src/components/ScalarSidebar/ScalarSidebarGroup.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "group/group-button relative flex flex-col text-base" };
var _hoisted_2 = {
	key: 0,
	class: "size-4"
};
var _hoisted_3 = ["aria-expanded"];
var _hoisted_4 = {
	key: 0,
	class: "group/items flex flex-col gap-px"
};
var ScalarSidebarGroup_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarSidebarGroup",
	props: /* @__PURE__ */ mergeModels({
		is: { default: "li" },
		icon: { type: [Object, Function] },
		active: { type: Boolean },
		selected: { type: Boolean },
		disabled: { type: Boolean },
		indent: {},
		controlled: { type: Boolean },
		discrete: { type: Boolean },
		loading: { type: Boolean }
	}, {
		"open": {
			type: Boolean,
			default: false
		},
		"openModifiers": {}
	}),
	emits: /* @__PURE__ */ mergeModels(["click", "toggle"], ["update:open"]),
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const open = useModel(__props, "open");
		const { level } = useSidebarGroups({ increment: true });
		const { cx } = useBindCx();
		/** Handle the click event for the group toggle */
		const handleClick = (event) => {
			emit("click", event);
			if (!__props.controlled && !__props.discrete) open.value = !open.value;
		};
		/** Handle the click event for the group toggle */
		const handleToggle = (event) => {
			emit("toggle", event);
			if (!__props.controlled && __props.discrete) open.value = !open.value;
		};
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.is), normalizeProps(guardReactiveProps(unref(cx)("group/item flex flex-col gap-px"))), {
				default: withCtx(() => [createElementVNode("div", _hoisted_1, [
					renderSlot(_ctx.$slots, "before", { open: open.value }),
					renderSlot(_ctx.$slots, "button", {
						level: unref(level),
						open: open.value
					}, () => [createVNode(ScalarSidebarButton_default, {
						is: "button",
						active: __props.active,
						"aria-expanded": open.value,
						disabled: __props.disabled,
						icon: __props.icon,
						indent: unref(level),
						selected: __props.selected,
						onClick: handleClick
					}, createSlots({
						indent: withCtx(() => [createVNode(ScalarSidebarIndent_default, {
							class: "mr-0 -my-2",
							indent: unref(level),
							selected: __props.selected
						}, null, 8, ["indent", "selected"])]),
						aside: withCtx(() => [renderSlot(_ctx.$slots, "aside", { open: open.value }), __props.discrete ? (openBlock(), createElementBlock("div", _hoisted_2)) : renderSlot(_ctx.$slots, "toggle", {
							key: 1,
							open: open.value
						}, () => [createVNode(ScalarSidebarGroupToggle_default, {
							class: "text-sidebar-c-2",
							open: open.value
						}, null, 8, ["open"])])]),
						default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open: open.value })]),
						_: 2
					}, [_ctx.$slots.icon ? {
						name: "icon",
						fn: withCtx(() => [renderSlot(_ctx.$slots, "icon", { open: open.value })]),
						key: "0"
					} : void 0]), 1032, [
						"active",
						"aria-expanded",
						"disabled",
						"icon",
						"indent",
						"selected"
					]), __props.discrete ? (openBlock(), createElementBlock("button", {
						key: 0,
						"aria-expanded": open.value,
						class: normalizeClass(["absolute top-[1lh] -translate-y-1/2 p-0.75 rounded right-1.25 text-sidebar-c-2", __props.selected ? "hover:bg-sidebar-b-1 hover:text-sidebar-c-1" : "hover:bg-sidebar-b-hover hover:text-sidebar-c-hover"]),
						type: "button",
						onClick: handleToggle
					}, [renderSlot(_ctx.$slots, "toggle", { open: open.value }, () => [createVNode(ScalarSidebarGroupToggle_default, { open: open.value }, {
						label: withCtx(() => [createTextVNode(toDisplayString(open.value ? "Close" : "Open") + " ", 1), renderSlot(_ctx.$slots, "default", { open: open.value })]),
						_: 3
					}, 8, ["open"])])], 10, _hoisted_3)) : createCommentVNode("", true)]),
					renderSlot(_ctx.$slots, "after", { open: open.value })
				]), open.value ? (openBlock(), createElementBlock("ul", _hoisted_4, [__props.loading ? (openBlock(), createBlock(ScalarSidebarLoading_default, { key: 0 })) : renderSlot(_ctx.$slots, "items", {
					key: 1,
					open: open.value
				})])) : createCommentVNode("", true)]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
export { ScalarSidebarGroup_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarSidebarGroup.vue.script.js.map