//#region src/v2/blocks/request-block/helpers/validate-parameter.ts
/**
* Checks if the value of a example parameter is the expected type or format
*/
var validateParameter = (schema, value) => {
	if (!schema || !("type" in schema) || typeof value !== "string") return { ok: true };
	if (schema.type === "integer" || schema.type === "number") {
		const numberValue = Number(value);
		if (isNaN(numberValue)) return {
			ok: false,
			message: "Value must be a number (e.g., 42.5)"
		};
		if (schema.type === "integer" && !Number.isInteger(numberValue)) return {
			ok: false,
			message: "Value must be a whole number (e.g., 42)"
		};
		if (schema.minimum !== void 0 && numberValue < schema.minimum) return {
			ok: false,
			message: `Value must be ${schema.minimum} or greater`
		};
		if (schema.maximum !== void 0 && numberValue > schema.maximum) return {
			ok: false,
			message: `Value must be ${schema.maximum} or less`
		};
	}
	if (schema.type === "string" && schema.format) {
		if (schema.format === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return {
			ok: false,
			message: "Please enter a valid date in YYYY-MM-DD format (e.g., 2024-03-20)"
		};
		if (schema.format === "date-time" && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(value ?? "")) return {
			ok: false,
			message: "Please enter a valid date and time in RFC 3339 format (e.g., 2024-03-20T13:45:30Z)"
		};
		if (schema.format === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value ?? "")) return {
			ok: false,
			message: "Please enter a valid email address (e.g., user@example.com)"
		};
		if (schema.format === "uri" && !/^[a-zA-Z][a-zA-Z0-9+.-]*:.+$/.test(value ?? "")) return {
			ok: false,
			message: "Please enter a valid URI (e.g., https://example.com)"
		};
	}
	return { ok: true };
};
//#endregion
export { validateParameter };

//# sourceMappingURL=validate-parameter.js.map