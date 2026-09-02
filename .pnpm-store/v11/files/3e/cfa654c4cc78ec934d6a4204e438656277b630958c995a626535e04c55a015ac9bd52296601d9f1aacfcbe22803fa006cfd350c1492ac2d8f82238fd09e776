import SidebarListElementForm_default from "./SidebarListElementForm.vue.js";
import { computed, createBlock, createCommentVNode, createElementBlock, defineComponent, openBlock, toDisplayString, withCtx } from "vue";
//#region src/components/Sidebar/Actions/DeleteSidebarListElement.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "text-c-2 text-sm leading-normal text-pretty"
};
var DeleteSidebarListElement_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DeleteSidebarListElement",
	props: {
		variableName: {},
		warningMessage: {}
	},
	emits: ["close", "delete"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const truncatedName = computed(() => {
			if (props.variableName.length > 18) return props.variableName.slice(0, 18) + "…";
			return props.variableName;
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(SidebarListElementForm_default, {
				danger: "",
				label: `Delete ${truncatedName.value}`,
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
export { DeleteSidebarListElement_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=DeleteSidebarListElement.vue.script.js.map