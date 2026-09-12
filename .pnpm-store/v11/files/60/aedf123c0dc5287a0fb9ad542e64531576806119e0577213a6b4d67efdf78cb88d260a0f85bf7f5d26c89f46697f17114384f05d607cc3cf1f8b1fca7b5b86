import { computed } from "vue";
//#region src/hooks/useScalarIcon.ts
var defaultWeight = "regular";
function useScalarIcon(props = {}) {
	const a11yAttrs = computed(() => props.label ? { "aria-label": props.label } : {
		"aria-hidden": true,
		role: "presentation"
	});
	return {
		bind: computed(() => ({
			width: "1em",
			height: "1em",
			...a11yAttrs.value
		})),
		weight: computed(() => props.weight ?? defaultWeight)
	};
}
//#endregion
export { useScalarIcon };

//# sourceMappingURL=useScalarIcon.js.map