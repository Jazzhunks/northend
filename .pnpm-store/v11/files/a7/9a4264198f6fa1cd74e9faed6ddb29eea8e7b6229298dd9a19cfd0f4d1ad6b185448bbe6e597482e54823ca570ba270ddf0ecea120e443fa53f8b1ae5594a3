import { useState } from "../state/state.js";
import { computed } from "vue";
//#region src/hooks/use-signup-link.ts
/**
* Agent Scalar signup/upgrade URL for both full (agent.scalar.com) and embedded
* (@scalar/api-reference) modes.
*
* In embedded mode, includes register flow and optional docUrl when a temporary document was uploaded.
*/
function useSignupLink() {
	const { dashboardUrl, mode, uploadedTmpDocumentUrl } = useState();
	const signupLink = computed(() => {
		if (mode === "full") return dashboardUrl;
		return uploadedTmpDocumentUrl.value ? `${dashboardUrl}/register?flow=oss-agent&docUrl=${uploadedTmpDocumentUrl.value}` : dashboardUrl;
	});
	function navigateToSignup() {
		window.location.assign(signupLink.value);
	}
	return {
		signupLink,
		navigateToSignup
	};
}
//#endregion
export { useSignupLink };

//# sourceMappingURL=use-signup-link.js.map