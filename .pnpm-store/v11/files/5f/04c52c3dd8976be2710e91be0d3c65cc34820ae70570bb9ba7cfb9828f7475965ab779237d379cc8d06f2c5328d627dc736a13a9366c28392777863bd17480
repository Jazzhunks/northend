import { applyEdits, format } from "jsonc-parser";
//#region src/v2/blocks/response-block/helpers/prettify-jsonc-string.ts
var jsoncFormatOptions = {
	tabSize: 2,
	insertSpaces: true,
	eol: "\n"
};
/**
* Pretty-print JSON/JSONC for preview without round-tripping through JSON.parse,
* so digit sequences in large integers stay exact in the string.
*/
function prettifyJsoncString(content) {
	try {
		const edits = format(content, void 0, jsoncFormatOptions);
		if (edits.length > 0) return applyEdits(content, edits);
	} catch {}
	return content;
}
//#endregion
export { prettifyJsoncString };

//# sourceMappingURL=prettify-jsonc-string.js.map