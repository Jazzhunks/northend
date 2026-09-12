//#region src/v2/blocks/response-block/helpers/resolve-response-body-handler.ts
/**
* Find the first plugin response body handler that matches a given MIME type.
* Plugins are checked in order — first match wins, allowing users to override native behavior.
*
* Matching supports:
* - Exact match: "application/msgpack"
* - Suffix wildcard: "application/vnd.*+json" matches "application/vnd.api+json"
*/
var resolveResponseBodyHandler = (mimeType, plugins) => {
	for (const plugin of plugins) {
		if (!plugin.responseBody) continue;
		for (const handler of plugin.responseBody) if (matchesMimeType(mimeType, handler.mimeTypes)) return handler;
	}
};
/**
* Checks if the given MIME type matches any of the provided MIME type patterns.
* Supports both exact match (e.g. "application/json") and wildcard patterns (e.g. "application/*", "application/vnd.*+json").
*
* Example:
*   matchesMimeType('application/json', ['application/*'])           // true
*   matchesMimeType('application/vnd.api+json', ['application/vnd.*+json']) // true
*   matchesMimeType('text/plain', ['application/json'])              // false
*
* @param actual - The MIME type to match (e.g., "application/json")
* @param patterns - List of patterns that may include wildcards (e.g., ["application/*", "text/*"])
* @returns true if actual matches any pattern; false otherwise
*/
var matchesMimeType = (actual, patterns) => {
	const normalized = actual.toLowerCase();
	for (const pattern of patterns) {
		const normalizedPattern = pattern.toLowerCase();
		if (normalizedPattern === normalized) return true;
		if (normalizedPattern.includes("*")) {
			const escaped = normalizedPattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
			if (new RegExp(`^${escaped}$`).test(normalized)) return true;
		}
	}
	return false;
};
//#endregion
export { resolveResponseBodyHandler };

//# sourceMappingURL=resolve-response-body-handler.js.map