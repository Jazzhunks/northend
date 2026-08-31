import { useState } from "../../state/state.js";
import { computed, createBlock, createCommentVNode, createElementBlock, defineComponent, openBlock, shallowRef, unref, watch } from "vue";
import { getSecurityRequirements, getSelectedSecurity, mergeSecurity } from "@scalar/workspace-store/request-example";
import { AuthSelector } from "@scalar/api-client/blocks/scalar-auth-selector-block";
import { useFocusWithin } from "@vueuse/core";
//#region src/views/Settings/Auth.vue?vue&type=script&setup=true&lang.ts
var Auth_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Auth",
	props: {
		options: {},
		name: {},
		authStore: {},
		document: {},
		eventBus: {},
		selectedServer: {},
		environment: {}
	},
	setup(__props) {
		const { workspaceStore } = useState();
		/** Compute what the security requirements should be for the document */
		const securityRequirements = computed(() => getSecurityRequirements(__props.document?.security));
		/** Merge the security schemes with the authentication config and the auth store */
		const securitySchemes = computed(() => mergeSecurity(__props.document?.components?.securitySchemes ?? {}, __props.options.authentication?.securitySchemes, __props.authStore, __props.name));
		/** The selected security keys for the document */
		const selectedSecurity = computed(() => getSelectedSecurity(__props.authStore.getAuthSelectedSchemas({
			type: "document",
			documentName: __props.name
		}), void 0, securityRequirements.value, securitySchemes.value, __props.options.authentication?.preferredSecurityScheme));
		const focusRef = shallowRef();
		const { focused } = useFocusWithin(focusRef);
		watch(focused, (isFocused) => {
			if (!isFocused) return;
			workspaceStore.update("x-scalar-active-document", __props.name);
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "focusRef",
				ref: focusRef,
				tabindex: "0"
			}, [Object.keys(securitySchemes.value).length ? (openBlock(), createBlock(unref(AuthSelector), {
				key: 0,
				authStore: __props.authStore,
				documentSlug: __props.name,
				environment: __props.environment,
				eventBus: __props.eventBus,
				isReadOnly: "",
				isStatic: "",
				layout: "reference",
				meta: { type: "document" },
				persistAuth: __props.options.persistAuth,
				proxyUrl: __props.options.proxyUrl ?? "",
				securityRequirements: securityRequirements.value,
				securitySchemes: securitySchemes.value,
				selectedSecurity: selectedSecurity.value,
				server: __props.selectedServer,
				title: "Authentication"
			}, null, 8, [
				"authStore",
				"documentSlug",
				"environment",
				"eventBus",
				"persistAuth",
				"proxyUrl",
				"securityRequirements",
				"securitySchemes",
				"selectedSecurity",
				"server"
			])) : createCommentVNode("", true)], 512);
		};
	}
});
//#endregion
export { Auth_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=Auth.vue.script.js.map