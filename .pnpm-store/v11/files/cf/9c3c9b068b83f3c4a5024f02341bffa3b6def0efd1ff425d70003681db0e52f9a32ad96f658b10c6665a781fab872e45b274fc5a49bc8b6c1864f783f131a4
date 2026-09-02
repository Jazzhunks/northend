//#region src/v2/blocks/scalar-auth-selector-block/helpers/resolve-default-oauth2-redirect-url.ts
/**
* Resolve the default OAuth2 redirect URI.
*
* Priority:
* 1. Explicit oauth2RedirectUri config override.
* 2. Empty string in non-browser and file:// contexts.
* 3. Browser origin + pathname fallback.
*/
var resolveDefaultOAuth2RedirectUri = (config) => {
	if (config.oauth2RedirectUri) return config.oauth2RedirectUri;
	if (typeof window === "undefined" || window.location.protocol === "file:") return "";
	return window.location.origin + window.location.pathname;
};
//#endregion
export { resolveDefaultOAuth2RedirectUri };

//# sourceMappingURL=resolve-default-oauth2-redirect-url.js.map