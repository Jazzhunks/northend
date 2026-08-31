import { authOptions } from "./auth-options.js";
import { getResolvedRef } from "@scalar/workspace-store/helpers/get-resolved-ref";
import { generateHash } from "@scalar/helpers/string/generate-hash";
//#region src/v2/blocks/scalar-auth-selector-block/helpers/security-scheme.ts
var requirementSignature = (requirement) => JSON.stringify(Object.keys(requirement));
/**
* Format a scheme object into a display object
*
* We also add a hash to the id to ensure it is unique across
* multiple requirements of the same scheme with different scopes
*/
var formatScheme = ({ name, value }) => ({
	id: generateHash(JSON.stringify(value)),
	label: name,
	value,
	isDeletable: true
});
/** Formats complex security schemes */
var formatComplexScheme = (scheme) => formatScheme({
	name: Object.keys(scheme).join(" & "),
	value: scheme
});
/**
* Formats a security requirement into a SecuritySchemeOption.
* Handles both simple (single key) and complex (multiple keys) auth schemes.
*/
var formatSecurityRequirement = (requirement, securitySchemes) => {
	const keys = Object.keys(requirement);
	if (keys.length > 1) return formatComplexScheme(requirement);
	if (keys[0]) {
		if (!getResolvedRef(securitySchemes[keys[0]])) return;
		return formatScheme({
			name: keys[0],
			value: requirement
		});
	}
};
/**
* Generates the options for the security scheme combobox
*
* Contains either a flat list, or different groups of required, available, and add new
*/
var getSecuritySchemeOptions = (security, securitySchemes, selectedSchemes, canAddNewAuth = false) => {
	const selectedByRequirement = new Map(selectedSchemes.map((selectedScheme) => [requirementSignature(selectedScheme), selectedScheme]));
	/**
	* Build required schemes formatted as options and track scheme names in a single pass.
	* We use names (not full IDs) because we want to exclude any scheme that is already
	* required, regardless of its specific scopes or hash.
	*/
	const { requiredFormatted, requiredSchemeNames, existingIds } = security.reduce((acc, requirement) => {
		const formatted = formatSecurityRequirement(selectedByRequirement.get(requirementSignature(requirement)) ?? requirement, securitySchemes);
		if (formatted) {
			acc.requiredFormatted.push(formatted);
			acc.existingIds.add(formatted.id);
		}
		for (const name of Object.keys(requirement)) acc.requiredSchemeNames.add(name);
		return acc;
	}, {
		requiredFormatted: [],
		requiredSchemeNames: /* @__PURE__ */ new Set(),
		existingIds: /* @__PURE__ */ new Set()
	});
	const availableFormatted = [];
	for (const [name, schemeRef] of Object.entries(securitySchemes)) {
		if (requiredSchemeNames.has(name)) continue;
		if (getResolvedRef(schemeRef)) {
			const formatted = formatScheme({
				name,
				value: { [name]: [] }
			});
			availableFormatted.push(formatted);
			existingIds.add(formatted.id);
		}
	}
	/**
	* Add selected schemes to available if they do not already exist
	* This ensures that selected schemes with specific scopes are always available as options
	*/
	for (const selectedScheme of selectedSchemes) {
		const formatted = formatSecurityRequirement(selectedScheme, securitySchemes);
		if (formatted && !existingIds.has(formatted.id)) {
			availableFormatted.push(formatted);
			existingIds.add(formatted.id);
		}
	}
	const options = [{
		label: "Required authentication",
		options: requiredFormatted
	}, {
		label: "Available authentication",
		options: availableFormatted
	}];
	if (!canAddNewAuth) return requiredFormatted.length ? options : availableFormatted;
	options.push({
		label: "Add new authentication",
		options: Object.entries(authOptions).map(([key, value]) => ({
			id: key,
			label: value.label,
			value: { [key]: [] },
			payload: value.payload,
			isDeletable: false
		}))
	});
	return options;
};
//#endregion
export { formatComplexScheme, formatScheme, getSecuritySchemeOptions };

//# sourceMappingURL=security-scheme.js.map