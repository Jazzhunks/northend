import DataTableCell_default from "./DataTableCell.vue.js";
import { createBlock, createElementVNode, createVNode, defineComponent, normalizeClass, openBlock, unref, withCtx } from "vue";
import { cva } from "@scalar/use-hooks/useBindCx";
import { ScalarIcon } from "@scalar/components/icon";
//#region src/v2/components/data-table/DataTableCheckbox.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["checked", "disabled"];
var DataTableCheckbox_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DataTableCheckbox",
	props: {
		modelValue: { type: Boolean },
		disabled: { type: Boolean },
		align: { default: "center" }
	},
	emits: ["update:modelValue"],
	setup(__props) {
		const variants = cva({
			base: "w-8 h-8 flex items-center justify-center text-b-2 peer-checked:text-c-1 pointer-events-none absolute",
			variants: { align: {
				left: "left-0",
				center: "centered"
			} }
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(DataTableCell_default, { class: "group/cell relative flex min-w-8" }, {
				default: withCtx(() => [createElementVNode("input", {
					checked: __props.modelValue,
					class: "peer absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-default",
					disabled: Boolean(__props.disabled),
					type: "checkbox",
					onChange: _cache[0] || (_cache[0] = (e) => _ctx.$emit("update:modelValue", e.target.checked))
				}, null, 40, _hoisted_1), createElementVNode("div", { class: normalizeClass(unref(variants)({ align: __props.align })) }, [createElementVNode("div", { class: normalizeClass(["absolute m-auto size-3/4 rounded border-[1px] opacity-0", !__props.disabled && "group-has-[:focus-visible]/cell:border-c-accent group-hover:opacity-100 group-has-[:focus-visible]/cell:opacity-100"]) }, null, 2), createVNode(unref(ScalarIcon), {
					icon: "Checkmark",
					size: "xs",
					thickness: "2.5"
				})], 2)]),
				_: 1
			});
		};
	}
});
//#endregion
export { DataTableCheckbox_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=DataTableCheckbox.vue.script.js.map