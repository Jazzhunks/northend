//#region src/v2/blocks/operation-block/helpers/get-cookie-header-keys.ts
/**
* Safely extract cookie header keys from response headers.
* Modern browsers support getSetCookie() which returns an array of Set-Cookie values.
*
* Note: Set-Cookie headers are often hidden from JavaScript due to security restrictions.
* The browser's network tab may show Set-Cookie headers that are not accessible via the
* Fetch API Headers object. This is intentional browser behavior to prevent JavaScript
* from accessing HttpOnly cookies and other sensitive cookie data.
*
* @see https://developer.mozilla.org/en-US/docs/Web/API/Headers/getSetCookie
*
* @param headers - The response headers object
* @returns Array of cookie header keys or empty array if not supported or restricted
*/
var getCookieHeaderKeys = (headers) => {
	return "getSetCookie" in headers && typeof headers.getSetCookie === "function" ? headers.getSetCookie() : [];
};
//#endregion
export { getCookieHeaderKeys };

//# sourceMappingURL=get-cookie-header-keys.js.map