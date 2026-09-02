import { onMounted, ref } from "vue";
//#region src/hooks/use-term-and-conditions.ts
var TERMS_AND_CONDITIONS_LS_KEY = "scalar/agent-terms-accepted";
function useTermsAndConditions() {
	const accepted = ref(false);
	onMounted(() => {
		accepted.value = localStorage.getItem(TERMS_AND_CONDITIONS_LS_KEY) === "true";
	});
	function accept() {
		accepted.value = true;
		localStorage.setItem(TERMS_AND_CONDITIONS_LS_KEY, "true");
	}
	return {
		accepted,
		accept
	};
}
//#endregion
export { useTermsAndConditions };

//# sourceMappingURL=use-term-and-conditions.js.map