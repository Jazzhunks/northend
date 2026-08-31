import { useState } from "../../state/state.js";
import Auth_default from "./Auth.vue.js";
import ServerSelector_default from "../../components/ServerSelector.vue.js";
import { computed, createElementBlock, createElementVNode, createVNode, defineComponent, openBlock, unref } from "vue";
import { getActiveEnvironment, getSelectedServer, getServers } from "@scalar/workspace-store/request-example";
//#region src/views/Settings/DocSettings.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "docSettings" };
var DocSettings_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DocSettings",
	props: {
		document: {},
		name: {}
	},
	setup(__props) {
		const { workspaceStore, config, eventBus } = useState();
		const environment = computed(() => getActiveEnvironment(workspaceStore, __props.document).environment);
		const selectedServer = computed(() => {
			const servers = getServers(__props.document.servers, { documentUrl: __props.document["x-scalar-original-source-url"] });
			return getSelectedServer(__props.document, null, null, servers);
		});
		const securitySchemes = computed(() => __props.document.components?.securitySchemes ?? {});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("div", null, [createVNode(Auth_default, {
				authStore: unref(workspaceStore).auth,
				document: __props.document,
				environment: environment.value,
				eventBus: unref(eventBus),
				name: __props.name,
				options: unref(config),
				securitySchemes: securitySchemes.value,
				selectedServer: selectedServer.value
			}, null, 8, [
				"authStore",
				"document",
				"environment",
				"eventBus",
				"name",
				"options",
				"securitySchemes",
				"selectedServer"
			])]), createElementVNode("div", null, [createVNode(ServerSelector_default, {
				eventBus: unref(eventBus),
				selectedServer: selectedServer.value,
				servers: __props.document.servers ?? []
			}, null, 8, [
				"eventBus",
				"selectedServer",
				"servers"
			])])]);
		};
	}
});
//#endregion
export { DocSettings_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=DocSettings.vue.script.js.map