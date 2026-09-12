import OpenApiClientButton_default from "./OpenApiClientButton.vue.js";
import AddressBar_default from "../../scalar-address-bar-block/components/AddressBar.vue.js";
import EnvironmentSelector_default from "../../scalar-address-bar-block/components/EnvironmentSelector.vue.js";
import { createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, openBlock, unref } from "vue";
import { ScalarIconGearSix } from "@scalar/icons";
import { ScalarIcon } from "@scalar/components/icon";
import { ScalarIconButton } from "@scalar/components/icon-button";
//#region src/v2/blocks/operation-block/components/Header.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "lg:min-h-header t-app__top-container @container flex w-full flex-wrap items-center justify-center p-2" };
var _hoisted_2 = { class: "mb-2 flex flex-1 items-center justify-end gap-2 @3xl:mb-0" };
var Header_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Header",
	props: {
		path: {},
		method: {},
		layout: {},
		hideClientButton: {
			type: Boolean,
			default: false
		},
		integration: {},
		documentSlug: {},
		exampleKey: {},
		documentUrl: {},
		source: {},
		server: {},
		servers: {},
		history: {},
		eventBus: {},
		environments: {},
		activeEnvironment: {},
		environment: {},
		serverMeta: {}
	},
	emits: [
		"execute",
		"select:history:item",
		"add:environment",
		"navigate:settings"
	],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const handleSelectEnvironment = (environmentName) => {
			__props.eventBus.emit("workspace:update:active-environment", environmentName);
		};
		const handleAddEnvironment = () => {
			__props.eventBus.emit("ui:navigate", {
				page: "document",
				path: "environment"
			});
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [
				_cache[8] || (_cache[8] = createElementVNode("div", { class: "flex flex-1" }, null, -1)),
				createVNode(unref(AddressBar_default), {
					activeEnvironment: __props.activeEnvironment,
					documentSlug: __props.documentSlug,
					environment: __props.environment,
					environments: __props.environments,
					eventBus: __props.eventBus,
					exampleKey: __props.exampleKey,
					history: __props.history,
					layout: __props.layout,
					method: __props.method,
					path: __props.path,
					server: __props.server,
					serverMeta: __props.serverMeta,
					servers: __props.servers,
					"onAdd:environment": _cache[0] || (_cache[0] = ($event) => emit("add:environment")),
					onExecute: _cache[1] || (_cache[1] = ($event) => emit("execute")),
					"onSelect:history:item": _cache[2] || (_cache[2] = (payload) => emit("select:history:item", payload))
				}, null, 8, [
					"activeEnvironment",
					"documentSlug",
					"environment",
					"environments",
					"eventBus",
					"exampleKey",
					"history",
					"layout",
					"method",
					"path",
					"server",
					"serverMeta",
					"servers"
				]),
				createElementVNode("div", _hoisted_2, [
					__props.layout !== "modal" ? (openBlock(), createBlock(EnvironmentSelector_default, {
						key: 0,
						activeEnvironment: __props.activeEnvironment,
						environments: __props.environments,
						"onAdd:environment": handleAddEnvironment,
						"onSelect:environment": handleSelectEnvironment
					}, null, 8, ["activeEnvironment", "environments"])) : createCommentVNode("", true),
					__props.layout !== "modal" ? (openBlock(), createBlock(unref(ScalarIconButton), {
						key: 1,
						icon: unref(ScalarIconGearSix),
						label: "Operation settings",
						size: "sm",
						weight: "bold",
						onClick: _cache[3] || (_cache[3] = ($event) => emit("navigate:settings"))
					}, null, 8, ["icon"])) : createCommentVNode("", true),
					__props.layout === "modal" && __props.documentUrl && !__props.hideClientButton ? (openBlock(), createBlock(OpenApiClientButton_default, {
						key: 2,
						buttonSource: "modal",
						class: "!w-fit lg:-mr-1",
						integration: __props.integration ?? null,
						operationMethod: __props.method,
						operationPath: __props.path,
						source: __props.source ?? "api-reference",
						url: __props.documentUrl
					}, null, 8, [
						"integration",
						"operationMethod",
						"operationPath",
						"source",
						"url"
					])) : createCommentVNode("", true),
					__props.layout === "modal" && __props.source !== "gitbook" ? (openBlock(), createElementBlock("button", {
						key: 3,
						class: "app-exit-button zoomed:static zoomed:p-1 fixed top-2 right-2 rounded-full p-2",
						type: "button",
						onClick: _cache[4] || (_cache[4] = ($event) => __props.eventBus.emit("ui:close:client-modal"))
					}, [createVNode(unref(ScalarIcon), {
						icon: "Close",
						size: "lg",
						thickness: "2"
					}), _cache[6] || (_cache[6] = createElementVNode("span", { class: "sr-only" }, "Close Client", -1))])) : createCommentVNode("", true),
					__props.layout === "modal" && __props.source === "gitbook" ? (openBlock(), createElementBlock("button", {
						key: 4,
						class: "text-c-1 hover:bg-b-2 active:text-c-1 -mr-1.5 rounded p-2",
						type: "button",
						onClick: _cache[5] || (_cache[5] = ($event) => __props.eventBus.emit("ui:close:client-modal"))
					}, [createVNode(unref(ScalarIcon), {
						icon: "Close",
						size: "md",
						thickness: "1.75"
					}), _cache[7] || (_cache[7] = createElementVNode("span", { class: "sr-only" }, "Close Client", -1))])) : createCommentVNode("", true)
				])
			]);
		};
	}
});
//#endregion
export { Header_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=Header.vue.script.js.map