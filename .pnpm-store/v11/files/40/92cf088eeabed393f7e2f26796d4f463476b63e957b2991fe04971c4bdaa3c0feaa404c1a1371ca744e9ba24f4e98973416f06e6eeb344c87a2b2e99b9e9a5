//#region src/v2/blocks/response-block/helpers/parse-set-cookie.ts
/**
* Parse a Set-Cookie header value into name and value.
*
* Set-Cookie headers have the format: name=value; attribute1; attribute2=value2
* We extract just the cookie name and value (the part before the first semicolon).
*
* @param setCookieValue - The full Set-Cookie header value
* @returns Object with cookie name and value, or null if parsing fails
*
* @example
* parseSetCookie('sessionId=abc123; Path=/; HttpOnly')
* // Returns: { name: 'sessionId', value: 'abc123; Path=/; HttpOnly' }
*/
var parseSetCookie = (setCookieValue) => {
	if (!setCookieValue || typeof setCookieValue !== "string") return null;
	const firstEqualsIndex = setCookieValue.indexOf("=");
	if (firstEqualsIndex === -1) return null;
	const name = setCookieValue.substring(0, firstEqualsIndex).trim();
	const value = setCookieValue.substring(firstEqualsIndex + 1).trim();
	if (!name) return null;
	return {
		name,
		value
	};
};
//#endregion
export { parseSetCookie };

//# sourceMappingURL=parse-set-cookie.js.map