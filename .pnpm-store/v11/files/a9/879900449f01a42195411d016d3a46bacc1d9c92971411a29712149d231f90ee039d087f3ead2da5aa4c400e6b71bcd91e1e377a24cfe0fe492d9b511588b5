import { getSecurityRequirements, getSecuritySchemes, getSelectedSecurity, getSelectedServer, getServers, mergeSecurity } from "@scalar/workspace-store/request-example";
import { REFERENCE_LS_KEYS, safeLocalStorage } from "@scalar/helpers/object/local-storage";
import { AuthSchema } from "@scalar/workspace-store/entities/auth";
import { isOpenApiDocument } from "@scalar/workspace-store/schemas/type-guards";
import { coerceValue } from "@scalar/workspace-store/schemas/typebox-coerce";
//#region src/helpers.ts
function getOperations(doc) {
	return Object.values(doc.paths ?? {}).flatMap((path) => Object.values(path ?? {}));
}
/** Flattens all security requirements from a document */
function getSecurityFromDocument(documentName, document, authStore) {
	const mergedSecurity = mergeSecurity(document?.components?.securitySchemes, {}, authStore, documentName);
	const securityRequirements = getSecurityRequirements(document.security);
	const selectedSecurity = getSelectedSecurity(authStore.getAuthSelectedSchemas({
		type: "document",
		documentName
	}), void 0, securityRequirements);
	return getSecuritySchemes(mergedSecurity, selectedSecurity.selectedSchemes[selectedSecurity.selectedIndex] ?? {});
}
/** Generate document settings from workspace store. AsyncAPI docs are skipped — this feature is OpenAPI-native. */
function createDocumentSettings(workspaceStore) {
	const openApiEntries = [];
	for (const [key, document] of Object.entries(workspaceStore.workspace.documents)) if (isOpenApiDocument(document)) openApiEntries.push([key, document]);
	return Object.fromEntries(openApiEntries.map(([key, document]) => {
		return [key, {
			activeServer: getSelectedServer(document, null, null, getServers(document.servers, { documentUrl: document["x-scalar-original-source-url"] })),
			securitySchemes: getSecurityFromDocument(key, document, workspaceStore.auth)
		}];
	}));
}
var storage = safeLocalStorage();
/**
* Provides an interface to store and retrieve authentication scheme
* information in local storage, including both the available schemes and
* the user's selected schemes.
*/
var authStorage = () => {
	const getKey = (slug) => {
		return `${REFERENCE_LS_KEYS.AUTH}-${slug}`;
	};
	return {
		getAuth: (slug) => {
			return coerceValue(AuthSchema, JSON.parse(storage.getItem(getKey(slug)) ?? "{}"));
		},
		setAuth: (slug, value) => {
			storage.setItem(getKey(slug), JSON.stringify(value));
		}
	};
};
/**
* Restores authentication secrets from local storage to the workspace store.
*
* This function iterates through stored authentication schemes and restores
* any secret values (keys starting with x-scalar-secret-) to the active
* document's security schemes. It uses the current security schemes as the
* source of truth, only restoring secrets for structures that exist in the
* current document.
*/
var restoreAuthSecretsFromStorage = ({ documentName, workspaceStore }) => {
	const auth = authStorage().getAuth(documentName);
	workspaceStore.auth.load({ [documentName]: auth });
};
function safeParseJson(value) {
	try {
		return JSON.parse(value);
	} catch {
		return;
	}
}
//#endregion
export { authStorage, createDocumentSettings, getOperations, restoreAuthSecretsFromStorage, safeParseJson };

//# sourceMappingURL=helpers.js.map