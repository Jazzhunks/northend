import { getParameterContentValue } from "./get-parameter-content.js";
import { getResolvedRef } from "@scalar/workspace-store/helpers/get-resolved-ref";
//#region src/v2/blocks/request-block/helpers/get-parameter-schema.ts
/**
* Extract the schema from the parameter object
*/
var getParameterSchema = (parameter) => {
	if ("schema" in parameter && parameter.schema) return getResolvedRef(parameter.schema);
	return getResolvedRef(getParameterContentValue(parameter)?.schema);
};
//#endregion
export { getParameterSchema };

//# sourceMappingURL=get-parameter-schema.js.map