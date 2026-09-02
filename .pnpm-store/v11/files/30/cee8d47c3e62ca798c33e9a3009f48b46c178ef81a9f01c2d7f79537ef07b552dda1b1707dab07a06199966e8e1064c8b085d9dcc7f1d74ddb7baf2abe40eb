//#region src/helpers/scroll-sidebar-to-top.ts
var DEFAULT_SCROLL_OFFSET_TOP = 100;
/**
* Returns the element that should be used for vertical position measurement.
*/
var getMeasurableElement = (element) => {
	if (window.getComputedStyle(element).display !== "contents") return element;
	/**
	* `display: contents` does not render a layout box, so use the first child with
	* a measurable offset to keep the scroll target aligned with what users see.
	*/
	for (const child of element.children) if (child instanceof HTMLElement && child.offsetParent !== null) return child;
	return element;
};
/**
* Adds extra offset for heading rows so the selected item stays visible below labels.
*/
var getHeadingOffset = (element) => {
	if (element.dataset.sidebarType !== "heading") return 0;
	return element.querySelector(".sidebar-heading")?.offsetHeight ?? 0;
};
/**
* Computes an element top position relative to the provided scroll container.
*/
var getTopRelativeToScroller = (element, scroller) => {
	let top = element.offsetTop;
	let currentOffsetParent = element.offsetParent;
	while (currentOffsetParent && currentOffsetParent !== scroller) {
		top += currentOffsetParent.offsetTop;
		currentOffsetParent = currentOffsetParent.offsetParent;
	}
	return top;
};
/**
* Scrolls the sidebar container so the requested item appears near the top.
*/
var scrollSidebarToTop = (id, offsetTop = DEFAULT_SCROLL_OFFSET_TOP) => {
	if (typeof window === "undefined") return;
	const element = document.querySelector(`[data-sidebar-id="${id}"]`);
	const scroller = element?.closest(".custom-scroll, .custom-scrollbar") ?? null;
	if (!element || !scroller) return;
	const targetTop = getTopRelativeToScroller(getMeasurableElement(element), scroller) + getHeadingOffset(element) - offsetTop;
	scroller.scrollTo({ top: targetTop > 0 ? targetTop : 0 });
};
//#endregion
export { scrollSidebarToTop };

//# sourceMappingURL=scroll-sidebar-to-top.js.map