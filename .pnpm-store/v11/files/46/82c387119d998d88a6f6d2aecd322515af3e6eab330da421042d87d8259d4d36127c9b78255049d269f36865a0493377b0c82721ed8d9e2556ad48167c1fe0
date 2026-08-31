import { useState } from "../state/state.js";
import { onMounted } from "vue";
//#region src/hooks/use-curated-documents.ts
function useCuratedDocuments() {
	const { api, curatedDocuments } = useState();
	onMounted(async () => {
		const getCuratedDocumentsResult = await api.getCuratedDocuments();
		if (!getCuratedDocumentsResult.success) return;
		curatedDocuments.value = getCuratedDocumentsResult.data.results;
	});
}
//#endregion
export { useCuratedDocuments };

//# sourceMappingURL=use-curated-documents.js.map