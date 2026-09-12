import { createElementBlock, defineComponent, normalizeClass, openBlock, renderSlot } from "vue";
//#region src/components/SectionFilterButton.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = [
	"aria-controls",
	"aria-selected",
	"tabindex"
];
var SectionFilterButton_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "SectionFilterButton",
	props: {
		selected: { type: Boolean },
		controls: {}
	},
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("button", {
				"aria-controls": __props.controls ?? "",
				"aria-selected": !!__props.selected,
				class: normalizeClass(["hover:bg-b-2 flex w-fit cursor-pointer items-center rounded p-1 px-2 text-center font-medium whitespace-nowrap has-[:focus-visible]:outline", { "text-c-1 pointer-events-none": __props.selected }]),
				role: "tab",
				tabindex: __props.selected ? 0 : -1,
				type: "button"
			}, [renderSlot(_ctx.$slots, "default")], 10, _hoisted_1);
		};
	}
});
//#endregion
export { SectionFilterButton_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=SectionFilterButton.vue.script.js.map