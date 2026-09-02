//#region src/helpers/add-scalar-classes.ts
var CLASS_NAME = "scalar-app";
var ROOT_ID = "headlessui-portal-root";
/**
* Type guard to check if an element is an HTMLElement
*/
var isHTMLElement = (element) => {
	return element !== null && element instanceof HTMLElement;
};
/**
* Helper method for adding the scalar classes to an element
*/
var addClasses = (el) => {
	if (!el || el.classList.contains(CLASS_NAME)) return;
	el.classList.add(CLASS_NAME);
};
/**
* Makes sure the scalar classes are added to the HeadlessUI portal root
*
* Returns the mutation observer instance
*/
var addScalarClassesToHeadless = () => {
	addClasses(document.getElementById(ROOT_ID));
	const observer = new MutationObserver((records) => records.forEach(({ addedNodes }) => addedNodes.forEach((node) => {
		if (isHTMLElement(node) && node.id === ROOT_ID) addClasses(node);
	})));
	observer.observe(document.body, { childList: true });
	return observer;
};
//#endregion
export { addScalarClassesToHeadless };

//# sourceMappingURL=add-scalar-classes.js.map