import HttpMethod_default from "../../../../components/HttpMethod/HttpMethod.vue.js";
import CodeInput_default from "../../../components/code-input/CodeInput.vue.js";
import { getOperationExampleKey } from "../../operation-block/helpers/response-cache.js";
import { isPlaceholderPath } from "../helpers/is-placeholder-path.js";
import { refocusBlurTarget } from "../helpers/refocus-blur-target.js";
import { useLoadingAnimation } from "../hooks/use-loading-animation.js";
import { usePathMasking } from "../hooks/use-path-masking.js";
import ServerDropdown_default from "../../../components/server/ServerDropdown.vue.js";
import AddressBarHistory_default from "./AddressBarHistory.vue.js";
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, nextTick, normalizeClass, normalizeStyle, onBeforeUnmount, onMounted, openBlock, ref, toDisplayString, unref, useId, useTemplateRef, watch, withCtx, withKeys } from "vue";
import { ScalarButton } from "@scalar/components/button";
import { ScalarIconCopy, ScalarIconWarningCircle } from "@scalar/icons";
import { REQUEST_METHODS } from "@scalar/helpers/http/http-info";
import { ScalarIcon } from "@scalar/components/icon";
import { EditorView } from "@scalar/use-codemirror";
import { ScalarWrappingText } from "@scalar/components/wrapping-text";
import { getSelector } from "@scalar/helpers/dom/get-selector";
import { extractServerFromPath } from "@scalar/helpers/url/extract-server-from-path";
//#region src/v2/blocks/scalar-address-bar-block/components/AddressBar.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "order-last flex h-auto w-full max-w-3xl grow-3 flex-wrap items-stretch [--scalar-address-bar-height:32px] @3xl:order-0 @3xl:flex-nowrap" };
var _hoisted_2 = ["id"];
var _hoisted_3 = { class: "hidden @3xl:flex" };
var _hoisted_4 = { class: "scroll-timeline-x scroll-timeline-x-hidden relative flex w-full bg-blend-normal" };
var _hoisted_5 = {
	key: 0,
	class: "z-context absolute inset-x-0 top-[calc(100%+4px)] flex flex-col items-center rounded px-6"
};
var _hoisted_6 = { class: "text-c-danger bg-b-danger border-c-danger flex items-center gap-1 rounded border p-1" };
var _hoisted_7 = { class: "min-w-0 flex-1" };
var _hoisted_8 = {
	"aria-hidden": "true",
	class: "inline-flex items-center gap-1"
};
var _hoisted_9 = { class: "sr-only" };
var _hoisted_10 = { class: "mt-2 flex h-(--scalar-address-bar-height) w-full items-stretch gap-1 @3xl:hidden" };
var _hoisted_11 = {
	"aria-hidden": "true",
	class: "inline-flex items-center gap-1"
};
var _hoisted_12 = { class: "sr-only" };
var AddressBar_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	name: "AddressBar",
	props: {
		path: {},
		method: {},
		documentSlug: {},
		exampleKey: {},
		server: {},
		servers: {},
		history: {},
		layout: {},
		eventBus: {},
		environment: {},
		serverMeta: {}
	},
	emits: ["execute", "select:history:item"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const emit = __emit;
		const id = useId();
		const sendButtonRef = useTemplateRef("sendButtonRef");
		const mobileSendButtonRef = useTemplateRef("mobileSendButtonRef");
		const addressBarRef = useTemplateRef("addressBarRef");
		const { percentage, startLoading, stopLoading, isLoading } = useLoadingAnimation();
		const pathConflict = ref(null);
		const methodConflict = ref(null);
		const tabbedOut = ref(false);
		const isServerDropdownOpen = ref(false);
		const isHistoryDropdownOpen = ref(false);
		/** Keeps the cursor visible past the fade-right overlay while typing */
		const addressBarScrollMargins = EditorView.scrollMargins.of(() => ({ right: 24 }));
		/** Animated background transform for the loading indicator */
		const style = computed(() => ({
			backgroundColor: `color-mix(in srgb, transparent 90%, ${REQUEST_METHODS[__props.method].colorVar})`,
			transform: `translate3d(-${percentage.value}%,0,0)`
		}));
		/** Whether there is a path or method conflict */
		const hasConflict = computed(() => methodConflict.value || pathConflict.value);
		/** Whether either dropdown (server or history) is open */
		const isDropdownOpen = computed(() => isServerDropdownOpen.value || isHistoryDropdownOpen.value);
		/** Uniquely identifies the currently selected operation + example */
		const uniqueKey = computed(() => getOperationExampleKey(__props.method, __props.path, __props.exampleKey, __props.documentSlug));
		/** Clear conflict state when switching to a different operation */
		watch(uniqueKey, () => {
			pathConflict.value = null;
			methodConflict.value = null;
		});
		const handleFocusSendButton = () => {
			const desktop = sendButtonRef.value?.$el;
			const mobile = mobileSendButtonRef.value?.$el;
			if (desktop && desktop.offsetParent !== null) desktop.focus();
			else mobile?.focus();
		};
		const handleFocusAddressBar = (payload) => {
			if (addressBarRef.value?.isFocused && __props.layout !== "desktop") return;
			addressBarRef.value?.focus("end");
			if (payload && "clear" in payload && payload.clear) addressBarRef.value?.setCodeMirrorContent("");
			if (payload && "event" in payload) payload.event.preventDefault();
		};
		usePathMasking({
			isReady: () => addressBarRef.value?.codeMirror,
			operationKey: () => uniqueKey.value,
			shouldMask: () => isPlaceholderPath(__props.path, __props.documentSlug),
			onMask: () => requestAnimationFrame(() => {
				const editorContent = addressBarRef.value?.codeMirror?.state.doc.toString();
				if (editorContent && editorContent !== __props.path) return;
				handleFocusAddressBar({ clear: true });
			})
		});
		/** If the path contains a server URL, extract it and select or add that server */
		const extractAndSelectServer = (targetPath) => {
			const extracted = extractServerFromPath(targetPath);
			if (!extracted) return targetPath;
			const [url, remainingPath] = extracted;
			if (url === __props.server?.url) return remainingPath;
			if (__props.servers.find((s) => s.url === url)) __props.eventBus.emit("server:update:selected", {
				url,
				meta: __props.serverMeta
			});
			else __props.eventBus.emit("server:add:server", {
				url,
				select: true,
				meta: {
					type: "operation",
					path: __props.path,
					method: __props.method
				}
			});
			return remainingPath;
		};
		const normalizePath = (value) => value.startsWith("/") ? value : `/${value}`;
		/** Emit a path/method update and reconcile conflicts + cursor state on the result */
		const emitPathMethodUpdate = (targetMethod, targetPath, blurTargetSelector = null) => {
			const extractedPath = extractAndSelectServer(targetPath);
			const normalizedPath = normalizePath(extractedPath);
			addressBarRef.value?.setCodeMirrorContent(normalizedPath);
			__props.eventBus.emit("operation:update:pathMethod", {
				meta: {
					method: __props.method,
					path: __props.path
				},
				blurTargetSelector,
				payload: {
					method: targetMethod,
					path: normalizedPath
				},
				callback: (status, returnedSelector) => {
					if (status === "success" || status === "no-change") {
						methodConflict.value = null;
						pathConflict.value = null;
					} else if (status === "conflict") {
						if (targetMethod !== __props.method) methodConflict.value = targetMethod;
						if (normalizedPath !== __props.path) pathConflict.value = normalizedPath;
						return;
					}
					const mirrorContent = addressBarRef.value?.codeMirrorRef?.textContent;
					if (status === "no-change" && mirrorContent && mirrorContent !== extractedPath) addressBarRef.value?.setCodeMirrorContent(extractedPath);
					nextTick(() => refocusBlurTarget(returnedSelector));
				}
			});
		};
		/** Change the operation's method, preferring the conflicting path if present */
		const handleMethodChange = (newMethod) => emitPathMethodUpdate(newMethod, pathConflict.value ?? __props.path);
		/**
		* Save the path on blur and replay the click that caused the blur (so e.g. a
		* click on the Send button still fires after the async update resolves).
		*
		* Tab-outs do not replay — tabbing to a button should not trigger its click
		* (`tabbedOut` is set on `@keydown.tab`).
		*
		* Programmatic focus moves also do not replay. On first navigation into a
		* draft operation, `usePathMasking` focuses and clears the address bar while
		* `ScalarSidebarNestedItems` focuses the drilled-in Back button in
		* `nextTick`. That steals focus from CodeMirror, fires blur with a
		* `relatedTarget` (the Back button), and without a guard we would treat it
		* like a user click: capture the selector, then `refocusBlurTarget` would
		* synthesize `.click()` on Back and navigate away.
		*
		* `FocusEvent.sourceCapabilities` is null when no input device caused the
		* focus change (e.g. `element.focus()`). A real pointer click sets it on the
		* blur that precedes the click, so we still replay Send and other buttons.
		*/
		const handlePathBlur = (newPath, event) => {
			const relatedTarget = event.relatedTarget;
			const blurTargetSelector = tabbedOut.value || "sourceCapabilities" in event && event.sourceCapabilities === null ? null : getSelector(relatedTarget);
			tabbedOut.value = false;
			emitPathMethodUpdate(methodConflict.value ?? __props.method, newPath, blurTargetSelector);
		};
		/** Save the path on Enter and trigger the Send button after the update resolves */
		const handlePathSubmit = (newPath, event) => {
			event.stopPropagation();
			emitPathMethodUpdate(methodConflict.value ?? __props.method, newPath, "[data-addressbar-action=\"send\"]");
		};
		/** Unset the server when backspace is pressed on an empty path */
		const handlePathBackspace = (event) => {
			if (event.target?.innerText === "\n") __props.eventBus.emit("server:update:selected", {
				url: "",
				meta: __props.serverMeta
			});
		};
		/** Address bar copy is handled in OperationBlock (same URL as Send). */
		const requestCopyUrl = () => {
			__props.eventBus.emit("copy-url:address-bar");
		};
		const navigateToServersPage = () => {
			if (__props.serverMeta.type === "operation") {
				__props.eventBus.emit("ui:navigate", {
					page: "operation",
					path: "servers",
					operationPath: __props.serverMeta.path,
					method: __props.serverMeta.method
				});
				return;
			}
			__props.eventBus.emit("ui:navigate", {
				page: "document",
				path: "servers"
			});
		};
		const unsubscribes = [];
		onMounted(() => {
			unsubscribes.push(__props.eventBus.on("ui:focus:address-bar", handleFocusAddressBar), __props.eventBus.on("ui:focus:send-button", handleFocusSendButton), __props.eventBus.on("hooks:on:request:sent", startLoading), __props.eventBus.on("hooks:on:request:complete", stopLoading));
		});
		onBeforeUnmount(() => {
			for (const unsubscribe of unsubscribes) unsubscribe();
			stopLoading();
		});
		__expose({
			methodConflict,
			pathConflict
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("div", {
				id: unref(id),
				class: normalizeClass(["address-bar-bg-states text-xxs group relative flex h-(--scalar-address-bar-height) w-full flex-1 flex-row items-stretch rounded-lg p-0.75", {
					"outline-c-danger outline": hasConflict.value,
					"rounded-b-none": isDropdownOpen.value
				}])
			}, [
				createElementVNode("div", { class: normalizeClass(["pointer-events-none absolute top-0 left-0 block h-full w-full overflow-hidden rounded-lg border", { "rounded-b-none": isDropdownOpen.value }]) }, [createElementVNode("div", {
					class: "absolute top-0 left-0 h-full w-full",
					style: normalizeStyle(style.value)
				}, null, 4)], 2),
				createElementVNode("div", _hoisted_3, [createVNode(unref(HttpMethod_default), {
					isEditable: __props.layout !== "modal",
					isSquare: "",
					method: methodConflict.value ?? __props.method,
					teleport: "",
					onChange: handleMethodChange
				}, null, 8, ["isEditable", "method"])]),
				createElementVNode("div", _hoisted_4, [__props.servers.length ? (openBlock(), createBlock(unref(ServerDropdown_default), {
					key: 0,
					layout: __props.layout,
					meta: __props.serverMeta,
					server: __props.server,
					servers: __props.servers,
					target: unref(id),
					"onUpdate:open": _cache[0] || (_cache[0] = (value) => isServerDropdownOpen.value = value),
					"onUpdate:selectedServer": _cache[1] || (_cache[1] = (payload) => __props.eventBus.emit("server:update:selected", payload)),
					"onUpdate:servers": navigateToServersPage,
					"onUpdate:variable": _cache[2] || (_cache[2] = (payload) => __props.eventBus.emit("server:update:variables", payload))
				}, null, 8, [
					"layout",
					"meta",
					"server",
					"servers",
					"target"
				])) : createCommentVNode("", true), createVNode(unref(CodeInput_default), {
					ref_key: "addressBarRef",
					ref: addressBarRef,
					alwaysEmitChange: "",
					"aria-label": "Path",
					class: "ml-1 min-w-fit pl-px outline-none",
					disableCloseBrackets: "",
					disabled: __props.layout === "modal",
					disableEnter: "",
					disableTabIndent: "",
					emitOnBlur: false,
					environment: __props.environment,
					extensions: [unref(addressBarScrollMargins)],
					importCurl: "",
					layout: __props.layout,
					modelValue: __props.path,
					placeholder: __props.server ? "" : "Enter a URL",
					server: "",
					onBlur: handlePathBlur,
					onKeydown: [withKeys(handlePathBackspace, ["delete"]), _cache[3] || (_cache[3] = withKeys(($event) => tabbedOut.value = true, ["tab"]))],
					onSubmit: handlePathSubmit
				}, null, 8, [
					"disabled",
					"environment",
					"extensions",
					"layout",
					"modelValue",
					"placeholder"
				])]),
				createVNode(unref(ScalarButton), {
					class: "hover:bg-b-3 mx-1 hidden @3xl:flex",
					size: "xs",
					variant: "ghost",
					onClick: requestCopyUrl
				}, {
					default: withCtx(() => [createVNode(unref(ScalarIconCopy)), _cache[8] || (_cache[8] = createElementVNode("span", { class: "sr-only" }, "Copy URL", -1))]),
					_: 1
				}),
				createVNode(AddressBarHistory_default, {
					history: __props.history,
					target: unref(id),
					"onSelect:history:item": _cache[4] || (_cache[4] = (payload) => emit("select:history:item", payload)),
					"onUpdate:open": _cache[5] || (_cache[5] = (value) => isHistoryDropdownOpen.value = value)
				}, null, 8, ["history", "target"]),
				hasConflict.value ? (openBlock(), createElementBlock("div", _hoisted_5, [createElementVNode("div", _hoisted_6, [createVNode(unref(ScalarIconWarningCircle), { size: "sm" }), createElementVNode("div", _hoisted_7, [
					_cache[9] || (_cache[9] = createTextVNode(" A ", -1)),
					createElementVNode("em", null, toDisplayString(methodConflict.value?.toUpperCase() ?? __props.method.toUpperCase()), 1),
					_cache[10] || (_cache[10] = createTextVNode(" request to ", -1)),
					createVNode(unref(ScalarWrappingText), { text: pathConflict.value ?? __props.path }, null, 8, ["text"]),
					_cache[11] || (_cache[11] = createTextVNode(" already exists in this document ", -1))
				])])])) : createCommentVNode("", true),
				createVNode(unref(ScalarButton), {
					ref_key: "sendButtonRef",
					ref: sendButtonRef,
					class: "relative hidden h-auto shrink-0 overflow-hidden py-1 pr-2.5 pl-2 font-bold @3xl:flex",
					"data-addressbar-action": "send",
					disabled: unref(isLoading),
					onClick: _cache[6] || (_cache[6] = ($event) => emit("execute"))
				}, {
					default: withCtx(() => [createElementVNode("span", _hoisted_8, [createVNode(unref(ScalarIcon), {
						class: "relative shrink-0 fill-current",
						icon: "Play",
						size: "xs"
					}), _cache[12] || (_cache[12] = createElementVNode("span", { class: "text-xxs flex" }, "Send", -1))]), createElementVNode("span", _hoisted_9, " Send " + toDisplayString(__props.method) + " request to " + toDisplayString(__props.server?.url ?? "") + toDisplayString(__props.path), 1)]),
					_: 1
				}, 8, ["disabled"])
			], 10, _hoisted_2), createElementVNode("div", _hoisted_10, [
				createVNode(unref(HttpMethod_default), {
					isEditable: __props.layout !== "modal",
					isSquare: "",
					method: methodConflict.value ?? __props.method,
					teleport: "",
					onChange: handleMethodChange
				}, null, 8, ["isEditable", "method"]),
				createVNode(unref(ScalarButton), {
					class: "hover:bg-b-3 ml-auto",
					size: "xs",
					variant: "ghost",
					onClick: requestCopyUrl
				}, {
					default: withCtx(() => [createVNode(unref(ScalarIconCopy)), _cache[13] || (_cache[13] = createElementVNode("span", { class: "sr-only" }, "Copy URL", -1))]),
					_: 1
				}),
				createVNode(unref(ScalarButton), {
					ref_key: "mobileSendButtonRef",
					ref: mobileSendButtonRef,
					class: "relative h-auto shrink-0 overflow-hidden py-1 pr-2.5 pl-2 font-bold",
					"data-addressbar-action": "send",
					disabled: unref(isLoading),
					onClick: _cache[7] || (_cache[7] = ($event) => emit("execute"))
				}, {
					default: withCtx(() => [createElementVNode("span", _hoisted_11, [createVNode(unref(ScalarIcon), {
						class: "relative shrink-0 fill-current",
						icon: "Play",
						size: "xs"
					}), _cache[14] || (_cache[14] = createElementVNode("span", { class: "text-xxs" }, "Send", -1))]), createElementVNode("span", _hoisted_12, " Send " + toDisplayString(__props.method) + " request to " + toDisplayString(__props.server?.url ?? "") + toDisplayString(__props.path), 1)]),
					_: 1
				}, 8, ["disabled"])
			])]);
		};
	}
});
//#endregion
export { AddressBar_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=AddressBar.vue.script.js.map