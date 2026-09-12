import ScalarAsciiArt_default from "../../../../components/ScalarAsciiArt/ScalarAsciiArt.vue.js";
import computer_default from "../../../../assets/computer.ascii.virtual.js";
import { createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, normalizeClass, openBlock, toDisplayString, unref } from "vue";
import { ScalarHotkey } from "@scalar/components/hotkey";
//#region src/v2/blocks/response-block/components/ResponseEmpty.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex-center relative flex flex-1 flex-col gap-6 p-2 capitalize" };
var _hoisted_2 = {
	key: 0,
	class: "scalar-version-number"
};
var _hoisted_3 = { class: "text-c-3 right-4 mt-auto flex w-full flex-col items-end gap-2 text-sm" };
var ResponseEmpty_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ResponseEmpty",
	props: {
		layout: {},
		totalPerformedRequests: {},
		appVersion: {}
	},
	emits: [
		"addRequest",
		"sendRequest",
		"openCommandPalette"
	],
	setup(__props, { emit: __emit }) {
		const emits = __emit;
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("div", { class: normalizeClass(["flex h-[calc(100%_-_50px)] flex-col items-center justify-center", { "hidden opacity-0": __props.totalPerformedRequests > 0 && __props.layout !== "modal" }]) }, [
				__props.layout !== "modal" ? (openBlock(), createElementBlock("div", _hoisted_2, [createTextVNode(" Scalar App V" + toDisplayString(__props.appVersion) + " Beta ", 1), _cache[3] || (_cache[3] = createElementVNode("div", { class: "mt-2" }, [createElementVNode("a", {
					href: "https://github.com/scalar/scalar/issues/2669",
					target: "_blank"
				}, " Roadmap ")], -1))])) : createCommentVNode("", true),
				_cache[4] || (_cache[4] = createElementVNode("a", {
					class: "gitbook-show scalar-version-number",
					href: "https://www.scalar.com",
					target: "_blank"
				}, " Powered By Scalar.com ", -1)),
				createVNode(unref(ScalarAsciiArt_default), {
					art: unref(computer_default),
					class: "text-c-3"
				}, null, 8, ["art"])
			], 2), createElementVNode("div", _hoisted_3, [
				__props.layout !== "modal" ? (openBlock(), createElementBlock("button", {
					key: 0,
					class: "flex items-center gap-1.5",
					type: "button",
					onClick: _cache[0] || (_cache[0] = ($event) => emits("openCommandPalette"))
				}, [_cache[5] || (_cache[5] = createTextVNode(" Get Started ", -1)), createVNode(unref(ScalarHotkey), {
					hotkey: "k",
					modifier: ["default"]
				})])) : createCommentVNode("", true),
				__props.layout === "desktop" ? (openBlock(), createElementBlock("button", {
					key: 1,
					class: "flex items-center gap-1.5",
					type: "button",
					onClick: _cache[1] || (_cache[1] = ($event) => emits("addRequest"))
				}, [_cache[6] || (_cache[6] = createTextVNode(" New Request ", -1)), createVNode(unref(ScalarHotkey), { hotkey: "N" })])) : createCommentVNode("", true),
				createElementVNode("button", {
					class: "flex items-center gap-1.5",
					type: "button",
					onClick: _cache[2] || (_cache[2] = ($event) => emits("sendRequest"))
				}, [_cache[7] || (_cache[7] = createTextVNode(" Send Request ", -1)), createVNode(unref(ScalarHotkey), { hotkey: "↵" })])
			])]);
		};
	}
});
//#endregion
export { ResponseEmpty_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ResponseEmpty.vue.script.js.map