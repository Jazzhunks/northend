import { isDefined } from "@scalar/helpers/array/is-defined";
//#region src/v2/blocks/operation-block/helpers/response-cache.ts
/**
* In-memory cache of operation example id → { response, request }.
* Restores the last response when navigating back to an operation until
* the user refreshes the page or makes a new request.
*/
var responseCache = /* @__PURE__ */ new Map();
/**
* Constructs a unique cache key for a specific operation/example.
* The key is composed of the HTTP method, request path, and the example key,
* delimited by "|", e.g. "GET|/pets|123".
*
* @param method - HTTP method (e.g., "GET", "POST")
* @param path - The request path (e.g., "/pets")
* @param exampleKey - A unique key identifying the example/request variant
* @param documentSlug - Optionally add the document slug to the key
* @returns The constructed cache key string
*/
function getOperationExampleKey(method, path, exampleKey, documentSlug) {
	return [
		documentSlug,
		method,
		path,
		exampleKey
	].filter(isDefined).join("|");
}
/**
* Determines if a response is a streaming response (e.g., server-sent events).
* Assumes streaming responses include a 'reader' property.
*
* @param response - The response instance to check
* @returns True if response is streaming, otherwise false
*/
function isStreamingResponse(response) {
	return "reader" in response;
}
//#endregion
export { getOperationExampleKey, isStreamingResponse, responseCache };

//# sourceMappingURL=response-cache.js.map