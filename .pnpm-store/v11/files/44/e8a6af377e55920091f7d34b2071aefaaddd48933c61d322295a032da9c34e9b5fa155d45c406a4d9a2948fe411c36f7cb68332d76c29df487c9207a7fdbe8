import HelpfulLink_default from "../../../../components/HelpfulLink.vue.js";
import { getContentLength } from "../helpers/get-content-length.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, defineComponent, normalizeStyle, onBeforeUnmount, onMounted, openBlock, ref, toDisplayString, unref, withCtx } from "vue";
import { httpStatusCodes } from "@scalar/helpers/http/http-status-codes";
import prettyMilliseconds from "pretty-ms";
//#region src/v2/blocks/response-block/components/ResponseMetaInformation.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "text-c-1 flex gap-1.5" };
var _hoisted_2 = { key: 0 };
var _hoisted_3 = { key: 0 };
var _hoisted_4 = { key: 1 };
var ResponseMetaInformation_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ResponseMetaInformation",
	props: {
		response: {},
		eventBus: {}
	},
	setup(__props) {
		const interval = ref();
		const stopwatch = ref(0);
		const stopStopwatch = () => {
			clearInterval(interval.value);
			interval.value = void 0;
			stopwatch.value = 0;
		};
		const startStopwatch = () => {
			interval.value = setInterval(() => stopwatch.value += 1e3, 1e3);
		};
		onMounted(() => {
			__props.eventBus.on("hooks:on:request:sent", startStopwatch);
			__props.eventBus.on("hooks:on:request:complete", stopStopwatch);
		});
		onBeforeUnmount(() => {
			__props.eventBus.off("hooks:on:request:sent", startStopwatch);
			__props.eventBus.off("hooks:on:request:complete", stopStopwatch);
			stopStopwatch();
		});
		/** Status text for the response */
		const statusCodeInformation = computed(() => {
			const responseStatusCode = __props.response?.status;
			if (!responseStatusCode) return;
			return httpStatusCodes[responseStatusCode] ?? void 0;
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [interval.value && stopwatch.value ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString(unref(prettyMilliseconds)(stopwatch.value)), 1)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
				createElementVNode("span", null, [_cache[0] || (_cache[0] = createElementVNode("span", { class: "sr-only" }, "Response Information, Duration:", -1)), createTextVNode(" " + toDisplayString(unref(prettyMilliseconds)(__props.response.duration)), 1)]),
				unref(getContentLength)(__props.response) ? (openBlock(), createElementBlock("span", _hoisted_3, [_cache[1] || (_cache[1] = createElementVNode("span", { class: "sr-only" }, ", Size:", -1)), createTextVNode(" " + toDisplayString(unref(getContentLength)(__props.response)), 1)])) : createCommentVNode("", true),
				statusCodeInformation.value ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [_cache[2] || (_cache[2] = createElementVNode("span", { class: "sr-only" }, ", Status:", -1)), statusCodeInformation.value.url ? (openBlock(), createBlock(HelpfulLink_default, {
					key: 0,
					class: "flex items-center gap-1.5",
					href: statusCodeInformation.value.url
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(__props.response.status) + " " + toDisplayString(statusCodeInformation.value.name) + " ", 1), createElementVNode("span", {
						class: "block h-1.5 w-1.5 rounded-full",
						style: normalizeStyle({ backgroundColor: statusCodeInformation.value.color })
					}, null, 4)]),
					_: 1
				}, 8, ["href"])) : (openBlock(), createElementBlock("span", _hoisted_4, [createTextVNode(toDisplayString(__props.response.status) + " " + toDisplayString(statusCodeInformation.value.name) + " ", 1), createElementVNode("span", {
					class: "block h-1.5 w-1.5 rounded-full",
					style: normalizeStyle({ backgroundColor: statusCodeInformation.value.color })
				}, null, 4)]))], 64)) : createCommentVNode("", true)
			], 64))]);
		};
	}
});
//#endregion
export { ResponseMetaInformation_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ResponseMetaInformation.vue.script.js.map