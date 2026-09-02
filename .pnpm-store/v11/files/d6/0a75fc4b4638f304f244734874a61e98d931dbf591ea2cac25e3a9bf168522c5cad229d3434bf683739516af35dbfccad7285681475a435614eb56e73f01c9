import { watch } from "vue";
//#region src/v2/blocks/scalar-address-bar-block/hooks/use-path-masking.ts
/**
* Masks placeholder paths in an editable input (e.g. the address bar).
*
* Fires on the initial ready state and on every `operationKey` change. The
* consumer owns any content-aware guard needed before clearing visible text.
*/
var usePathMasking = ({ isReady, operationKey, shouldMask, onMask }) => {
	watch([isReady, operationKey], ([ready]) => {
		if (!ready) return;
		if (shouldMask()) onMask();
	}, { flush: "post" });
};
//#endregion
export { usePathMasking };

//# sourceMappingURL=use-path-masking.js.map