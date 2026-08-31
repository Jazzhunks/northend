import { useState } from "../state/state.js";
import { computed, ref } from "vue";
import { useDebounceFn } from "@vueuse/core";
//#region src/hooks/use-search.ts
function useSearch() {
	const { api } = useState();
	const queryRef = ref("");
	const search = useDebounceFn(async (q) => {
		const searchResponse = await api.search(q);
		if (!searchResponse.success) return;
		results.value = searchResponse.data.results;
	}, 200);
	const query = computed({
		get: () => {
			return queryRef.value;
		},
		set: (v) => {
			search(v);
			queryRef.value = v;
		}
	});
	const results = ref([]);
	search("");
	return {
		query,
		results
	};
}
//#endregion
export { useSearch };

//# sourceMappingURL=use-search.js.map