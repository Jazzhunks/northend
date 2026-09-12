import { sanitizeEventPayload } from "./sanitize-event-payload.js";
import ph from "posthog-js";
//#region src/plugins/posthog/index.ts
/**
* PostHog analytics plugin for the API Client.
*
* Loading this plugin opts in to analytics. If the plugin is not loaded,
* no tracking occurs.
*
* Respects the `telemetry` configuration option — when set to `false`,
* capturing is disabled. Reacts dynamically to config changes at runtime.
*/
var PostHogClientPlugin = (config) => {
	let posthog = null;
	return {
		on: ({ event, payload }) => {
			if (event === "log:user-login") {
				if (payload?.uid) posthog?.identify(payload.uid, {
					email: payload.email,
					teamUid: payload.teamUid
				});
				return;
			}
			if (event === "log:user-logout") {
				posthog?.reset();
				return;
			}
			const result = sanitizeEventPayload(event, payload);
			if (result === null) return;
			const properties = typeof result === "object" && result !== null ? result : { value: result };
			if (Object.keys(properties).length === 0) {
				posthog?.capture(event);
				return;
			}
			posthog?.capture(event, properties);
		},
		lifecycle: {
			onInit(context) {
				if (typeof window === "undefined") return;
				const instance = ph.init(config.apiKey, {
					api_host: config.apiHost,
					...config.uiHost ? { ui_host: config.uiHost } : {},
					...config.defaults ? { defaults: config.defaults } : {},
					opt_out_capturing_by_default: true
				}, "scalar-api-client");
				if (instance) {
					posthog = instance;
					posthog.register({ product: "api-client" });
					if (context?.config.telemetry !== false) posthog.opt_in_capturing();
				}
			},
			onConfigChange(context) {
				if (!posthog) return;
				if (context.config.telemetry === false) posthog.opt_out_capturing();
				else posthog.opt_in_capturing();
			},
			onDestroy() {
				posthog?.reset();
				posthog = null;
			}
		}
	};
};
//#endregion
export { PostHogClientPlugin };

//# sourceMappingURL=index.js.map