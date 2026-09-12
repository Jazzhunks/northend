import ScalarComboboxOptions_default from "./ScalarComboboxOptions.vue.js";
import ScalarComboboxPopover_default from "./ScalarComboboxPopover.vue.js";
import { createBlock, createSlots, createVNode, defineComponent, guardReactiveProps, mergeModels, normalizeProps, openBlock, renderSlot, useModel, withCtx } from "vue";
var ScalarCombobox_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarCombobox",
	props: /* @__PURE__ */ mergeModels({
		options: {},
		placeholder: {},
		filterFn: { type: Function },
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
	}, {
		"modelValue": {},
		"modelModifiers": {}
	}),
	emits: /* @__PURE__ */ mergeModels(["add"], ["update:modelValue"]),
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const model = useModel(__props, "modelValue");
		return (_ctx, _cache) => {
			return openBlock(), createBlock(ScalarComboboxPopover_default, {
				middleware: __props.middleware,
				offset: __props.offset,
				placement: __props.placement ?? "bottom-start",
				resize: __props.resize,
				target: __props.target,
				teleport: __props.teleport
			}, {
				default: withCtx(({ open }) => [renderSlot(_ctx.$slots, "default", { open })]),
				popover: withCtx(({ open, close }) => [createVNode(ScalarComboboxOptions_default, {
					filterFn: __props.filterFn,
					modelValue: model.value ? [model.value] : [],
					open,
					options: __props.options,
					placeholder: __props.placeholder,
					onAdd: () => (close(), emit("add")),
					"onUpdate:modelValue": (v) => (close(), model.value = v[0])
				}, createSlots({ _: 2 }, [
					_ctx.$slots.option ? {
						name: "option",
						fn: withCtx((props) => [renderSlot(_ctx.$slots, "option", normalizeProps(guardReactiveProps(props)))]),
						key: "0"
					} : void 0,
					_ctx.$slots.group ? {
						name: "group",
						fn: withCtx((props) => [renderSlot(_ctx.$slots, "group", normalizeProps(guardReactiveProps(props)))]),
						key: "1"
					} : void 0,
					_ctx.$slots.add ? {
						name: "add",
						fn: withCtx((props) => [renderSlot(_ctx.$slots, "add", normalizeProps(guardReactiveProps(props)))]),
						key: "2"
					} : void 0
				]), 1032, [
					"filterFn",
					"modelValue",
					"open",
					"options",
					"placeholder",
					"onAdd",
					"onUpdate:modelValue"
				])]),
				_: 3
			}, 8, [
				"middleware",
				"offset",
				"placement",
				"resize",
				"target",
				"teleport"
			]);
		};
	}
});
//#endregion
export { ScalarCombobox_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarCombobox.vue.script.js.map