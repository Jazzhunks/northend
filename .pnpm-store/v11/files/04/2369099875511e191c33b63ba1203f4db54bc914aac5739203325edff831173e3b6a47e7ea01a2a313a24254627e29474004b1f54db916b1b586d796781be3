import { useState } from "../state/state.js";
import { onMounted } from "vue";
import { useToasts } from "@scalar/use-toasts";
//#region src/hooks/use-agent-key-documents.ts
function useAgentKeyDocuments() {
	const { api, addDocument, mode, getAgentKey } = useState();
	const { toast } = useToasts();
	onMounted(async () => {
		if (mode !== "full" || !getAgentKey) return;
		const keyDocumentsResult = await api.getKeyDocuments();
		if (!keyDocumentsResult.success) {
			toast("Failed to fetch your OpenAPI document. The Agent key may be invalid.", "error");
			return;
		}
		keyDocumentsResult.data.documents.forEach(({ namespace, slug }) => addDocument({
			namespace,
			slug,
			removable: false
		}));
	});
}
//#endregion
export { useAgentKeyDocuments };

//# sourceMappingURL=use-agent-key-documents.js.map