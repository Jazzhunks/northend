import { URLS } from "../consts/urls.js";
import { useSignupLink } from "../hooks/use-signup-link.js";
import { createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, openBlock, ref, unref, vShow, withDirectives } from "vue";
import { ScalarIconInfo, ScalarIconX } from "@scalar/icons";
//#region src/components/FreeMessagesInfoSection.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "freeMessagesInfoSection" };
var _hoisted_2 = { class: "infoText flex items-center gap-1.5" };
var _hoisted_3 = ["href"];
var _hoisted_4 = { class: "actionsContainer" };
var _hoisted_5 = ["href"];
var FreeMessagesInfoSection_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "FreeMessagesInfoSection",
	setup(__props) {
		const isDismissed = ref(false);
		const { signupLink } = useSignupLink();
		/**
		* Dismiss the free messages info section.
		*/
		function dismiss() {
			isDismissed.value = true;
		}
		return (_ctx, _cache) => {
			return withDirectives((openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("strong", _hoisted_2, [
				createVNode(unref(ScalarIconInfo), {
					class: "text-blue size-4",
					weight: "bold"
				}),
				createElementVNode("a", {
					class: "underline",
					href: unref(signupLink),
					target: "_blank"
				}, "Sign up for Agent Scalar", 8, _hoisted_3),
				_cache[0] || (_cache[0] = createTextVNode(" to continue without hitting limits. ", -1))
			]), createElementVNode("div", _hoisted_4, [createElementVNode("a", {
				class: "actionButton upgradeButton",
				href: unref(URLS).AGENT_SCALAR_DOCUMENTATION,
				target: "_blank",
				type: "button"
			}, " Read more ", 8, _hoisted_5), createElementVNode("button", {
				"aria-label": "Close",
				class: "closeButton",
				type: "button",
				onClick: dismiss
			}, [createVNode(unref(ScalarIconX), {
				class: "size-4",
				weight: "bold"
			})])])], 512)), [[vShow, !isDismissed.value]]);
		};
	}
});
//#endregion
export { FreeMessagesInfoSection_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=FreeMessagesInfoSection.vue.script.js.map