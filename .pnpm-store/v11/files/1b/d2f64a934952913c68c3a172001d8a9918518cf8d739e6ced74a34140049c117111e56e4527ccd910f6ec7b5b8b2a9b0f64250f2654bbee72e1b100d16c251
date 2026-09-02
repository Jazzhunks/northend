import { parseMimeType } from "@scalar/helpers/http/mime-type";
//#region src/components/ResponseBody/helpers/process-response-body.ts
var decodeURIComponentSafe = (str) => {
	try {
		return decodeURIComponent(str);
	} catch {
		return str;
	}
};
function extractFilename(contentDisposition) {
	let filename = "";
	if (contentDisposition) {
		const fileNameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/)?.[1] ?? contentDisposition.match(/filename\s*=\s*"?([^";]+)"?/)?.[1];
		if (fileNameMatch) filename = decodeURIComponentSafe(fileNameMatch.trim());
	}
	return filename;
}
var isBlob = (b) => b instanceof Blob;
var getResponseHeaders = (headers) => {
	return headers ? Object.keys(headers).map((key) => ({
		name: key,
		value: headers[key] ?? ""
	})) : [];
};
function processResponseBody({ data, headers }) {
	const responseHeaders = getResponseHeaders(headers);
	const contentType = responseHeaders.find((header) => header.name.toLowerCase() === "content-type");
	const mimeType = contentType?.value ? parseMimeType(contentType.value) : void 0;
	return {
		mimeType,
		attachmentFilename: extractFilename(responseHeaders.find((header) => header.name.toLowerCase() === "content-disposition")?.value ?? ""),
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