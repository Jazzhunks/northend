import { formatBytes } from "@scalar/helpers/formatters/format-bytes";
//#region src/v2/blocks/response-block/helpers/get-content-length.ts
/** Extract content length from headers */
var getContentLength = (response) => {
	const contentLength = Number.parseInt(response.headers?.["Content-Length"] || response.headers?.["content-length"] || "0", 10);
	if (isNaN(contentLength) || contentLength <= 0) return;
	return formatBytes(contentLength);
};
//#endregion
export { getContentLength };

//# sourceMappingURL=get-content-length.js.map