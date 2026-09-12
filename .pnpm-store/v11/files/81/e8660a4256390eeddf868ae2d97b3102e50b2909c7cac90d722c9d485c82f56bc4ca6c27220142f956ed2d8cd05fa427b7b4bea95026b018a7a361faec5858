import { createBlock, createElementVNode, createTextVNode, createVNode, defineComponent, openBlock, toDisplayString, unref, withCtx } from "vue";
import { ScalarButton } from "@scalar/components/button";
import { ScalarModal } from "@scalar/components/modal";
//#region src/v2/blocks/scalar-auth-selector-block/components/DeleteRequestAuthModal.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "text-c-2 mb-4 text-sm leading-normal" };
var _hoisted_2 = { class: "flex justify-between gap-2" };
var DeleteRequestAuthModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DeleteRequestAuthModal",
	props: {
		state: {},
		label: {}
	},
	emits: ["close", "delete"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const deleteScheme = () => {
			emit("delete");
		};
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarModal), {
				size: "xxs",
				state: __props.state,
				title: "Delete Security Scheme"
			}, {
				default: withCtx(() => [createElementVNode("p", _hoisted_1, " This cannot be undone. You're about to delete the " + toDisplayString(__props.label) + " security scheme from the collection. ", 1), createElementVNode("div", _hoisted_2, [createVNode(unref(ScalarButton), {
					class: "flex h-8 cursor-pointer items-center gap-1.5 px-3 shadow-none focus:outline-none",
					type: "button",
					variant: "outlined",
					onClick: _cache[0] || (_cache[0] = ($event) => emit("close"))
				}, {
					default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode(" Cancel ", -1)])]),
					_: 1
				}), createVNode(unref(ScalarButton), {
					class: "flex h-8 cursor-pointer items-center gap-1.5 px-3 shadow-none focus:outline-none",
					type: "submit",
					onClick: deleteScheme
				}, {
					default: withCtx(() => [createTextVNode(" Delete " + toDisplayString(__props.label), 1)]),
					_: 1
				})])]),
				_: 1
			}, 8, ["state"]);
		};
	}
});
//#endregion
export { DeleteRequestAuthModal_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=DeleteRequestAuthModal.vue.script.js.map