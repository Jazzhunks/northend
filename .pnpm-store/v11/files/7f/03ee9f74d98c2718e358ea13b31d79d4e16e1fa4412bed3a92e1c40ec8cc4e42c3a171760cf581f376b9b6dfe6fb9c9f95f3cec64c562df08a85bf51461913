import { inject, provide, ref } from "vue";
//#region src/components/ScalarCard/useCardHeading.ts
/**
* Tracks the region heading id for card accessibility
*/
var CARD_Heading_SYMBOL = Symbol();
/**
* Set the region heading id for a ScalarCardHeader component.
*
* This should be called from ScalarCardHeader components.
*/
var useCardHeading = (id) => {
	const region = inject(CARD_Heading_SYMBOL, void 0);
	if (region) region.value = id;
};
/**
* Get the region heading id if set.
*
* This should be called from ScalarCard components.
*/
var useCardRegion = () => {
	const id = ref();
	provide(CARD_Heading_SYMBOL, id);
	return { id };
};
//#endregion
export { useCardHeading, useCardRegion };

//# sourceMappingURL=useCardHeading.js.map