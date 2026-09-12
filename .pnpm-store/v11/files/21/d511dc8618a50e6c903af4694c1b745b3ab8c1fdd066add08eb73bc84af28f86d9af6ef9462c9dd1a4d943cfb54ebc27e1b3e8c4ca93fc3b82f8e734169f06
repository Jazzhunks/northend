import { inject, provide } from "vue";
//#region src/components/ScalarSidebar/useSidebarGroups.ts
/**
* Tracks the level of the sidebar groups
*
* @default 0
*/
var SIDEBAR_GROUPS_SYMBOL = Symbol();
/**
* Get the current level of the sidebar groups
*
* Optionally increments or resets the level of the sidebar groups
* Always returns the current level even if the level is incremented or reset
*/
var useSidebarGroups = (options = {}) => {
	const { increment = false, reset = false } = options;
	const level = inject(SIDEBAR_GROUPS_SYMBOL, 0);
	if (reset) provide(SIDEBAR_GROUPS_SYMBOL, 0);
	else if (increment && level < 6) provide(SIDEBAR_GROUPS_SYMBOL, level + 1);
	else provide(SIDEBAR_GROUPS_SYMBOL, level);
	return { level };
};
//#endregion
export { useSidebarGroups };

//# sourceMappingURL=useSidebarGroups.js.map