import { coerceValue } from "@scalar/workspace-store/schemas/typebox-coerce";
import { OpenIDConnectSchema } from "@scalar/workspace-store/entities/auth";
//#region src/v2/blocks/scalar-auth-selector-block/helpers/openid-discovery-to-flows.ts
/** Takes in an open ID Connect discovery response and converts it into an oauth flow to be used for authorization */
var openIDDiscoveryToFlows = (discovery) => {
	const scopes = Object.fromEntries((discovery.scopes_supported ?? []).map((scope) => [scope, ""]));
	const grantTypes = new Set(discovery.grant_types_supported ?? ["authorization_code", "implicit"]);
	const authorizationUrl = discovery.authorization_endpoint;
	const tokenUrl = discovery.token_endpoint;
	const usePkce = discovery.code_challenge_methods_supported?.includes("S256") ? "SHA-256" : discovery.code_challenge_methods_supported?.includes("plain") ? "plain" : "no";
	const flows = {};
	if (grantTypes.has("implicit") && authorizationUrl) flows.implicit = {
		authorizationUrl,
		refreshUrl: authorizationUrl,
		scopes
	};
	if (grantTypes.has("password") && tokenUrl) flows.password = {
		tokenUrl,
		refreshUrl: tokenUrl,
		scopes
	};
	if (grantTypes.has("client_credentials") && tokenUrl) flows.clientCredentials = {
		tokenUrl,
		refreshUrl: tokenUrl,
		scopes
	};
	if (grantTypes.has("authorization_code") && authorizationUrl && tokenUrl) flows.authorizationCode = {
		authorizationUrl,
		tokenUrl,
		refreshUrl: tokenUrl,
		"x-usePkce": usePkce,
		scopes
	};
	return coerceValue(OpenIDConnectSchema, flows);
};
//#endregion
export { openIDDiscoveryToFlows };

//# sourceMappingURL=openid-discovery-to-flows.js.map