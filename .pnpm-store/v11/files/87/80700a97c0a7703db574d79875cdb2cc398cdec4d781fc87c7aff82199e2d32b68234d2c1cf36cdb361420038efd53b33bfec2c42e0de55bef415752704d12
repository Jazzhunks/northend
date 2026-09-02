import { ASK_FOR_AUTHENTICATION_TOOL_NAME } from "../../../entities/tools/ask-for-authentication.js";
import { useState } from "../../../state/state.js";
import AuthenticationProvided_default from "../../../components/AuthenticationProvided.vue.js";
import AuthenticationRequired_default from "../../../components/AuthenticationRequired.vue.js";
import Auth_default from "../../Settings/Auth.vue.js";
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, normalizeClass, openBlock, unref, withCtx } from "vue";
import { getActiveEnvironment, getSelectedServer, getServers } from "@scalar/workspace-store/request-example";
import { isOpenApiDocument } from "@scalar/workspace-store/schemas/type-guards";
import { ScalarButton } from "@scalar/components/button";
import { ScalarIconArrowRight } from "@scalar/icons";
//#region src/views/Chat/Messages/AskForAuthentication.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "toggleButton" };
var _hoisted_2 = { class: "authContent" };
var _hoisted_3 = { class: "authContentInner" };
var AskForAuthentication_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "AskForAuthentication",
	props: { messagePart: {} },
	setup(__props) {
		const { workspaceStore, eventBus, config, chat } = useState();
		const documentName = computed(() => __props.messagePart.value.input?.documentName);
		const document = computed(() => {
			if (!documentName.value) return;
			const doc = workspaceStore.workspace.documents[documentName.value];
			return isOpenApiDocument(doc) ? doc : void 0;
		});
		const environment = computed(() => {
			if (!document.value) return;
			return getActiveEnvironment(workspaceStore, document.value).environment;
		});
		const selectedServer = computed(() => {
			if (!document.value) return;
			const servers = getServers(document.value.servers, { documentUrl: document.value["x-scalar-original-source-url"] });
			return getSelectedServer(document.value, null, null, servers);
		});
		const isAuthenticationExpanded = computed(() => documentName.value && environment.value && selectedServer.value);
		async function authorizeClicked() {
			await chat.addToolOutput({
				toolCallId: __props.messagePart.value.toolCallId,
				output: "Authentication provided.",
				tool: ASK_FOR_AUTHENTICATION_TOOL_NAME,
				state: "output-available"
			});
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", { class: normalizeClass(["askForAuthentication", { open: isAuthenticationExpanded.value }]) }, [createElementVNode("div", _hoisted_1, [
				__props.messagePart.value.state === "output-available" ? (openBlock(), createBlock(AuthenticationProvided_default, { key: 0 })) : createCommentVNode("", true),
				__props.messagePart.value.state === "input-available" ? (openBlock(), createBlock(AuthenticationRequired_default, { key: 1 })) : createCommentVNode("", true),
				__props.messagePart.value.state === "input-available" ? (openBlock(), createBlock(unref(ScalarButton), {
					key: 2,
					class: "authorizeButton",
					size: "xs",
					onClick: authorizeClicked
				}, {
					default: withCtx(() => [_cache[0] || (_cache[0] = createTextVNode(" Authorize ", -1)), createVNode(unref(ScalarIconArrowRight), { weight: "bold" })]),
					_: 1
				})) : createCommentVNode("", true)
			]), createElementVNode("div", _hoisted_2, [createElementVNode("div", _hoisted_3, [documentName.value && document.value && environment.value && selectedServer.value ? (openBlock(), createBlock(Auth_default, {
				key: 0,
				authStore: unref(workspaceStore).auth,
				document: document.value,
				environment: environment.value,
				eventBus: unref(eventBus),
				name: documentName.value,
				options: unref(config),
				selectedServer: selectedServer.value
			}, null, 8, [
				"authStore",
				"document",
				"environment",
				"eventBus",
				"name",
				"options",
				"selectedServer"
			])) : createCommentVNode("", true)])])], 2);
		};
	}
});
//#endregion
export { AskForAuthentication_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=AskForAuthentication.vue.script.js.map