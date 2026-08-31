import { createFuseInstance } from "../helpers/create-fuse-instance.js";
import { createSearchIndex } from "../helpers/create-search-index.js";
import { computed, ref, toValue } from "vue";
//#region src/v2/features/search/hooks/use-document-search.ts
var MAX_SEARCH_RESULTS = 25;
/**
* Fuzzy search scoped to a single OpenAPI document.
*
* Mirrors the behaviour of the reference search modal (`@scalar/api-reference`)
* but stays local to api-client so the two packages do not have a circular
* dependency. The index is rebuilt whenever the source document changes.
*
* When the query is empty we surface the first `MAX_SEARCH_RESULTS` entries of
* the index as a zero-state list, matching the reference UX.
*/
function useDocumentSearch(document) {
	const searchIndex = computed(() => {
		const doc = toValue(document);
		return doc ? createSearchIndex([doc]) : [];
	});
	const fuse = computed(() => {
		const instance = createFuseInstance();
		instance.setCollection(searchIndex.value);
		return instance;
	});
	const query = ref("");
	return {
		results: computed(() => {
			const trimmed = query.value.trim();
			if (trimmed) return fuse.value.search(trimmed, { limit: MAX_SEARCH_RESULTS });
			return searchIndex.value.slice(0, MAX_SEARCH_RESULTS).map((item, index) => ({
				item,
				refIndex: index
			}));
		}),
		query
	};
}
//#endregion
export { useDocumentSearch };

//# sourceMappingURL=use-document-search.js.map