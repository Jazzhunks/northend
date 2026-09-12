import { authStorage } from "../helpers.js";
import { debounce } from "@scalar/helpers/general/debounce";
//#region src/plugins/persistance.ts
/**
* Plugin to persist workspace state changes with debounced writes.
*/
var persistencePlugin = ({ debounceDelay = 500, maxWait = 1e4, persistAuth = false }) => {
	const { execute } = debounce({
		delay: debounceDelay,
		maxWait
	});
	const authPersistence = authStorage();
	const getPersistAuth = () => {
		if (typeof persistAuth === "function") return persistAuth();
		return persistAuth;
	};
	return { hooks: { onWorkspaceStateChanges(event) {
		if (getPersistAuth() && event.type === "auth") execute("auth", () => authPersistence.setAuth(event.documentName, event.value));
	} } };
};
//#endregion
export { persistencePlugin };

//# sourceMappingURL=persistance.js.map