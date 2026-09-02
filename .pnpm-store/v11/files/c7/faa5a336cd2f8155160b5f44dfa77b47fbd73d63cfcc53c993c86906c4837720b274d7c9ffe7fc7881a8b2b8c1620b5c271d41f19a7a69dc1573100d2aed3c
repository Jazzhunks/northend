import { createFuseInstance } from "../helpers/create-fuse-instance.js";
import { createSearchIndex } from "../helpers/create-search-index.js";
import { computed, ref, toValue } from "vue";
//#region src/v2/features/search/hooks/use-search-index.ts
var MAX_SEARCH_RESULTS = 25;
/**
* Creates the search index from multiple OpenAPI documents
*/
var useSearchIndex = (documents) => {
	/** When the document changes we replace the search index */
	const fuse = computed(() => {
		const instance = createFuseInstance();
		instance.setCollection(createSearchIndex(toValue(documents)));
		return instance;
	});
	const query = ref("");
	return {
		results: computed(() => {
			if (query.value.length !== 0) return fuse.value.search(query.value, { limit: MAX_SEARCH_RESULTS }).flatMap((result) => {
				if (result.item.entry.type !== "operation") return [];
				return result.item.entry;
			});
			return null;
		}),
		query
	};
};
//#endregion
export { useSearchIndex };

//# sourceMappingURL=use-search-index.js.map