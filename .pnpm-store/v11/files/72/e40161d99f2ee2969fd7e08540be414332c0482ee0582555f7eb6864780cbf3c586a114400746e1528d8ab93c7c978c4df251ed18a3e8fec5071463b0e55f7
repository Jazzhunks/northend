import { inject, provide } from "vue";
//#region src/components/ScalarForm/useFormGroups.ts
/**
* Tells a ScalarFormInput component that it is in a form group.
*/
var FORM_GROUP_SYMBOL = Symbol();
/**
* Check if we're in a form group.
*
* This is called from ScalarFormInput components.
*/
var useFormGroupInput = () => {
	return inject(FORM_GROUP_SYMBOL, false);
};
/**
* Set that this is a form group.
*
* This is called from ScalarFormInputGroup components.
*/
var useFormGroup = () => {
	provide(FORM_GROUP_SYMBOL, true);
};
//#endregion
export { useFormGroup, useFormGroupInput };

//# sourceMappingURL=useFormGroups.js.map