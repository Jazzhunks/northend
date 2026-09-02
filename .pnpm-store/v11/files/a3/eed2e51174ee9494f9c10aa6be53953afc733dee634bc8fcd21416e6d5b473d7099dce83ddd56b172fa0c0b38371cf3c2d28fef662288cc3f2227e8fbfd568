//#region src/v2/blocks/request-block/helpers/get-parameter-content.ts
/**
* Extract content value from parameter object
*
* Parameters MUST only have one specified content key
*/
var getParameterContentValue = (parameter) => {
	if ("content" in parameter && parameter.content) {
		const keys = Object.keys(parameter.content);
		if (keys.length !== 1) return;
		return parameter.content[keys[0]];
	}
};
//#endregion
export { getParameterContentValue };

//# sourceMappingURL=get-parameter-content.js.map