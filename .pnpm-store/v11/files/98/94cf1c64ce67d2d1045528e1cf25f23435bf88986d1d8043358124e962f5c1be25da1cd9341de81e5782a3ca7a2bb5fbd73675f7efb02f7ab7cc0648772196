import { createBlock, createCommentVNode, createElementBlock, defineComponent, normalizeClass, openBlock, unref } from "vue";
import { ScalarIconCheck, ScalarIconMinus } from "@scalar/icons";
var ScalarCheckbox_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarCheckbox",
	props: {
		selected: { type: Boolean },
		indeterminate: {
			type: Boolean,
			default: false
		},
		type: { default: "checkbox" }
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", { class: normalizeClass(["flex size-4 items-center justify-center p-0.75", [props.selected ? "bg-c-accent text-b-1" : props.indeterminate && props.type === "checkbox" ? "bg-c-accent text-b-1" : "text-transparent shadow-border", props.type === "checkbox" ? "rounded" : "rounded-full"]]) }, [props.selected ? (openBlock(), createBlock(unref(ScalarIconCheck), {
				key: 0,
				class: "size-3",
				weight: "bold"
			})) : props.indeterminate && props.type === "checkbox" ? (openBlock(), createBlock(unref(ScalarIconMinus), {
				key: 1,
				"aria-hidden": "true",
				class: "size-3",
				weight: "bold"
			})) : createCommentVNode("", true)], 2);
		};
	}
});
//#endregion
export { ScalarCheckbox_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarCheckbox.vue.script.js.map