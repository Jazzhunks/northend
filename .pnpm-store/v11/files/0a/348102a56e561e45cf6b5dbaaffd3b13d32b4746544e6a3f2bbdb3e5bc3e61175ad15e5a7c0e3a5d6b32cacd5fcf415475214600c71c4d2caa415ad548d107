//#region src/v2/blocks/response-block/helpers/extract-filename.ts
/**
* Safely decode a URI component, returning the original string if decoding fails
*/
var decodeURIComponentSafe = (str) => {
	try {
		return decodeURIComponent(str);
	} catch {
		return str;
	}
};
/**
* Extract the filename from a content disposition header
*/
function extractFilename(contentDisposition) {
	let filename = "";
	if (contentDisposition) {
		const fileNameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/)?.[1] ?? contentDisposition.match(/filename\s*=\s*"?([^";]+)"?/)?.[1];
		if (fileNameMatch) filename = decodeURIComponentSafe(fileNameMatch.trim());
	}
	return filename;
}
//#endregion
export { extractFilename };

//# sourceMappingURL=extract-filename.js.map