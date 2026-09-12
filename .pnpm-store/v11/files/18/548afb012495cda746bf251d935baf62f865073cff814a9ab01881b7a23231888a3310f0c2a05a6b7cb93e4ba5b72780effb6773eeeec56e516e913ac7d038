import { createError } from "../entities/error/helpers.js";
import { EXECUTE_CLIENT_SIDE_REQUEST_TOOL_NAME } from "../entities/tools/execute-request.js";
import { n } from "neverpanic";
import { redirectToProxy } from "@scalar/helpers/url/redirect-to-proxy";
import { buildRequestSecurity, getResolvedUrl } from "@scalar/workspace-store/request-example";
import { encode } from "js-base64";
import truncateJson from "truncate-json";
//#region src/client-tools/execute-request.ts
var MAX_RESPONSE_SIZE = 5e4;
var getBody = n.safeFn(async (response) => {
	if (response.headers.get("content-type") === "application/json") return {
		success: true,
		data: await response.json()
	};
	return {
		success: true,
		data: await response.text()
	};
}, (originalError) => createError("FAILED_TO_PARSE_RESPONSE_BODY", { originalError }));
var truncateResponse = (response) => JSON.parse(truncateJson(JSON.stringify(response), MAX_RESPONSE_SIZE).jsonString);
var safeFetch = n.safeFn(async (url, init) => {
	const response = await fetch(url, init);
	const responseBodyResult = await getBody(response);
	if (!response.ok) return {
		success: false,
		error: createError("REQUEST_NOT_OK", {
			status: response.status,
			url: response.url,
			responseBody: truncateResponse(responseBodyResult.success ? responseBodyResult.data : void 0),
			headers: Object.fromEntries(response.headers.entries())
		})
	};
	if (!responseBodyResult.success) return responseBodyResult;
	return {
		success: true,
		data: {
			status: response.status,
			responseBody: truncateResponse(responseBodyResult.data),
			headers: Object.fromEntries(response.headers.entries())
		}
	};
}, (originalError) => createError("FAILED_TO_FETCH", { originalError }));
function createUrl({ path, activeServer, proxyUrl, queryParams }) {
	return redirectToProxy(proxyUrl, getResolvedUrl({
		path,
		server: activeServer,
		urlParams: queryParams
	}));
}
/**
* Executes an HTTP request with the specified options, including method, path, headers, and security schemes, and returns the processed response.
*/
var executeRequestTool = n.safeFn(async ({ documentSettings, toolCallId, chat, proxyUrl, input: { method, path, body, headers, documentName } }) => {
	const settings = documentSettings[documentName];
	if (!settings) return {
		success: false,
		error: createError("DOCUMENT_SETTINGS_COULD_NOT_BE_DETERMINED", { documentName })
	};
	const requestSecurity = buildRequestSecurity(settings.securitySchemes).reduce((acc, securityOption) => {
		/** Format the security value based on its authentication scheme. */
		const securityValue = (() => {
			if (securityOption.format === "basic") return `Basic ${encode(securityOption.value)}`;
			if (securityOption.format === "bearer") return `Bearer ${securityOption.value}`;
			return securityOption.value;
		})();
		if (securityOption.in === "header") acc.headers[securityOption.name] = securityValue;
		else if (securityOption.in === "query") acc.queryParams.set(securityOption.name, securityValue);
		else if (securityOption.in === "cookie") acc.cookies[securityOption.name] = securityValue;
		return acc;
	}, {
		headers: {},
		queryParams: new URLSearchParams(),
		cookies: {}
	});
	const cookieHeader = Object.entries(requestSecurity.cookies).map(([name, value]) => `${name}=${value}`).join("; ");
	const fetchOptions = {
		method,
		body,
		headers: {
			...headers,
			...requestSecurity.headers,
			Cookie: cookieHeader
		}
	};
	const result = await safeFetch(createUrl({
		path,
		activeServer: settings.activeServer,
		proxyUrl,
		queryParams: requestSecurity.queryParams
	}), fetchOptions);
	chat.addToolOutput({
		tool: EXECUTE_CLIENT_SIDE_REQUEST_TOOL_NAME,
		toolCallId,
		output: result,
		state: "output-available"
	});
	return result;
}, (originalError) => createError("FAILED_TO_EXECUTE_REQUEST", originalError));
//#endregion
export { executeRequestTool };

//# sourceMappingURL=execute-request.js.map