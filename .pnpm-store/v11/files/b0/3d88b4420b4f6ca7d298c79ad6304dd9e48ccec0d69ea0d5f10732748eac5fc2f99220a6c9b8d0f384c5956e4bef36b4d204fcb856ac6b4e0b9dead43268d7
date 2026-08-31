import { computed, inject, onBeforeUnmount, provide, shallowReactive } from "vue";
//#region src/components/ScalarSidebar/useSidebarNestedItems.ts
/**
* Tracks the open state of the nearest nested child items
*/
var SIDEBAR_NESTED_ITEMS_SYMBOL = Symbol();
/**
* Get the open / closed model for the nearest nested child items
*/
var useSidebarNestedItem = (open) => {
	const parentList = inject(SIDEBAR_NESTED_ITEMS_SYMBOL);
	if (parentList) {
		parentList.add(open);
		onBeforeUnmount(() => {
			parentList.delete(open);
		});
	}
};
/**
* Get whether or not any nested child items are open
*/
var useSidebarNestedItems = () => {
	const children = shallowReactive(/* @__PURE__ */ new Set());
	const open = computed(() => {
		for (const getIsChildOpen of children) if (getIsChildOpen()) return true;
		return false;
	});
	provide(SIDEBAR_NESTED_ITEMS_SYMBOL, children);
	return { open };
};
//#endregion
export { useSidebarNestedItem, useSidebarNestedItems };

//# sourceMappingURL=useSidebarNestedItems.js.map