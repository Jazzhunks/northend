//#region src/helpers/filter-items.ts
/** The type of items we want to  */
var API_CLIENT_TYPES_SET = new Set([
	"document",
	"operation",
	"example",
	"tag"
]);
var filterItems = (layout, items, hideOperationDefaultExamples) => {
	if (hideOperationDefaultExamples && items.length === 1 && items[0]?.type === "example" && items[0]?.name === "default") return [];
	if (layout === "reference") return items;
	return items.filter((c) => API_CLIENT_TYPES_SET.has(c.type));
};
//#endregion
export { filterItems };

//# sourceMappingURL=filter-items.js.map