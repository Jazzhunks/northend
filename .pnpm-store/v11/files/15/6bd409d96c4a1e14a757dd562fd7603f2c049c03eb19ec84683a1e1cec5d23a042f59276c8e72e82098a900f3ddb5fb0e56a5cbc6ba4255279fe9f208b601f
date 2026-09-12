import AutosendPaused_default from "./AutosendPaused.vue.js";
import BuildingRequest_default from "./BuildingRequest.vue.js";
import RequestApproved_default from "./RequestApproved.vue.js";
import RequestFailed_default from "./RequestFailed.vue.js";
import RequestRejected_default from "./RequestRejected.vue.js";
import RequestSuccess_default from "./RequestSuccess.vue.js";
import { getMediaTypeConfig } from "./ResponseBody/helpers/media-types.js";
import { processResponseBody } from "./ResponseBody/helpers/process-response-body.js";
import ResponseBody_default from "./ResponseBody/ResponseBody.vue.js";
import ResponseBodyToggle_default from "./ResponseBody/ResponseBodyToggle.vue.js";
import SendingRequest_default from "./SendingRequest.vue.js";
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, normalizeClass, openBlock, ref, unref } from "vue";
import { ScalarIconCaretDown, ScalarIconCaretRight } from "@scalar/icons";
import { ScalarCodeBlock } from "@scalar/components/code-block";
//#region src/components/RequestPreview.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 1,
	class: "autosendContainer"
};
var _hoisted_2 = {
	key: 2,
	class: "autosendContainer"
};
var _hoisted_3 = { class: "requestContent" };
var _hoisted_4 = { class: "requestContentInner" };
var _hoisted_5 = {
	key: 0,
	class: "code"
};
var _hoisted_6 = {
	key: 1,
	class: "code"
};
var _hoisted_7 = { class: "requestHeaderContainer" };
var RequestPreview_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "RequestPreview",
	props: {
		request: {},
		response: {},
		state: {}
	},
	setup(__props) {
		const responseData = computed(() => {
			if (__props.response?.success) return {
				data: __props.response.data.responseBody,
				headers: __props.response.data.headers
			};
			if (__props.response?.error?.code === "REQUEST_NOT_OK") return {
				data: __props.response.error.detail.responseBody,
				headers: __props.response.error.detail.headers
			};
		});
		const showRequestToggle = ref(false);
		/** Show request preview automatically for failed requests or when approval is required. */
		const shouldShowRequest = computed(() => {
			if (__props.state === "requestFailed" || __props.state === "requiresApproval") return true;
			return showRequestToggle.value;
		});
		const responseBody = computed(() => processResponseBody({
			data: responseData.value?.data,
			headers: responseData.value?.headers
		}));
		const mediaConfig = computed(() => getMediaTypeConfig(responseBody.value.mimeType?.essence ?? ""));
		const displayToggle = ref();
		function toggleDisplay(mode) {
			displayToggle.value = mode;
		}
		const displayMode = computed(() => {
			if (displayToggle.value) return displayToggle.value;
			if (mediaConfig.value?.raw && !mediaConfig.value.preview) return "raw";
			if (mediaConfig.value?.preview) return "preview";
			return "raw";
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", { class: normalizeClass(["requestPreview", {
				open: shouldShowRequest.value,
				succeeded: __props.state === "requestSucceeded"
			}]) }, [__props.state === "approved" ? (openBlock(), createBlock(RequestApproved_default, { key: 0 })) : __props.state === "buildingRequest" ? (openBlock(), createElementBlock("div", _hoisted_1, [createVNode(BuildingRequest_default)])) : __props.state === "requiresApproval" ? (openBlock(), createElementBlock("div", _hoisted_2, [createVNode(AutosendPaused_default)])) : __props.state === "sendingRequest" ? (openBlock(), createElementBlock("button", {
				key: 3,
				class: "toggleButton",
				type: "button",
				onClick: _cache[0] || (_cache[0] = ($event) => showRequestToggle.value = !showRequestToggle.value)
			}, [createVNode(SendingRequest_default), shouldShowRequest.value ? (openBlock(), createBlock(unref(ScalarIconCaretDown), { key: 0 })) : (openBlock(), createBlock(unref(ScalarIconCaretRight), { key: 1 }))])) : __props.state === "requestSucceeded" ? (openBlock(), createElementBlock("button", {
				key: 4,
				class: "toggleButton",
				type: "button",
				onClick: _cache[1] || (_cache[1] = ($event) => showRequestToggle.value = !showRequestToggle.value)
			}, [createVNode(RequestSuccess_default), shouldShowRequest.value ? (openBlock(), createBlock(unref(ScalarIconCaretDown), { key: 0 })) : (openBlock(), createBlock(unref(ScalarIconCaretRight), { key: 1 }))])) : __props.state === "rejected" ? (openBlock(), createElementBlock("button", {
				key: 5,
				class: "toggleButton",
				type: "button",
				onClick: _cache[2] || (_cache[2] = ($event) => showRequestToggle.value = !showRequestToggle.value)
			}, [createVNode(RequestRejected_default), shouldShowRequest.value ? (openBlock(), createBlock(unref(ScalarIconCaretDown), { key: 0 })) : (openBlock(), createBlock(unref(ScalarIconCaretRight), { key: 1 }))])) : __props.state === "requestFailed" ? (openBlock(), createBlock(RequestFailed_default, { key: 6 })) : createCommentVNode("", true), createElementVNode("div", _hoisted_3, [createElementVNode("div", _hoisted_4, [__props.request ? (openBlock(), createElementBlock("div", _hoisted_5, [_cache[4] || (_cache[4] = createElementVNode("div", { class: "requestHeaderContainer" }, [createElementVNode("h1", null, "Request")], -1)), createVNode(unref(ScalarCodeBlock), {
				class: "codeBlock",
				content: JSON.stringify(__props.request, null, 2),
				lang: "json"
			}, null, 8, ["content"])])) : createCommentVNode("", true), responseData.value ? (openBlock(), createElementBlock("div", _hoisted_6, [createElementVNode("div", _hoisted_7, [_cache[5] || (_cache[5] = createElementVNode("h1", null, "Response", -1)), mediaConfig.value?.raw && mediaConfig.value.preview ? (openBlock(), createBlock(ResponseBodyToggle_default, {
				key: 0,
				modelValue: displayMode.value,
				"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => displayMode.value = $event),
				onToggle: toggleDisplay
			}, null, 8, ["modelValue"])) : createCommentVNode("", true)]), createVNode(ResponseBody_default, {
				data: responseData.value.data,
				display: displayMode.value,
				mediaConfig: mediaConfig.value,
				responseBody: responseBody.value
			}, null, 8, [
				"data",
				"display",
				"mediaConfig",
				"responseBody"
			])])) : createCommentVNode("", true)])])], 2);
		};
	}
});
//#endregion
export { RequestPreview_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=RequestPreview.vue.script.js.map