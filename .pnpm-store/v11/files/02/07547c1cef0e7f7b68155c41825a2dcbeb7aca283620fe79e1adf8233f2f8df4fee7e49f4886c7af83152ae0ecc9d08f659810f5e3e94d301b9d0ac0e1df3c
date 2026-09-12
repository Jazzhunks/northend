import ScalarCopyBackdrop_default from "../ScalarCopy/ScalarCopyBackdrop.vue.js";
import ScalarCopyButton_default from "../ScalarCopy/ScalarCopyButton.vue.js";
import ScalarTextInput_default from "./ScalarTextInput.vue.js";
import { createBlock, createSlots, createVNode, defineComponent, mergeModels, onMounted, openBlock, renderSlot, unref, useModel, watch, withCtx, withModifiers } from "vue";
import { useClipboard } from "@vueuse/core";
var ScalarTextInputCopy_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarTextInputCopy",
	props: /* @__PURE__ */ mergeModels({
		duration: { default: 1500 },
		editable: { type: Boolean },
		immediate: { type: Boolean }
	}, {
		"modelValue": {},
		"modelModifiers": {},
		"copied": {
			type: Boolean,
			default: false
		},
		"copiedModifiers": {}
	}),
	emits: ["update:modelValue", "update:copied"],
	setup(__props) {
		onMounted(() => {
			if (__props.immediate && model.value) copy(model.value);
		});
		const model = useModel(__props, "modelValue");
		const copied = useModel(__props, "copied");
		const { copy, copied: clipboardCopied } = useClipboard({
			legacy: true,
			copiedDuring: __props.duration
		});
		/** Watch the clipboard copied state and emit it to the consuming component */
		watch(clipboardCopied, (v) => copied.value = v);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(ScalarTextInput_default, {
				modelValue: model.value,
				"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => model.value = $event),
				readonly: !__props.editable,
				onClick: _cache[2] || (_cache[2] = ($event) => model.value && unref(copy)(model.value))
			}, {
				aside: withCtx(() => [createVNode(unref(ScalarCopyButton_default), {
					class: "z-1",
					copied: copied.value || unref(clipboardCopied),
					placement: "left",
					onClick: _cache[0] || (_cache[0] = withModifiers(($event) => model.value && unref(copy)(model.value), ["stop"]))
				}, createSlots({
					backdrop: withCtx(() => [createVNode(unref(ScalarCopyBackdrop_default), { class: "bg-b-1.5" })]),
					_: 2
				}, [_ctx.$slots.copy ? {
					name: "copy",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "copy")]),
					key: "0"
				} : void 0, _ctx.$slots.copied ? {
					name: "copied",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "copied")]),
					key: "1"
				} : void 0]), 1032, ["copied"])]),
				_: 3
			}, 8, ["modelValue", "readonly"]);
		};
	}
});
//#endregion
export { ScalarTextInputCopy_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarTextInputCopy.vue.script.js.map