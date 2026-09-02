import ScalarFloating_default from "../ScalarFloating/ScalarFloating.vue.js";
import ScalarFloatingBackdrop_default from "../ScalarFloating/ScalarFloatingBackdrop.vue.js";
import ScalarListboxItem_default from "./ScalarListboxItem.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { Fragment, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeProps, openBlock, renderList, renderSlot, toDisplayString, unref, withCtx } from "vue";
import { Listbox, ListboxButton, ListboxLabel, ListboxOptions } from "@headlessui/vue";
//#region src/components/ScalarListbox/ScalarListbox.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "custom-scroll min-h-0 flex-1" };
var ScalarListbox_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarListbox",
	props: {
		options: {},
		id: {},
		label: {},
		multiple: { type: Boolean },
		modelValue: {},
		placement: {},
		offset: { type: [
			Number,
			Object,
			Function
		] },
		resize: { type: Boolean },
		target: {},
		middleware: {},
		teleport: { type: [Boolean, String] }
	},
	emits: ["update:modelValue"],
	setup(__props) {
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Listbox), {
				modelValue: __props.modelValue,
				multiple: __props.multiple,
				"onUpdate:modelValue": _cache[0] || (_cache[0] = (v) => _ctx.$emit("update:modelValue", v))
			}, {
				default: withCtx(({ open }) => [__props.label ? (openBlock(), createBlock(unref(ListboxLabel), {
					key: 0,
					class: "sr-only"
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(__props.label), 1)]),
					_: 1
				})) : createCommentVNode("", true), createVNode(unref(ScalarFloating_default), mergeProps(_ctx.$props, { placement: __props.placement ?? "bottom-start" }), {
					floating: withCtx(({ width }) => [open ? (openBlock(), createElementBlock("div", mergeProps({
						key: 0,
						style: { width }
					}, unref(cx)("relative flex max-h-[inherit] w-40 max-w-[inherit] rounded text-sm")), [createElementVNode("div", _hoisted_1, [createVNode(unref(ListboxOptions), { class: "flex flex-col gap-0.75 p-0.75 -outline-offset-1" }, {
						default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (option) => {
							return openBlock(), createBlock(ScalarListboxItem_default, {
								key: option.id,
								multiselect: __props.multiple,
								option
							}, null, 8, ["multiselect", "option"]);
						}), 128))]),
						_: 1
					})]), createVNode(unref(ScalarFloatingBackdrop_default))], 16)) : createCommentVNode("", true)]),
					default: withCtx(() => [createVNode(unref(ListboxButton), {
						id: __props.id,
						as: "template"
					}, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open })]),
						_: 2
					}, 1032, ["id"])]),
					_: 2
				}, 1040, ["placement"])]),
				_: 3
			}, 8, ["modelValue", "multiple"]);
		};
	}
});
//#endregion
export { ScalarListbox_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarListbox.vue.script.js.map