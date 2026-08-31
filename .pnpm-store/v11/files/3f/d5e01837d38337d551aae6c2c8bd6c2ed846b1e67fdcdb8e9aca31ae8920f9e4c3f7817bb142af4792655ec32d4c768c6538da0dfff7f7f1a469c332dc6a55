import ScalarButton_default from "../ScalarButton/ScalarButton.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { Transition, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeModels, mergeProps, openBlock, renderSlot, unref, useModel, withCtx } from "vue";
import { ScalarIconArrowCounterClockwise, ScalarIconFloppyDisk } from "@scalar/icons";
//#region src/components/ScalarSavePrompt/ScalarSavePrompt.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "min-w-0 flex-1 text-c-1 text-base font-medium" };
var _hoisted_2 = { class: "flex -m-2 shrink-0" };
var ScalarSavePrompt_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarSavePrompt",
	props: /* @__PURE__ */ mergeModels({ loader: {} }, {
		"modelValue": {
			type: Boolean,
			default: false
		},
		"modelModifiers": {}
	}),
	emits: /* @__PURE__ */ mergeModels(["save", "discard"], ["update:modelValue"]),
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const dirty = useModel(__props, "modelValue");
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Transition, {
				enterActiveClass: "transition-transform ease-spring duration-400",
				enterFromClass: "translate-y-[200%]",
				enterToClass: "translate-y-0",
				leaveActiveClass: "transition-transform ease-in duration-100",
				leaveFromClass: "translate-y-0",
				leaveToClass: "translate-y-[200%]"
			}, {
				default: withCtx(() => [dirty.value || __props.loader?.isActive ? (openBlock(), createElementBlock("div", mergeProps({
					key: 0,
					"aria-live": "polite"
				}, unref(cx)("flex items-center gap-2", "w-content max-w-screen-padded-4 z-context", "fixed left-1/2 -translate-x-1/2 bottom-4", "bg-b-2 p-4 shadow-lg rounded-xl")), [createElementVNode("div", _hoisted_1, [renderSlot(_ctx.$slots, "default", {}, () => [_cache[2] || (_cache[2] = createTextVNode("You have unsaved changes", -1))])]), createElementVNode("div", _hoisted_2, [createVNode(unref(ScalarButton_default), {
					size: "sm",
					variant: "ghost",
					onClick: _cache[0] || (_cache[0] = ($event) => emit("discard"))
				}, {
					icon: withCtx(() => [createVNode(unref(ScalarIconArrowCounterClockwise), {
						class: "size-full",
						weight: "bold"
					})]),
					default: withCtx(() => [renderSlot(_ctx.$slots, "discard", {}, () => [_cache[3] || (_cache[3] = createTextVNode("Undo", -1))])]),
					_: 3
				}), createVNode(unref(ScalarButton_default), {
					loader: __props.loader,
					size: "sm",
					onClick: _cache[1] || (_cache[1] = ($event) => emit("save"))
				}, {
					icon: withCtx(() => [createVNode(unref(ScalarIconFloppyDisk), {
						class: "size-full",
						weight: "bold"
					})]),
					default: withCtx(() => [renderSlot(_ctx.$slots, "save", {}, () => [_cache[4] || (_cache[4] = createTextVNode("Save", -1))])]),
					_: 3
				}, 8, ["loader"])])], 16)) : createCommentVNode("", true)]),
				_: 3
			});
		};
	}
});
//#endregion
export { ScalarSavePrompt_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarSavePrompt.vue.script.js.map