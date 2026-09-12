import { useState } from "../state/state.js";
import { ref } from "vue";
import { coerce, object, string, validate } from "@scalar/validation";
import { redirectToProxy } from "@scalar/helpers/url/redirect-to-proxy";
//#region src/hooks/use-upload-tmp-document.ts
var SHOW_UPLOAD_SUCCESS_DELAY = 5e3;
var TMP_DOC_LS_KEY = "scalar-tmp-doc";
function saveTmpDocumentInLocalStorage({ namespace, slug }) {
	localStorage.setItem(TMP_DOC_LS_KEY, JSON.stringify({
		namespace,
		slug
	}));
}
var tmpDocSchema = object({
	namespace: string(),
	slug: string()
});
function getTmpDocFromLocalStorage() {
	const tmpDoc = localStorage.getItem(TMP_DOC_LS_KEY);
	if (!tmpDoc) return;
	return coerce(tmpDocSchema, JSON.parse(tmpDoc));
}
function removeTmpDocFromLocalStorage() {
	if (!localStorage.getItem(TMP_DOC_LS_KEY)) return;
	localStorage.removeItem(TMP_DOC_LS_KEY);
}
/**
* Handle uploading a temporary OpenAPI document.
*/
function useUploadTmpDocument() {
	const state = useState();
	const uploadState = ref();
	function createUrl(path) {
		const fullUrl = `${state.baseUrl}${path}`;
		return redirectToProxy(state.platformProxyUrl, fullUrl);
	}
	async function uploadTempDocument(document, isAgent = false) {
		try {
			uploadState.value = { type: "uploading" };
			const response = await fetch(createUrl(`/core/share/upload/apis${isAgent ? "?source=agent" : ""}`), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ document })
			});
			if (!response.ok) {
				uploadState.value = {
					type: "error",
					error: "Failed to upload your OpenAPI document."
				};
				return;
			}
			const json = await response.json();
			const uploadResponseSchema = object({
				url: string(),
				namespace: string(),
				slug: string()
			});
			if (!validate(uploadResponseSchema, json)) {
				uploadState.value = {
					type: "error",
					error: "Failed to process document."
				};
				return;
			}
			const uploadData = coerce(uploadResponseSchema, json);
			uploadState.value = { type: "processing" };
			const embeddingStatusResponse = await fetch(createUrl(`/vector/registry/embeddings/${uploadData.namespace}/${uploadData.slug}`), { method: "GET" });
			saveTmpDocumentInLocalStorage({
				namespace: uploadData.namespace,
				slug: uploadData.slug
			});
			await state.addDocument({
				namespace: uploadData.namespace,
				slug: uploadData.slug,
				removable: false,
				tmp: true
			});
			if (!embeddingStatusResponse.ok) {
				uploadState.value = {
					type: "error",
					error: "Failed to embed document."
				};
				return;
			}
			uploadState.value = { type: "done" };
			state.uploadedTmpDocumentUrl.value = uploadData.url;
			setTimeout(() => {
				uploadState.value = void 0;
			}, SHOW_UPLOAD_SUCCESS_DELAY);
			return uploadData;
		} catch {
			uploadState.value = {
				type: "error",
				error: "Failed to upload your OpenAPI document."
			};
			return;
		}
	}
	return {
		uploadTempDocument,
		uploadState
	};
}
//#endregion
export { getTmpDocFromLocalStorage, removeTmpDocFromLocalStorage, useUploadTmpDocument };

//# sourceMappingURL=use-upload-tmp-document.js.map