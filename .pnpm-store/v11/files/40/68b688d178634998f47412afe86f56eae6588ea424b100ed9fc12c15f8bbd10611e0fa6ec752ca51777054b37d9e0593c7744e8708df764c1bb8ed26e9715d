import { createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, openBlock, unref } from "vue";
import { ScalarIconInfo } from "@scalar/icons";
//#region src/components/ApprovalSection.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "approvalSection" };
var _hoisted_2 = { class: "approvalText flex items-center gap-1.5" };
var _hoisted_3 = { class: "approveContainer" };
var ApprovalSection_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ApprovalSection",
	emits: ["approve", "reject"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("strong", _hoisted_2, [createVNode(unref(ScalarIconInfo), {
				class: "text-blue size-4",
				weight: "bold"
			}), _cache[2] || (_cache[2] = createTextVNode(" One or more requests require approval. ", -1))]), createElementVNode("div", _hoisted_3, [createElementVNode("button", {
				type: "button",
				class: "actionButton rejectButton",
				onClick: _cache[0] || (_cache[0] = ($event) => emit("reject"))
			}, " Reject "), createElementVNode("button", {
				type: "button",
				class: "actionButton approveButton",
				onClick: _cache[1] || (_cache[1] = ($event) => emit("approve"))
			}, " Approve ")])]);
		};
	}
});
//#endregion
export { ApprovalSection_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ApprovalSection.vue.script.js.map