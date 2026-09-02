import ConfirmationForm_default from "../forms/ConfirmationForm.vue.js";
import { computed, createBlock, createCommentVNode, createElementBlock, defineComponent, openBlock, toDisplayString, unref, withCtx } from "vue";
import { truncate } from "@scalar/helpers/string/truncate";
//#region src/v2/components/modals/DeleteModal.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "text-c-2 text-sm leading-normal text-pretty"
};
var DeleteModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DeleteModal",
	props: {
		name: {},
		warningMessage: {}
	},
	emits: ["close", "delete"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		/** Condenses the name to 18 characters and adds an ellipsis if it's longer */
		const truncatedName = computed(() => truncate(__props.name));
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ConfirmationForm_default), {
				label: `Delete ${truncatedName.value}`,
				variant: "danger",
				onCancel: _cache[0] || (_cache[0] = ($event) => emit("close")),
				onSubmit: _cache[1] || (_cache[1] = ($event) => emit("delete"))
			}, {
				default: withCtx(() => [__props.warningMessage ? (openBlock(), createElementBlock("p", _hoisted_1, toDisplayString(__props.warningMessage), 1)) : createCommentVNode("", true)]),
				_: 1
			}, 8, ["label"]);
		};
	}
});
//#endregion
export { DeleteModal_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=DeleteModal.vue.script.js.map