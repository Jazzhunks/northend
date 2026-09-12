import { createError } from "../entities/error/helpers.js";
import { createDocumentName } from "./create-document-name.js";
import { restoreAuthSecretsFromStorage } from "../helpers.js";
import { n } from "neverpanic";
import { bundle } from "@scalar/json-magic/bundle";
import { fetchUrls } from "@scalar/json-magic/bundle/plugins/browser";
//#region src/registry/add-documents-to-store.ts
var loadDocument = n.safeFn(async ({ namespace, slug, workspaceStore, registryDocuments, getAccessToken, registryUrl, config, api, removable }) => {
	const getDocumentResult = await api.getDocument({
		namespace,
		slug
	});
	if (!getDocumentResult.success) return getDocumentResult;
	registryDocuments.value.push({
		...getDocumentResult.data,
		removable
	});
	const url = new URL(`/@${namespace}/apis/${slug}/latest`, registryUrl);
	const headers = [];
	const token = getAccessToken?.();
	if (token) headers.push({
		domains: [new URL(registryUrl).host],
		headers: { "x-scalar-auth": token }
	});
	const document = await bundle(url.toString(), {
		plugins: [fetchUrls({ headers })],
		treeShake: false
	});
	const documentName = createDocumentName(namespace, slug);
	await workspaceStore.addDocument({
		name: documentName,
		document
	}, config);
	workspaceStore.update("x-scalar-active-document", documentName);
	restoreAuthSecretsFromStorage({
		documentName,
		workspaceStore
	});
	return {
		success: true,
		data: getDocumentResult.data
	};
}, (originalError) => createError("UNABLE_TO_LOAD_DOCUMENT", originalError));
//#endregion
export { loadDocument };

//# sourceMappingURL=add-documents-to-store.js.map