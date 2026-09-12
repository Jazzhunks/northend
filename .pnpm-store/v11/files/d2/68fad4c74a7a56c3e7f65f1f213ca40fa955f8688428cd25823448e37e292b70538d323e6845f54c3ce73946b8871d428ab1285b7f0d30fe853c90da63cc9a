import { cva, cx } from "@scalar/use-hooks/useBindCx";
import { createElementBlock, defineComponent, normalizeClass, openBlock, renderSlot, unref } from "vue";
//#region src/components/ScalarCombobox/ScalarComboboxOption.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-selected"];
var ScalarComboboxOption_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarComboboxOption",
	props: {
		active: { type: Boolean },
		selected: { type: Boolean }
	},
	setup(__props) {
		const variants = cva({
			base: [
				"group/item",
				"flex min-w-0 items-center gap-1.5 rounded px-2 py-1.5 text-left",
				"truncate bg-transparent text-c-1",
				"cursor-pointer hover:bg-b-2"
			],
			variants: {
				selected: { true: "text-c-1" },
				active: { true: "bg-b-2" }
			}
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("li", {
				"aria-selected": __props.selected,
				class: normalizeClass(unref(cx)(unref(variants)({
					active: __props.active,
					selected: __props.selected
				}))),
				role: "option",
				tabindex: "-1"
			}, [renderSlot(_ctx.$slots, "default", {
				active: __props.active,
				selected: __props.selected
			})], 10, _hoisted_1);
		};
	}
});
//#endregion
export { ScalarComboboxOption_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarComboboxOption.vue.script.js.map