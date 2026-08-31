import ScalarSidebarButton_default from "./ScalarSidebarButton.vue.js";
import { useSidebarGroups } from "./useSidebarGroups.js";
import ScalarSidebarLoading_default from "./ScalarSidebarLoading.vue.js";
import { useSidebarNestedItem } from "./useSidebarNestedItems.js";
import ScalarSidebarItems_default from "./ScalarSidebarItems.vue.js";
import ScalarSidebarSpacer_default from "./ScalarSidebarSpacer.vue.js";
import { findScrollContainer } from "./findScrollContainer.js";
import { Transition, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, guardReactiveProps, mergeModels, mergeProps, nextTick, normalizeClass, normalizeProps, normalizeStyle, openBlock, ref, renderSlot, unref, useModel, useTemplateRef, withCtx } from "vue";
import { ScalarIconArrowRight, ScalarIconCaretLeft } from "@scalar/icons";
//#region src/components/ScalarSidebar/ScalarSidebarNestedItems.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "absolute inset-0 translate-x-full"
};
var _hoisted_2 = { class: "flex flex-col gap-px sticky top-(--scalar-sidebar-sticky-offset,0) pt-(--scalar-sidebar-padding) -mt-(--scalar-sidebar-padding) px-(--scalar-sidebar-padding) -mx-(--scalar-sidebar-padding) bg-sidebar-b-1 z-1 animate-sidebar-border-bottom border-b-sidebar-border" };
var ScalarSidebarNestedItems_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarSidebarNestedItems",
	props: /* @__PURE__ */ mergeModels({
		is: {},
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
	emits: /* @__PURE__ */ mergeModels(["click", "back"], ["update:open"]),
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const open = useModel(__props, "open");
		useSidebarNestedItem(() => open.value);
		const { level } = useSidebarGroups({ reset: true });
		/** The root element ref */
		const el = useTemplateRef("el");
		/** How far down to offset the nested items by when animating them in */
		const offset = ref(0);
		function onOpen() {
			offset.value = findScrollContainer(el.value).scrollTop ?? 0;
			nextTick(() => el.value?.querySelector("button:not([aria-expanded=\"true\"])")?.focus({ preventScroll: true }));
		}
		function onOpened() {
			/** Reset the scroll position of the scroll container after opening */
			findScrollContainer(el.value).scrollTop = 0;
		}
		function onClose() {
			nextTick(() => {
				el.value?.querySelector("button")?.focus({ preventScroll: true });
				findScrollContainer(el.value).scrollTop = offset.value;
			});
		}
		/** Handle the click event for the nested items button */
		const handleClick = (event) => {
			emit("click", event);
			if (!__props.controlled) open.value = true;
		};
		/** Handle the back button click event */
		const handleBack = (event) => {
			emit("back", event);
			if (!__props.controlled) open.value = false;
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("li", {
				ref_key: "el",
				ref: el,
				class: normalizeClass(["group/item group/nested-items contents", { "group/nested-items-open": open.value }]),
				style: normalizeStyle({ "--nested-items-offset": `${offset.value}px` })
			}, [renderSlot(_ctx.$slots, "button", {}, () => [createVNode(ScalarSidebarButton_default, mergeProps({
				is: "button",
				"aria-expanded": open.value,
				disabled: __props.disabled,
				icon: __props.icon,
				indent: unref(level),
				selected: __props.selected
			}, _ctx.$attrs, { onClick: handleClick }), createSlots({
				aside: withCtx(() => [renderSlot(_ctx.$slots, "aside", {}, () => [createVNode(unref(ScalarIconArrowRight), { class: "size-4 text-sidebar-c-2" })])]),
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 2
			}, [_ctx.$slots.icon ? {
				name: "icon",
				fn: withCtx(() => [renderSlot(_ctx.$slots, "icon")]),
				key: "0"
			} : void 0]), 1040, [
				"aria-expanded",
				"disabled",
				"icon",
				"indent",
				"selected"
			])]), createVNode(Transition, {
				duration: 300,
				enterActiveClass: "top-(--nested-items-offset)!",
				leaveActiveClass: "top-(--nested-items-offset)!",
				onAfterEnter: onOpened,
				onEnter: onOpen,
				onLeave: onClose
			}, {
				default: withCtx(() => [open.value ? (openBlock(), createElementBlock("div", _hoisted_1, [createVNode(ScalarSidebarItems_default, normalizeProps(guardReactiveProps(_ctx.$attrs)), {
					default: withCtx(() => [createElementVNode("div", _hoisted_2, [renderSlot(_ctx.$slots, "back", {}, () => [createVNode(ScalarSidebarButton_default, {
						is: "button",
						class: "text-sidebar-c-1 font-sidebar-active hover:text-sidebar-c-1",
						onClick: handleBack
					}, {
						icon: withCtx(() => [createVNode(unref(ScalarIconCaretLeft), { class: "size-4 -m-px text-sidebar-c-2" })]),
						default: withCtx(() => [renderSlot(_ctx.$slots, "back-label", {}, () => [_cache[0] || (_cache[0] = createTextVNode("Back", -1))])]),
						_: 3
					})]), createVNode(ScalarSidebarSpacer_default, { class: "h-3" })]), __props.loading ? (openBlock(), createBlock(ScalarSidebarLoading_default, { key: 0 })) : renderSlot(_ctx.$slots, "items", { key: 1 })]),
					_: 3
				}, 16)])) : createCommentVNode("", true)]),
				_: 3
			})], 6);
		};
	}
});
//#endregion
export { ScalarSidebarNestedItems_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarSidebarNestedItems.vue.script.js.map