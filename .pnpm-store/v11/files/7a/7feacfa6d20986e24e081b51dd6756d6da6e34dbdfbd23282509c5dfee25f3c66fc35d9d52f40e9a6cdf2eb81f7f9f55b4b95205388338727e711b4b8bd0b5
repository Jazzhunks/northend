//#region src/v2/blocks/scalar-address-bar-block/helpers/is-placeholder-path.ts
/**
* Matches auto-generated temp paths produced by `createTempOperation`.
*
* Temp paths look like `/_scalar_temp<hex>` (e.g. `/_scalar_temp1a2b3c4d`) —
* the suffix is a truncated UUID, which is always hex. The namespaced prefix
* avoids colliding with any real user-authored path.
*/
var TEMP_PATH_PATTERN = /^\/_scalar_temp[a-f0-9]*$/i;
/**
* Returns true when the given path is a placeholder that should be hidden
* from the user. Two cases qualify:
*
* 1. Drafts documents viewing the root path `/` (a new, empty draft).
* 2. Auto-generated temp paths created when the user adds a new operation.
*
* In both cases the path is an implementation detail rather than something
* the user authored, so the UI masks it by focusing the address bar and
* clearing the visible text.
*/
var isPlaceholderPath = (path, documentSlug) => {
	if (documentSlug.toLowerCase() === "drafts" && path === "/") return true;
	return TEMP_PATH_PATTERN.test(path);
};
//#endregion
export { isPlaceholderPath };

//# sourceMappingURL=is-placeholder-path.js.map