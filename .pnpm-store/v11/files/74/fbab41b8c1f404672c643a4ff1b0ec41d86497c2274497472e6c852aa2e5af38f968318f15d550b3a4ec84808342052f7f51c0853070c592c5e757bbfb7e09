//#region src/v2/blocks/operation-block/helpers/har-to-fetch-request.ts
/**
* Converts a HAR (HTTP Archive) Request to a RequestPayload [url, RequestInit] tuple for use with fetch().
*
* This function is the reverse of fetchRequestToHar - it takes a HAR request
* and converts it into a [url, RequestInit] tuple that maps directly to the fetch() argument list.
*
* The conversion handles:
* - Request method and URL reconstruction
* - Headers reconstruction from HAR headers array
* - Cookies conversion to Cookie header
* - Form data (params) conversion to FormData or URLSearchParams
* - Body decoding
* - Content-Type and other header restoration
* - Query parameters (already embedded in the URL)
*
* Use cases:
* - Replaying recorded HTTP requests
* - Creating mock requests from HAR files
* - Testing with fixtures
* - Request caching and restoration
* - Re-executing historical API calls
*
* Note: Query parameters are expected to be already part of the URL in the HAR.
*
* @see https://w3c.github.io/web-performance/specs/HAR/Overview.html
* @see https://developer.mozilla.org/en-US/docs/Web/API/fetch
*
* @example
* const harRequest = { method: 'POST', url: 'https://api.example.com', ... }
* const [url, init] = harToFetchRequest({ harRequest })
* const response = await fetch(url, init)
*/
var harToFetchRequest = ({ harRequest }) => {
	const headers = buildHeaders(harRequest);
	const body = buildBody(harRequest.postData);
	return [harRequest.url, {
		method: harRequest.method,
		headers,
		body
	}];
};
/**
* Builds Headers object from HAR request headers and cookies.
*/
var buildHeaders = (harRequest) => {
	const headers = new Headers();
	harRequest.headers.forEach(({ name, value }) => {
		headers.append(name, value);
	});
	if (harRequest.cookies?.length) {
		const cookieString = harRequest.cookies.map(({ name, value }) => `${name}=${value}`).join("; ");
		headers.append("Cookie", cookieString);
	}
	return headers;
};
/**
* Builds request body from HAR postData.
* Returns FormData for multipart forms, URLSearchParams for URL-encoded forms,
* or encoded text for other content types.
*/
var buildBody = (postData) => {
	if (!postData) return null;
	const { params, text, mimeType } = postData;
	if (params?.length) {
		const form = mimeType?.includes("multipart/form-data") ? new FormData() : new URLSearchParams();
		params.forEach(({ name, value }) => {
			form.append(name, value || "");
		});
		return form;
	}
	if (text) return new TextEncoder().encode(text);
	return null;
};
//#endregion
export { harToFetchRequest };

//# sourceMappingURL=har-to-fetch-request.js.map