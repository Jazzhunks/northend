import { isOpenApiDocument } from "@scalar/workspace-store/schemas/type-guards";
import { getResolvedPathItem } from "@scalar/workspace-store/helpers/for-each-path-item-operation";
import { isHttpMethod } from "@scalar/helpers/http/is-http-method";
import { getOperationEntries } from "@scalar/workspace-store/navigation";
//#region src/v2/features/modal/helpers/resolve-route-parameters.ts
/** Type guard to check if an entry is an example. */
var isExample = (entry) => entry.type === "example";
/**
* Gets the document from the workspace store.
* Returns undefined if the document slug is not provided or the document does not exist.
* Modal routing is OpenAPI-only — AsyncAPI docs surface as undefined here.
*/
var getDocument = (ctx) => {
	const doc = ctx.store.workspace.documents[ctx.documentSlug ?? ""];
	return isOpenApiDocument(doc) ? doc : void 0;
};
/**
* Resolves the document slug from a raw input value.
*
* When "default" is specified and no document exists with that slug,
* we fall back to the active document or the first available document.
* Modal routing is OpenAPI-only, so the fallback skips AsyncAPI documents —
* otherwise opening the modal with default params on a workspace that has
* an AsyncAPI active or first document would hand a slug back that
* `getDocument` then resolves to undefined, rendering the modal with
* `document: null` even when OpenAPI documents exist.
*/
var resolveDocumentSlug = (store, slug) => {
	if (slug !== "default" || store.workspace.documents[slug] !== void 0) return slug;
	const activeSlug = store.workspace["x-scalar-active-document"];
	if (activeSlug && isOpenApiDocument(store.workspace.documents[activeSlug])) return activeSlug;
	return Object.entries(store.workspace.documents).find(([, document]) => isOpenApiDocument(document))?.[0];
};
/**
* Resolves the path from a raw input value.
*
* When "default" is specified, returns the first available path in the document.
* This is useful for initial navigation when no specific path is requested.
*/
var resolvePath = (ctx, path) => {
	const document = getDocument(ctx);
	if (!document) return;
	if (path === "default") return Object.keys(document.paths ?? {})[0];
	return path;
};
/**
* Resolves the HTTP method from a raw input value.
*
* When "default" is specified, returns the first valid HTTP method for the given path.
* This ensures we select a real method rather than metadata keys like "parameters" or "summary".
*/
var resolveMethod = (ctx, path, method) => {
	const document = getDocument(ctx);
	if (!document || !path) return;
	if (method === "default") {
		const pathItem = getResolvedPathItem(document.paths?.[path]);
		if (!pathItem) return;
		return Object.keys(pathItem).filter(isHttpMethod)[0];
	}
	return isHttpMethod(method) ? method : void 0;
};
/**
* Resolves the example name from a raw input value.
*
* When "default" is specified, returns the first available example name.
* Falls back to "default" when no examples exist, which signals to use the default request body.
*/
var resolveExampleName = (ctx, operation, exampleKey) => {
	if (!getDocument(ctx) || operation?.type !== "operation") return "default";
	const examples = operation.children?.filter(isExample) ?? [];
	const matchingExample = examples.find((child) => child.name === exampleKey);
	if (matchingExample) return matchingExample.name;
	if (exampleKey === "default") return examples[0]?.name ?? "default";
	return "default";
};
/**
* Resolves all route parameters from raw input values to their actual values.
*
* This function handles "default" placeholders by looking up actual values from the workspace store.
* It ensures the modal can be opened even when the caller does not know specific paths, methods, or examples.
*/
var resolveRouteParameters = (store, params) => {
	const documentSlug = resolveDocumentSlug(store, params.documentSlug);
	const ctx = {
		store,
		documentSlug
	};
	const path = resolvePath(ctx, params.path);
	const method = resolveMethod(ctx, path, params.method);
	const traversedDocument = getDocument(ctx)?.["x-scalar-navigation"];
	if (!traversedDocument) return {
		documentSlug,
		path,
		method,
		example: "default"
	};
	const operation = getOperationEntries(traversedDocument).get(`${path}|${method}`)?.find((entry) => entry.type === "operation");
	return {
		documentSlug,
		path,
		method,
		example: resolveExampleName(ctx, operation, params.example)
	};
};
//#endregion
export { resolveRouteParameters };

//# sourceMappingURL=resolve-route-parameters.js.map