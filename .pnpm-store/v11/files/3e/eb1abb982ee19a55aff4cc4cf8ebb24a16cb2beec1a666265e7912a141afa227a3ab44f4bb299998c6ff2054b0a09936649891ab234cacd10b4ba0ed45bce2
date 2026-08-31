import { inject, provide, ref } from "vue";
//#region src/components/ScalarDropdown/useDropdown.ts
/** The symbol for the dropdown context */
var ACTIVE_SYMBOL = Symbol();
/** Provides a ref for the currently active dropdown item */
function useDropdown() {
	const active = ref();
	provide(ACTIVE_SYMBOL, active);
	return { active };
}
/** Injects the ref for the currently active dropdown item */
function useDropdownItem() {
	const active = inject(ACTIVE_SYMBOL);
	if (!active) console.warn("useDropdownItem must be used within a ScalarDropdown");
	return { active };
}
//#endregion
export { useDropdown, useDropdownItem };

//# sourceMappingURL=useDropdown.js.map