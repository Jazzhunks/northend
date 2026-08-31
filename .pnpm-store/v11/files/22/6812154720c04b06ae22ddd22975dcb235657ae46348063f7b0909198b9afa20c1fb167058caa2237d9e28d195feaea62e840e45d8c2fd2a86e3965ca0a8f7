import { createCommentVNode, createElementBlock, defineComponent, openBlock, renderSlot, useId } from "vue";
//#region src/components/ScalarCombobox/ScalarComboboxOptionGroup.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = [
	"id",
	"aria-labelledby",
	"role"
];
var _hoisted_2 = ["id"];
var ScalarComboboxOptionGroup_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarComboboxOptionGroup",
	props: {
		id: { default: () => useId() },
		hidden: {
			type: Boolean,
			default: false
		}
	},
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				id: __props.id,
				"aria-labelledby": __props.id ? `${__props.id}-label` : void 0,
				class: "contents",
				role: __props.hidden ? void 0 : "group"
			}, [!__props.hidden ? (openBlock(), createElementBlock("div", {
				key: 0,
				id: `${__props.id}-label`,
				class: "min-w-0 truncate px-2.5 py-1.5 text-c-2"
			}, [renderSlot(_ctx.$slots, "label")], 8, _hoisted_2)) : createCommentVNode("", true), renderSlot(_ctx.$slots, "default")], 8, _hoisted_1);
		};
	}
});
//#endregion
export { ScalarComboboxOptionGroup_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarComboboxOptionGroup.vue.script.js.map