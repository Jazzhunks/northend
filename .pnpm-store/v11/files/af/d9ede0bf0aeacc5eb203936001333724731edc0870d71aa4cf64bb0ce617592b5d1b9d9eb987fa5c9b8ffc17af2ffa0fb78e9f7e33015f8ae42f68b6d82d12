import { getResolvedRef } from "@scalar/workspace-store/helpers/get-resolved-ref";
import { getPathItemOperation } from "@scalar/workspace-store/helpers/for-each-path-item-operation";
//#region src/v2/features/search/helpers/create-search-index.ts
/**
* Create a search index from a list of entries.
*/
function createSearchIndex(documents) {
	const index = [];
	/**
	* Recursively processes entries and their children to build the search index.
	*/
	function processEntries(entriesToProcess, document) {
		entriesToProcess.forEach((entry) => {
			addEntryToIndex(entry, index, document);
			if ("children" in entry && entry.children) processEntries(entry.children, document);
		});
	}
	documents?.forEach((document) => processEntries(document["x-scalar-navigation"]?.children ?? [], document));
	return index;
}
/**
* Adds a single entry to the search index, handling all entry types recursively.
*/
function addEntryToIndex(entry, index, document) {
	if (entry.type === "operation") {
		const operation = getResolvedRef(getPathItemOperation(document?.paths?.[entry.path], entry.method)) ?? {};
		index.push({
			type: "operation",
			title: entry.title,
			id: entry.id,
			description: operation.description || "",
			method: entry.method,
			path: entry.path,
			operationId: operation.operationId,
			entry,
			documentName: document?.info.title ?? ""
		});
		return;
	}
	if (entry.type === "tag" && entry.isGroup === false) {
		index.push({
			id: entry.id,
			title: entry.title,
			description: entry.description || "",
			type: "tag",
			entry,
			documentName: document?.info.title ?? ""
		});
		return;
	}
	if (entry.type === "tag" && entry.isGroup === true) {
		index.push({
			id: entry.id,
			title: entry.title,
			description: "Tag Group",
			type: "tag",
			entry,
			documentName: document?.info.title ?? ""
		});
		return;
	}
	if (entry.type === "text") {
		index.push({
			id: entry.id,
			type: "heading",
			title: entry.title ?? "",
			description: "Heading",
			entry,
			documentName: document?.info.title ?? ""
		});
		return;
	}
}
//#endregion
export { createSearchIndex };

//# sourceMappingURL=create-search-index.js.map