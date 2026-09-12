import { parseMimeType } from "@scalar/helpers/http/mime-type";
/**
* Resolve the response content type with a consistent fallback.
*/
var resolveResponseContentType = (contentType) => contentType ?? "text/plain;charset=UTF-8";
/**
* Parse the effective response MIME type using the fallback content type.
*/
var resolveResponseMimeType = (contentType) => parseMimeType(resolveResponseContentType(contentType));
//#endregion
export { resolveResponseContentType, resolveResponseMimeType };

//# sourceMappingURL=resolve-response-content-type.js.map