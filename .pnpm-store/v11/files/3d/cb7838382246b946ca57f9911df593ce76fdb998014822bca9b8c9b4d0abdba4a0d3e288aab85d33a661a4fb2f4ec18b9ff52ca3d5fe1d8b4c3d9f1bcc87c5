import { object, optional, record, string } from "@scalar/validation";
//#region src/entities/tools/execute-request.ts
var EXECUTE_CLIENT_SIDE_REQUEST_TOOL_NAME = "execute-request";
var executeClientSideRequestToolInputSchema = object({
	method: string(),
	path: string(),
	headers: optional(record(string(), string())),
	body: optional(string()),
	documentName: string(),
	documentIdentifier: string({ typeComment: "Needed for legacy support for old clients" })
});
//#endregion
export { EXECUTE_CLIENT_SIDE_REQUEST_TOOL_NAME, executeClientSideRequestToolInputSchema };

//# sourceMappingURL=execute-request.js.map