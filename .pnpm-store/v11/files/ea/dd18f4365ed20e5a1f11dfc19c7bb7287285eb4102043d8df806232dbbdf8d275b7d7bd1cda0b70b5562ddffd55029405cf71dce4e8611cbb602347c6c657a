import { filterItems } from "../helpers/filter-items.js";
import SidebarItem_default from "./SidebarItem.vue.js";
import { Fragment, createBlock, createElementBlock, createElementVNode, createSlots, createVNode, defineComponent, mergeProps, normalizeStyle, openBlock, renderList, renderSlot, unref, useSlots, withCtx } from "vue";
import { ScalarSidebar, ScalarSidebarItems } from "@scalar/components/sidebar";
//#region src/components/ScalarSidebar.vue?vue&type=script&setup=true&lang.ts
var ScalarSidebar_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarSidebar",
	props: {
		layout: {},
		items: {},
		isSelected: { type: Function },
		isExpanded: { type: Function },
		options: {},
		indent: { default: 20 },
		isDraggable: {},
		isDroppable: { type: Function }
	},
	emits: [
		"reorder",
		"selectItem",
		"toggleGroup"
	],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const slots = useSlots();
		/**
		* Handle drag and drop reordering of sidebar items.
		* Emit the reorder event to the parent component for handling.
		*/
		const handleDragEnd = (draggingItem, hoveredItem) => {
			emit("reorder", draggingItem, hoveredItem);
		};
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarSidebar), {
				class: "flex min-h-0 flex-col",
				style: normalizeStyle({ "--scalar-sidebar-indent": __props.indent + "px" })
			}, {
				default: withCtx(() => [
					renderSlot(_ctx.$slots, "header"),
					renderSlot(_ctx.$slots, "default", {}, () => [createVNode(unref(ScalarSidebarItems), { class: "custom-scroll" }, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "before"), (openBlock(true), createElementBlock(Fragment, null, renderList(unref(filterItems)(__props.layout, __props.items), (item) => {
							return openBlock(), createBlock(SidebarItem_default, {
								key: item.id,
								isDraggable: __props.isDraggable ?? __props.layout === "client",
								isDroppable: __props.isDroppable,
								isExpanded: __props.isExpanded,
								isSelected: __props.isSelected,
								item,
								layout: __props.layout,
								options: __props.options,
								onOnDragEnd: handleDragEnd,
								onSelectItem: _cache[0] || (_cache[0] = (id) => emit("selectItem", id)),
								onToggleGroup: _cache[1] || (_cache[1] = (id) => emit("toggleGroup", id))
							}, createSlots({ _: 2 }, [
								slots.decorator ? {
									name: "decorator",
									fn: withCtx((props) => [renderSlot(_ctx.$slots, "decorator", mergeProps({ ref_for: true }, props))]),
									key: "0"
								} : void 0,
								slots.empty ? {
									name: "empty",
									fn: withCtx((props) => [renderSlot(_ctx.$slots, "empty", mergeProps({ ref_for: true }, props))]),
									key: "1"
								} : void 0,
								slots.icon ? {
									name: "icon",
									fn: withCtx((props) => [renderSlot(_ctx.$slots, "icon", mergeProps({ ref_for: true }, props))]),
									key: "2"
								} : void 0
							]), 1032, [
								"isDraggable",
								"isDroppable",
								"isExpanded",
								"isSelected",
								"item",
								"layout",
								"options"
							]);
						}), 128))]),
						_: 3
					}), renderSlot(_ctx.$slots, "spacer", {}, () => [_cache[2] || (_cache[2] = createElementVNode("div", { class: "flex-1" }, null, -1))])]),
					renderSlot(_ctx.$slots, "footer")
				]),
				_: 3
			}, 8, ["style"]);
		};
	}
});
//#endregion
export { ScalarSidebar_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarSidebar.vue.script.js.map