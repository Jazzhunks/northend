import ScalarCopyButton_default from "./ScalarCopyButton.vue.js";
import { createBlock, createSlots, defineComponent, mergeModels, onMounted, openBlock, renderSlot, unref, useModel, watch, withCtx } from "vue";
import { useClipboard } from "@vueuse/core";
var ScalarCopy_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarCopy",
	props: /* @__PURE__ */ mergeModels({
		content: { default: "" },
		placement: {},
		showLabel: { type: Boolean },
		duration: { default: 1500 },
		immediate: { type: Boolean }
	}, {
		"copied": {
			type: Boolean,
			default: false
		},
		"copiedModifiers": {}
	}),
	emits: ["update:copied"],
	setup(__props) {
		const copied = useModel(__props, "copied");
		onMounted(() => {
			if (__props.immediate) copy(__props.content);
		});
		const { copy, copied: clipboardCopied } = useClipboard({
			legacy: true,
			copiedDuring: __props.duration
		});
		/** Watch the clipboard copied state and emit it to the consuming component */
		watch(clipboardCopied, (v) => copied.value = v);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(ScalarCopyButton_default, {
				copied: copied.value || unref(clipboardCopied),
				placement: __props.placement,
				showLabel: __props.showLabel,
				onClick: _cache[0] || (_cache[0] = ($event) => unref(copy)(__props.content))
			}, createSlots({ _: 2 }, [
				_ctx.$slots.copy ? {
					name: "copy",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "copy")]),
					key: "0"
				} : void 0,
				_ctx.$slots.copied ? {
					name: "copied",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "copied")]),
					key: "1"
				} : void 0,
				_ctx.$slots.backdrop ? {
					name: "backdrop",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "backdrop")]),
					key: "2"
				} : void 0
			]), 1032, [
				"copied",
				"placement",
				"showLabel"
			]);
		};
	}
});
//#endregion
export { ScalarCopy_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarCopy.vue.script.js.map