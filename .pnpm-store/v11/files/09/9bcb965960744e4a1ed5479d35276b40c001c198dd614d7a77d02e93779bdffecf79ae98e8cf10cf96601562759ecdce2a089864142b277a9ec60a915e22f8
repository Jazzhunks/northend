import { getResolvedRef } from "@scalar/workspace-store/helpers/get-resolved-ref";
import { isObjectSchema } from "@scalar/workspace-store/schemas/v3.1/strict/type-guards";
//#region src/helpers/openapi.ts
var isSchemaObject = (value) => typeof value === "object" && value !== null;
/**
* Resolves a schema reference from workspace-store to a SchemaObject.
* Returns undefined when a reference exists but has not been resolved yet.
*/
function resolveSchemaRef(ref) {
	if (typeof ref === "object" && ref !== null && "$ref" in ref) return isSchemaObject(ref["$ref-value"]) ? ref["$ref-value"] : void 0;
	return ref;
}
function pushUnique(target, value) {
	if (!value) return;
	if (!target.includes(value)) target.push(value);
}
/**
* Recursively visits every property of a schema, descending transparently through composition
* keywords (`oneOf`, `anyOf`, `allOf`) and one level into nested object properties.
*
* Composition is treated as transparent — a `oneOf` of two object variants is *the same level* as a
* single object, just expressed as multiple shapes. Property nesting is capped to keep the index
* focused on shallow, commonly-searched fields. A visited-set keyed by resolved-schema identity
* guards against recursive (`Tree → Tree`) schemas.
*/
function collectSchemaProperties(schema, options, propertyDepth = 0) {
	if (!schema || options.visited.has(schema)) return;
	options.visited.add(schema);
	[
		...schema.oneOf ?? [],
		...schema.anyOf ?? [],
		...schema.allOf ?? []
	].forEach((variantRef) => {
		collectSchemaProperties(resolveSchemaRef(variantRef), options, propertyDepth);
	});
	if (isObjectSchema(schema) && schema.properties) Object.entries(schema.properties).forEach(([key, propRef]) => {
		const property = resolveSchemaRef(propRef);
		options.visit(key, property);
		if (propertyDepth + 1 < options.maxPropertyDepth) collectSchemaProperties(property, options, propertyDepth + 1);
	});
}
/**
* Walks the request body schemas of an operation and yields each property schema with its key.
*/
function forEachRequestBodyProperty(operation, visit) {
	const content = getResolvedRef(operation?.requestBody)?.content;
	if (!content) return;
	const visited = /* @__PURE__ */ new Set();
	Object.values(content).forEach((media) => {
		collectSchemaProperties(getResolvedRef(getResolvedRef(media)?.schema), {
			visit,
			visited,
			maxPropertyDepth: 2
		});
	});
}
/**
* Extracts the names of every parameter on an operation.
*
* The returned strings contain only parameter names (e.g. `userId`, `limit`) so they can be indexed
* as a high-signal field for search. Filter-style metadata like `REQUIRED`, `optional`, `query` and
* the schema type are intentionally excluded — those tokens dilute fuzzy matches and produce false
* positives for queries like `query` or `integer`.
*/
function extractParameterNames(parameters) {
	const names = [];
	parameters.forEach((parameter) => {
		pushUnique(names, getResolvedRef(parameter)?.name);
	});
	return names;
}
/**
* Extracts the descriptions of every parameter on an operation.
*
* Kept separate from parameter names so the search index can weight each independently.
*/
function extractParameterDescriptions(parameters) {
	const descriptions = [];
	parameters.forEach((parameter) => {
		pushUnique(descriptions, getResolvedRef(parameter)?.description);
	});
	return descriptions;
}
/**
* Extracts the names of properties from the request body schema(s) of an operation.
*
* Walks every media type and includes both top-level and one level of nested property names so
* common fields like `email` or `username` surface in search regardless of how the body is shaped.
*/
function extractBodyFieldNames(operation) {
	const names = [];
	forEachRequestBodyProperty(operation, (key) => {
		pushUnique(names, key);
	});
	return names;
}
/**
* Extracts the descriptions of properties from the request body schema(s) of an operation.
*/
function extractBodyDescriptions(operation) {
	const descriptions = [];
	forEachRequestBodyProperty(operation, (_key, schema) => {
		if (schema && "description" in schema && typeof schema.description === "string") pushUnique(descriptions, schema.description);
	});
	return descriptions;
}
/**
* Extracts the property names of a schema for the search index.
*
* Same depth and composition behavior as `extractBodyFieldNames` — descends transparently through
* `oneOf`/`anyOf`/`allOf`, walks one level into nested object properties, dedupes.
*/
function extractSchemaFieldNames(schema) {
	const names = [];
	collectSchemaProperties(schema, {
		visit: (key) => pushUnique(names, key),
		visited: /* @__PURE__ */ new Set(),
		maxPropertyDepth: 2
	});
	return names;
}
/**
* Extracts the property descriptions of a schema for the search index.
*/
function extractSchemaDescriptions(schema) {
	const descriptions = [];
	collectSchemaProperties(schema, {
		visit: (_key, propertySchema) => {
			if (propertySchema && "description" in propertySchema && typeof propertySchema.description === "string") pushUnique(descriptions, propertySchema.description);
		},
		visited: /* @__PURE__ */ new Set(),
		maxPropertyDepth: 2
	});
	return descriptions;
}
/**
* Deep merge for objects
*/
function deepMerge(source, target) {
	for (const [key, val] of Object.entries(source)) if (val !== null && typeof val === "object") {
		target[key] ??= new val.__proto__.constructor();
		deepMerge(val, target[key]);
	} else if (typeof val !== "undefined") target[key] = val;
	return target;
}
/**
* Creates an empty specification object.
* The returning object has the same structure as a valid OpenAPI specification, but everything is empty.
*/
function createEmptySpecification(partialSpecification) {
	const emptySpecification = {
		openapi: "3.1.0",
		info: {
			title: "",
			description: "",
			termsOfService: "",
			version: "",
			license: {
				name: "",
				url: ""
			},
			contact: { email: "" }
		},
		servers: [],
		tags: [],
		"x-scalar-original-document-hash": ""
	};
	if (!partialSpecification) return emptySpecification;
	deepMerge(partialSpecification, emptySpecification);
	return emptySpecification;
}
//#endregion
export { createEmptySpecification, extractBodyDescriptions, extractBodyFieldNames, extractParameterDescriptions, extractParameterNames, extractSchemaDescriptions, extractSchemaFieldNames };

//# sourceMappingURL=openapi.js.map