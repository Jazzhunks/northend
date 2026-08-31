import ViewLayoutSection_default from "../../../components/ViewLayout/ViewLayoutSection.vue.js";
import { textMediaTypes } from "./helpers/media-types.js";
import SectionFilter_default from "../../../components/SectionFilter.vue.js";
import Headers_default from "./components/Headers.vue.js";
import ResponseBody_default from "./components/ResponseBody.vue.js";
import ResponseBodyStreaming_default from "./components/ResponseBodyStreaming.vue.js";
import ResponseBodyVirtual_default from "./components/ResponseBodyVirtual.vue.js";
import ResponseCookies_default from "./components/ResponseCookies.vue.js";
import ResponseEmpty_default from "./components/ResponseEmpty.vue.js";
import ResponseLoadingOverlay_default from "./components/ResponseLoadingOverlay.vue.js";
import ResponseMetaInformation_default from "./components/ResponseMetaInformation.vue.js";
import { parseSetCookie } from "./helpers/parse-set-cookie.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeProps, normalizeClass, openBlock, ref, renderList, resolveDynamicComponent, unref, useId, vShow, withCtx, withDirectives } from "vue";
import { isDefined } from "@scalar/helpers/array/is-defined";
import { ScalarErrorBoundary } from "@scalar/components/error-boundary";
//#region src/v2/blocks/response-block/ResponseBlock.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex h-8 flex-1 items-center" };
var _hoisted_2 = ["id", "role"];
var VIRTUALIZATION_THRESHOLD = 2e5;
var ResponseBlock_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ResponseBlock",
	props: {
		response: {},
		requestPayload: {},
		layout: {},
		totalPerformedRequests: {},
		appVersion: {},
		plugins: {},
		eventBus: {}
	},
	setup(__props, { expose: __expose }) {
		const responseHeaders = computed(() => {
			const headers = __props.response?.headers;
			return headers ? Object.keys(headers).map((key) => ({
				name: key,
				value: headers[key] ?? ""
			})) : [];
		});
		const responseCookies = computed(() => __props.response?.cookieHeaderKeys.map((setCookieValue) => parseSetCookie(setCookieValue)).filter(isDefined) ?? []);
		const responseSections = [
			"Cookies",
			"Headers",
			"Body"
		];
		const activeFilter = ref("All");
		const filters = computed(() => ["All", ...responseSections]);
		const filterIds = computed(() => Object.fromEntries(filters.value.map((section) => [section, useId()])));
		/** Threshold for virtualizing response bodies in bytes */
		const shouldVirtualize = computed(() => {
			if (!__props.response || !("size" in __props.response)) return false;
			const contentType = __props.response.headers?.["content-type"] || __props.response.headers?.["Content-Type"];
			if (!contentType || (__props.response.size ?? 0) <= VIRTUALIZATION_THRESHOLD) return false;
			if (contentType.includes("text/html")) return false;
			return textMediaTypes.some((type) => contentType.includes(type)) && (__props.response.size ?? 0) > VIRTUALIZATION_THRESHOLD;
		});
		const requestHeaders = computed(() => {
			const headers = __props.requestPayload?.[1]?.headers;
			if (!headers) return [];
			return [...new Headers(headers)].map(([name, value]) => ({
				name,
				value,
				required: false
			}));
		});
		const isSectionVisible = (section) => {
			if (activeFilter.value === "All" || activeFilter.value === section) return true;
			return false;
		};
		__expose({
			responseHeaders,
			responseCookies,
			requestHeaders,
			shouldVirtualize,
			activeFilter,
			filters
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(ViewLayoutSection_default, { "aria-label": "Response" }, {
				title: withCtx(() => [createElementVNode("div", _hoisted_1, [createElementVNode("div", {
					"aria-live": "polite",
					class: normalizeClass(["flex items-center", { "animate-response-heading": __props.response }])
				}, [_cache[4] || (_cache[4] = createElementVNode("span", { class: "response-heading pointer-events-none absolute" }, " Response ", -1)), __props.response ? (openBlock(), createBlock(ResponseMetaInformation_default, {
					key: 0,
					class: "animate-response-children",
					eventBus: __props.eventBus,
					response: __props.response
				}, null, 8, ["eventBus", "response"])) : createCommentVNode("", true)], 2), createVNode(SectionFilter_default, {
					modelValue: activeFilter.value,
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => activeFilter.value = $event),
					filterIds: filterIds.value,
					filters: filters.value
				}, null, 8, [
					"modelValue",
					"filterIds",
					"filters"
				])])]),
				default: withCtx(() => [createElementVNode("div", {
					id: filterIds.value.All,
					class: normalizeClass(["custom-scroll response-section-content relative grid h-full justify-stretch", { "content-start": __props.response }]),
					role: activeFilter.value === "All" && __props.response ? "tabpanel" : "none"
				}, [!__props.response ? (openBlock(), createBlock(ResponseEmpty_default, {
					key: 0,
					appVersion: __props.appVersion,
					layout: __props.layout,
					totalPerformedRequests: __props.totalPerformedRequests,
					onAddRequest: _cache[1] || (_cache[1] = ($event) => __props.eventBus.emit("ui:open:command-palette", {
						action: "create-request",
						payload: void 0
					})),
					onOpenCommandPalette: _cache[2] || (_cache[2] = ($event) => __props.eventBus.emit("ui:open:command-palette")),
					onSendRequest: _cache[3] || (_cache[3] = ($event) => __props.eventBus.emit("operation:send:request:hotkey"))
				}, null, 8, [
					"appVersion",
					"layout",
					"totalPerformedRequests"
				])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
					isSectionVisible("Cookies") ? (openBlock(), createBlock(ResponseCookies_default, {
						key: 0,
						id: filterIds.value.Cookies,
						class: "response-section-content-cookies",
						cookies: responseCookies.value,
						role: activeFilter.value === "All" ? "none" : "tabpanel"
					}, null, 8, [
						"id",
						"cookies",
						"role"
					])) : createCommentVNode("", true),
					isSectionVisible("Headers") ? (openBlock(), createBlock(Headers_default, {
						key: 1,
						id: filterIds.value.Headers,
						class: "response-section-content-headers",
						headers: requestHeaders.value,
						role: activeFilter.value === "All" ? "none" : "tabpanel"
					}, {
						title: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode("Request Headers", -1)])]),
						_: 1
					}, 8, [
						"id",
						"headers",
						"role"
					])) : createCommentVNode("", true),
					isSectionVisible("Headers") ? (openBlock(), createBlock(Headers_default, {
						key: 2,
						id: filterIds.value.Headers,
						class: "response-section-content-headers",
						headers: responseHeaders.value,
						role: activeFilter.value === "All" ? "none" : "tabpanel"
					}, {
						title: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("Response Headers", -1)])]),
						_: 1
					}, 8, [
						"id",
						"headers",
						"role"
					])) : createCommentVNode("", true),
					(openBlock(true), createElementBlock(Fragment, null, renderList(__props.plugins, (plugin, index) => {
						return openBlock(), createBlock(unref(ScalarErrorBoundary), { key: index }, {
							default: withCtx(() => [plugin?.components?.response ? withDirectives((openBlock(), createBlock(resolveDynamicComponent(plugin.components.response.component), mergeProps({
								key: 0,
								ref_for: true
							}, plugin.components.response.additionalProps), null, 16)), [[vShow, activeFilter.value === "All"]]) : createCommentVNode("", true)]),
							_: 2
						}, 1024);
					}), 128)),
					activeFilter.value === "All" || activeFilter.value === "Body" ? (openBlock(), createElementBlock(Fragment, { key: 3 }, ["reader" in __props.response ? (openBlock(), createBlock(ResponseBodyStreaming_default, {
						key: 0,
						id: filterIds.value.Body,
						class: "response-section-content-body",
						reader: __props.response.reader
					}, null, 8, ["id", "reader"])) : shouldVirtualize.value && typeof __props.response?.data === "string" ? (openBlock(), createBlock(ResponseBodyVirtual_default, {
						key: 1,
						id: filterIds.value.Body,
						content: __props.response.data,
						data: __props.response?.data,
						headers: responseHeaders.value,
						role: activeFilter.value === "All" ? "none" : "tabpanel"
					}, null, 8, [
						"id",
						"content",
						"data",
						"headers",
						"role"
					])) : (openBlock(), createBlock(ResponseBody_default, {
						key: 2,
						id: filterIds.value.Body,
						active: true,
						class: "response-section-content-body",
						data: __props.response?.data,
						headers: responseHeaders.value,
						layout: "client",
						plugins: __props.plugins,
						role: activeFilter.value === "All" ? "none" : "tabpanel",
						title: "Body"
					}, null, 8, [
						"id",
						"data",
						"headers",
						"plugins",
						"role"
					]))], 64)) : createCommentVNode("", true)
				], 64)), createVNode(ResponseLoadingOverlay_default, { eventBus: __props.eventBus }, null, 8, ["eventBus"])], 10, _hoisted_2)]),
				_: 1
			});
		};
	}
});
//#endregion
export { ResponseBlock_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ResponseBlock.vue.script.js.map