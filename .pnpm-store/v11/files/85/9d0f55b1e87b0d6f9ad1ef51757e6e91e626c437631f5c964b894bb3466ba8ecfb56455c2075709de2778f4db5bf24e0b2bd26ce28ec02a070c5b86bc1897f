import ScalarListboxCheckbox_default from "./ScalarListboxCheckbox.vue.js";
import { cva, cx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createElementVNode, createVNode, defineComponent, normalizeClass, openBlock, toDisplayString, unref, withCtx } from "vue";
import { ListboxOption } from "@headlessui/vue";
var ScalarListboxItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarListboxItem",
	props: {
		option: {},
		multiselect: { type: Boolean }
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
				active: { true: "bg-b-2" },
				disabled: { true: "pointer-events-none opacity-50" }
			}
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ListboxOption), {
				as: "template",
				disabled: __props.option.disabled,
				value: __props.option
			}, {
				default: withCtx(({ active, selected }) => [createElementVNode("li", { class: normalizeClass(unref(cx)(unref(variants)({
					active,
					selected,
					disabled: __props.option.disabled
				}))) }, [createVNode(ScalarListboxCheckbox_default, {
					multiselect: __props.multiselect,
					selected
				}, null, 8, ["multiselect", "selected"]), createElementVNode("span", { class: normalizeClass(["inline-block min-w-0 flex-1 truncate", __props.option.color ? __props.option.color : "text-c-1"]) }, toDisplayString(__props.option.label), 3)], 2)]),
				_: 1
			}, 8, ["disabled", "value"]);
		};
	}
});
//#endregion
export { ScalarListboxItem_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarListboxItem.vue.script.js.map