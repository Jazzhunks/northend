//#region src/v2/blocks/request-block/helpers/group-by.ts
/**
* Group together array objects by a specific key
*/
var groupBy = (arr, key, transform) => {
	return arr.reduce((acc, obj) => {
		const transformedItem = transform ? transform(obj) : obj;
		(acc[obj[key]] ??= []).push(transformedItem);
		return acc;
	}, {});
};
//#endregion
export { groupBy };

//# sourceMappingURL=group-by.js.map