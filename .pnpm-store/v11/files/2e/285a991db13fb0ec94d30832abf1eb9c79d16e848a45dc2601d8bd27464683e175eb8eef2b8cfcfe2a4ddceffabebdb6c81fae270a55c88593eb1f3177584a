//#region src/components/ScalarSidebar/findScrollContainer.ts
/**
* Get the normalized overflow values for both directions from an element.
*/
function getOverflowValues(element) {
	const style = window.getComputedStyle(element);
	const [x, y] = style.overflow.split(" ");
	return {
		x: style.overflowX || x,
		y: style.overflowY || y || x
	};
}
/**
* Find the nearest scrollable parent of an element.
*/
function findScrollContainer(element, direction = "y") {
	if (!element) return document.documentElement;
	let parent = element.parentElement;
	while (parent) {
		const value = getOverflowValues(parent)[direction];
		if (value === "auto" || value === "scroll") return parent;
		parent = parent.parentElement;
	}
	return document.documentElement;
}
//#endregion
export { findScrollContainer };

//# sourceMappingURL=findScrollContainer.js.map