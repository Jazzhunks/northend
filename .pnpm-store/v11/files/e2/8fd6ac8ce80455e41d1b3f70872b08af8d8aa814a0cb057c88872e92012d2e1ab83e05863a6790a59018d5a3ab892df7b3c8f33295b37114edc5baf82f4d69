import { hasChildren } from "./has-children.js";
//#region src/helpers/is-sidebar-folder.ts
/**
* Determines if a sidebar item should be treated as a "folder",
* i.e. a collapsible group, depending on the layout, its type,
* whether it has children, and special slot rules.
*
* @param layout - The sidebar layout ('client' or 'reference')
* @param item - The sidebar item to check
* @param hasEmptySlot - True if there is an empty slot to display as a group (client layout only)
* @returns True if the item should be rendered as a folder/group node
*/
var isSidebarFolder = (layout, item, hasEmptySlot, hideOperationDefaultExamples) => {
	if (!hasChildren(item)) {
		if (layout === "client" && hasEmptySlot) return item.type === "document" || item.type === "tag";
		return false;
	}
	if (hideOperationDefaultExamples && item.type === "operation" && item.children?.length === 1 && item.children[0]?.type === "example" && item.children[0]?.name === "default") return false;
	if (layout === "client") return true;
	if (layout === "reference") return item.type !== "operation" && item.type !== "webhook";
	return false;
};
//#endregion
export { isSidebarFolder };

//# sourceMappingURL=is-sidebar-folder.js.map