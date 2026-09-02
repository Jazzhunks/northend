import { STATE_SYMBOL, createState } from "./state/state.js";
import Chat_default from "./Chat.vue.js";
import { createBlock, defineComponent, openBlock, provide } from "vue";
//#region src/App.vue?vue&type=script&setup=true&lang.ts
var App_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "App",
	props: {
		registryDocuments: {},
		registryUrl: {},
		dashboardUrl: {},
		platformProxyUrl: {},
		baseUrl: {},
		mode: { default: "full" },
		getAccessToken: { type: Function },
		getAgentKey: { type: Function },
		getActiveDocumentJson: { type: Function },
		isLoggedIn: {},
		prefilledMessage: {},
		hideAddApi: { type: Boolean }
	},
	emits: ["uploadApi"],
	setup(__props, { expose: __expose }) {
		const state = createState({
			getActiveDocumentJson: __props.getActiveDocumentJson,
			initialRegistryDocuments: __props.registryDocuments,
			prefilledMessageRef: __props.prefilledMessage,
			platformProxyUrl: __props.platformProxyUrl,
			registryUrl: __props.registryUrl,
			baseUrl: __props.baseUrl,
			mode: __props.mode,
			getAccessToken: __props.getAccessToken,
			getAgentKey: __props.getAgentKey,
			isLoggedIn: __props.isLoggedIn,
			dashboardUrl: __props.dashboardUrl,
			hideAddApi: __props.hideAddApi
		});
		provide(STATE_SYMBOL, state);
		__expose({ addDocumentAsync: state.addDocumentAsync });
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Chat_default, { onUploadApi: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("uploadApi")) });
		};
	}
});
//#endregion
export { App_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=App.vue.script.js.map