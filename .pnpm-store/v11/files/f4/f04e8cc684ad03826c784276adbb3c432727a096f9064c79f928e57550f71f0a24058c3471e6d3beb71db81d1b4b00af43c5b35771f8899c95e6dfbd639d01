import { URLS } from "../../consts/urls.js";
import { useState } from "../../state/state.js";
import DocSettings_default from "./DocSettings.vue.js";
import { Fragment, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, isRef, normalizeClass, openBlock, renderList, toDisplayString, unref, withCtx } from "vue";
import { ScalarModal } from "@scalar/components/modal";
import { isOpenApiDocument } from "@scalar/workspace-store/schemas/type-guards";
import { ScalarIconCaretDown, ScalarIconCaretRight } from "@scalar/icons";
import { ScalarTextInput } from "@scalar/components/text-input";
import { ScalarColorModeToggle } from "@scalar/components/color-mode-toggle";
//#region src/views/Settings/Settings.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "settingsHeading" };
var _hoisted_2 = { class: "documentList" };
var _hoisted_3 = ["onClick"];
var _hoisted_4 = { key: 0 };
var _hoisted_5 = {
	key: 1,
	class: "noDocuments"
};
var _hoisted_6 = { class: "proxyUrlContainer" };
var _hoisted_7 = ["href"];
var Settings_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Settings",
	props: { modalState: {} },
	setup(__props) {
		const { workspaceStore, proxyUrlRaw } = useState();
		function selectDocument(name) {
			workspaceStore.update("x-scalar-active-document", name);
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarModal), {
				class: "settingsModal",
				state: __props.modalState
			}, {
				default: withCtx(() => [
					createElementVNode("div", _hoisted_1, [_cache[1] || (_cache[1] = createElementVNode("h1", null, "Settings", -1)), createVNode(unref(ScalarColorModeToggle), { class: "colorToggle ml-auto" })]),
					createElementVNode("div", _hoisted_2, [Object.entries(unref(workspaceStore).workspace.documents).length ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(Object.entries(unref(workspaceStore).workspace.documents), ([name, document]) => {
						return openBlock(), createElementBlock("div", {
							key: name,
							class: "document"
						}, [createElementVNode("button", {
							class: normalizeClass(["documentName", { documentNameActive: unref(workspaceStore).workspace.activeDocument === document }]),
							type: "button",
							onClick: ($event) => selectDocument(name)
						}, [createTextVNode(" @" + toDisplayString(name) + " ", 1), unref(workspaceStore).workspace.activeDocument === document ? (openBlock(), createBlock(unref(ScalarIconCaretDown), { key: 0 })) : (openBlock(), createBlock(unref(ScalarIconCaretRight), { key: 1 }))], 10, _hoisted_3), unref(workspaceStore).workspace.activeDocument === document && unref(isOpenApiDocument)(document) ? (openBlock(), createElementBlock("div", _hoisted_4, [createVNode(DocSettings_default, {
							document,
							name
						}, null, 8, ["document", "name"])])) : createCommentVNode("", true)]);
					}), 128)) : (openBlock(), createElementBlock("div", _hoisted_5, " There's no API definition loaded. Use the + button to load APIs. "))]),
					createElementVNode("div", _hoisted_6, [
						_cache[3] || (_cache[3] = createElementVNode("label", { for: "proxyUrl" }, "CORS Proxy", -1)),
						createElementVNode("p", null, [_cache[2] || (_cache[2] = createTextVNode(" All requests will be sent through the specified proxy URL to help avoid CORS (Cross-Origin Resource Sharing) issues. ", -1)), createElementVNode("a", {
							class: "underline",
							href: unref(URLS).PROXY_SOURCE_CODE,
							target: "_blank"
						}, " Read more ", 8, _hoisted_7)]),
						createVNode(unref(ScalarTextInput), {
							id: "proxyUrl",
							modelValue: unref(proxyUrlRaw),
							"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(proxyUrlRaw) ? proxyUrlRaw.value = $event : null),
							label: "Proxy URL",
							placeholder: unref(URLS).DEFAULT_PROXY_URL
						}, null, 8, ["modelValue", "placeholder"])
					])
				]),
				_: 1
			}, 8, ["state"]);
		};
	}
});
//#endregion
export { Settings_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=Settings.vue.script.js.map