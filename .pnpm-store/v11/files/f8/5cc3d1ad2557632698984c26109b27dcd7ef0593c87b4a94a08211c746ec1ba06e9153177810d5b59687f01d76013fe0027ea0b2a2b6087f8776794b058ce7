import { generateReverseIndex } from "./generate-reverse-index.js";
import { computed, ref, toValue } from "vue";
//#region src/helpers/create-sidebar-state.ts
/**
* Creates and manages the state for a sidebar tree, including selection and expansion of items.
*
* @template T - The type of sidebar items, which must include an `id` property.
* @param items - The array of sidebar items.
* @param options - Optional configuration for customizing behavior and hooks.
* @returns An object containing sidebar state and methods to manipulate it.
*
* ## Example Usage
*
* ```ts
* // Example sidebar items
* const sidebarItems = [
*   { id: 'root', label: 'Root', children: [
*     { id: 'child1', label: 'Child 1' },
*     { id: 'child2', label: 'Child 2', children: [
*       { id: 'grandchild1', label: 'Grandchild 1' }
*     ]}
*   ]}
* ]
*
* // Create sidebar state
* const sidebarState = createSidebarState(sidebarItems, {
*   key: 'children',
*   hooks: {
*     onBeforeSelect: (id) => console.log('Before select:', id),
*     onAfterSelect: (id) => console.log('After select:', id),
*     onBeforeExpand: (id) => console.log('Before expand:', id),
*     onAfterExpand: (id) => console.log('After expand:', id),
*   }
* })
*
* // Select an item
* await sidebarState.setSelected('grandchild1')
* // Expand an item
* await sidebarState.setExpanded('child2', true)
* ```
*/
var createSidebarState = (items, options) => {
	const index = computed(() => generateReverseIndex({
		items: toValue(items),
		nestedKey: options?.key ?? "children"
	}));
	const selectedItems = ref({});
	const expandedItems = ref({});
	const selectedItem = ref(null);
	/**
	* Selects the given item by id, and recursively marks all its parent items as selected.
	* Triggers optional lifecycle hooks before and after selection.
	*
	* @param id - The ID of the item to select.
	*
	* ## Example
	* ```ts
	* await sidebarState.setSelected('grandchild1')
	* // selectedItems.value will include 'grandchild1', 'child2', and 'root'
	* ```
	*/
	const setSelected = (id) => {
		/**
		* Recursively mark all parent items as selected.
		* @param node - The current node to mark as selected.
		*/
		const markSelected = (node) => {
			if (!node) return;
			selectedItems.value[node.id] = true;
			if ("parent" in node && node.parent) markSelected(node.parent);
		};
		if (options?.hooks?.onBeforeSelect) options.hooks.onBeforeSelect(id);
		selectedItems.value = {};
		selectedItem.value = id;
		if (id !== null) markSelected(index.value.get(id));
		if (options?.hooks?.onAfterSelect) options.hooks.onAfterSelect(id);
	};
	/**
	* Expands or collapses the given item by id.
	* When expanding, recursively expands all parent items.
	* Triggers optional lifecycle hooks before and after expansion.
	*
	* @param id - The ID of the item to expand or collapse.
	* @param value - true to expand, false to collapse.
	*
	* ## Example
	* ```ts
	* await sidebarState.setExpanded('child2', true)
	* // expandedItems.value will include 'child2' and 'root'
	*
	* await sidebarState.setExpanded('child2', false)
	* // expandedItems.value['child2'] will be false
	* ```
	*/
	const setExpanded = (id, value) => {
		/**
		* Recursively expand all parent items of the given node.
		* @param node - The current node to expand.
		*/
		const openParents = (node) => {
			if (!node) return;
			expandedItems.value[node.id] = true;
			if ("parent" in node && node.parent) openParents(node.parent);
		};
		if (options?.hooks?.onBeforeExpand) options.hooks.onBeforeExpand(id);
		if (value === false) expandedItems.value[id] = false;
		else openParents(index.value.get(id));
		if (options?.hooks?.onAfterExpand) options.hooks.onAfterExpand(id);
	};
	const isExpanded = (id) => {
		return expandedItems.value[id] ?? false;
	};
	const isSelected = (id) => {
		return selectedItems.value[id] ?? false;
	};
	const getEntryById = (id) => index.value.get(id);
	return {
		items: computed(() => toValue(items)),
		index,
		selectedItems,
		expandedItems,
		selectedItem,
		setSelected,
		setExpanded,
		isExpanded,
		isSelected,
		getEntryById,
		reset: () => {
			selectedItems.value = {};
			expandedItems.value = {};
		}
	};
};
//#endregion
export { createSidebarState };

//# sourceMappingURL=create-sidebar-state.js.map