import ScalarComboboxOptions_default from "./ScalarComboboxOptions.vue.js";
import ScalarComboboxPopover_default from "./ScalarComboboxPopover.vue.js";
import { createBlock, createCommentVNode, createSlots, defineComponent, guardReactiveProps, mergeModels, normalizeProps, openBlock, ref, renderSlot, useModel, withCtx } from "vue";
var ScalarComboboxMultiselect_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarComboboxMultiselect",
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
		"modelValue": { default: [] },
		"modelModifiers": {}
	}),
	emits: /* @__PURE__ */ mergeModels(["add"], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const emit = __emit;
		const model = useModel(__props, "modelValue");
		/** Propagate up the popover ref */
		const comboboxPopoverRef = ref(null);
		__expose({ comboboxPopoverRef });
		return (_ctx, _cache) => {
			return openBlock(), createBlock(ScalarComboboxPopover_default, {
				ref_key: "comboboxPopoverRef",
				ref: comboboxPopoverRef,
				middleware: __props.middleware,
				offset: __props.offset,
				placement: __props.placement ?? "bottom-start",
				resize: __props.resize,
				target: __props.target,
				teleport: __props.teleport
			}, {
				default: withCtx(({ open }) => [renderSlot(_ctx.$slots, "default", { open })]),
				popover: withCtx(({ open }) => [__props.options?.length ? (openBlock(), createBlock(ScalarComboboxOptions_default, {
					key: 0,
					modelValue: model.value,
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
					filterFn: __props.filterFn,
					multiselect: "",
					open,
					options: __props.options,
					placeholder: __props.placeholder,
					onAdd: _cache[1] || (_cache[1] = ($event) => emit("add"))
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
					"modelValue",
					"filterFn",
					"open",
					"options",
					"placeholder"
				])) : createCommentVNode("", true)]),
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
export { ScalarComboboxMultiselect_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarComboboxMultiselect.vue.script.js.map