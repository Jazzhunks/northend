import { isTextMediaType } from "../../response-block/helpers/media-types.js";
import { parseMimeType } from "@scalar/helpers/http/mime-type";
//#region src/v2/blocks/operation-block/helpers/decode-buffer.ts
/**
* Decode the buffer according to its content-type.
* When a plugin handler with a custom `decode` function is provided, it takes priority
* over the default text/binary decoding.
*
* @returns The decoded string or Blob
*/
var decodeBuffer = async (buffer, contentType, pluginHandler) => {
	const mimeType = parseMimeType(contentType);
	if (pluginHandler?.decode) return await pluginHandler.decode(buffer, contentType);
	if (isTextMediaType(mimeType.essence)) return new TextDecoder(mimeType.parameters.get("charset")).decode(buffer);
	return new Blob([buffer], { type: mimeType.essence });
};
//#endregion
export { decodeBuffer };

//# sourceMappingURL=decode-buffer.js.map