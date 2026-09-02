import { resolveResponseMimeType } from "./resolve-response-content-type.js";
import { extractFilename } from "./extract-filename.js";
//#region src/v2/blocks/response-block/helpers/process-response-body.ts
var isBlob = (b) => b instanceof Blob;
/**
* Processes the response body of an HTTP request.
* Extracts MIME type, attachment filename, and generates a data URL.
*/
function processResponseBody({ data, headers }) {
	const mimeType = resolveResponseMimeType(headers.find((header) => header.name.toLowerCase() === "content-type")?.value);
	return {
		mimeType,
		attachmentFilename: extractFilename(headers.find((header) => header.name.toLowerCase() === "content-disposition")?.value ?? ""),
		dataUrl: (() => {
			if (isBlob(data)) return URL.createObjectURL(data);
			if (typeof data === "string") return URL.createObjectURL(new Blob([data], { type: mimeType ? mimeType.toString() : void 0 }));
			if (data instanceof Object && Object.keys(data).length) return URL.createObjectURL(new Blob([JSON.stringify(data)], { type: mimeType ? mimeType.toString() : void 0 }));
			return "";
		})()
	};
}
//#endregion
export { processResponseBody };

//# sourceMappingURL=process-response-body.js.map