//#region src/v2/blocks/scalar-auth-selector-block/helpers/oauth-callback.ts
/**
* Splits an OAuth redirect URL into query and hash parameters.
*
* OAuth providers are inconsistent about where they return callback data:
* authorization-code flows usually use the query string, while implicit flows
* commonly use the URL fragment. Keeping both sets separate lets callers decide
* which source should win when a provider sends duplicate keys.
*/
var getOAuthCallbackParams = (callbackUrl) => {
	const parsedUrl = new URL(callbackUrl);
	return {
		searchParams: parsedUrl.searchParams,
		hashParams: new URLSearchParams(parsedUrl.hash.slice(1))
	};
};
/**
* Reads a callback parameter and returns the URL component it came from.
*
* OAuth state must be validated from the same component as the credential
* (`code` or `access_token`) so mixed query/hash callbacks cannot pair a
* trusted state with an untrusted credential.
*/
var getOAuthCallbackParamWithSource = (searchParams, hashParams, paramName) => {
	const searchValue = searchParams.get(paramName);
	if (searchValue !== null) return {
		params: searchParams,
		value: searchValue
	};
	const hashValue = hashParams.get(paramName);
	if (hashValue !== null) return {
		params: hashParams,
		value: hashValue
	};
	return {
		params: null,
		value: null
	};
};
/**
* Safely reads the OAuth popup callback data.
*
* Accessing the popup URL can throw while it is still on another origin, so
* callers get null values until the popup returns to a readable callback URL.
*/
var getOAuthCallbackData = (getCallbackUrl, tokenName = "access_token") => {
	try {
		const { searchParams, hashParams } = getOAuthCallbackParams(getCallbackUrl());
		const accessTokenResult = getOAuthCallbackParamWithSource(searchParams, hashParams, tokenName);
		const codeResult = getOAuthCallbackParamWithSource(searchParams, hashParams, "code");
		return {
			accessToken: accessTokenResult.value,
			accessTokenParams: accessTokenResult.params,
			code: codeResult.value,
			codeParams: codeResult.params,
			error: searchParams.get("error") ?? hashParams.get("error"),
			errorDescription: searchParams.get("error_description") ?? hashParams.get("error_description"),
			refreshToken: searchParams.get("refresh_token") ?? hashParams.get("refresh_token")
		};
	} catch (_e) {
		return {
			accessToken: null,
			accessTokenParams: null,
			code: null,
			codeParams: null,
			error: null,
			errorDescription: null,
			refreshToken: null
		};
	}
};
//#endregion
export { getOAuthCallbackData };

//# sourceMappingURL=oauth-callback.js.map