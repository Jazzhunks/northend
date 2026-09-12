import { getResolvedRef } from "@scalar/workspace-store/helpers/get-resolved-ref";
import { isNonOptionalSecurityRequirement } from "@scalar/workspace-store/helpers/is-non-optional-security-requirement";
//#region src/features/Operation/helpers/get-required-security.ts
/**
* Determine whether an operation requires authentication, using `operation.security ?? document.security`
* as the source of truth. Operation-level `security` fully overrides document-level — including `security: []`,
* which explicitly opts the operation out of auth.
*
* OpenAPI encodes "auth is optional" by including an empty requirement object `{}`. Whenever `{}`
* appears — whether alongside real requirements or as the only entry — auth is treated as optional (state: 'optional').
*/
var getRequiredSecurity = (operation, document) => {
	const securityList = operation?.security ?? document.security ?? [];
	const definedSchemes = document.components?.securitySchemes ?? {};
	let hasEmpty = false;
	const groups = [];
	for (const requirement of securityList) {
		if (!isNonOptionalSecurityRequirement(requirement)) {
			hasEmpty = true;
			continue;
		}
		const schemes = Object.entries(requirement).map(([name, scopes]) => ({
			name,
			scheme: getResolvedRef(definedSchemes[name]),
			scopes: scopes.filter((s) => s.length > 0)
		}));
		if (schemes.length > 0) groups.push({ schemes });
	}
	if (groups.length === 0) return {
		state: hasEmpty ? "optional" : "none",
		requirements: []
	};
	return {
		state: hasEmpty ? "optional" : "required",
		requirements: groups
	};
};
//#endregion
export { getRequiredSecurity };

//# sourceMappingURL=get-required-security.js.map