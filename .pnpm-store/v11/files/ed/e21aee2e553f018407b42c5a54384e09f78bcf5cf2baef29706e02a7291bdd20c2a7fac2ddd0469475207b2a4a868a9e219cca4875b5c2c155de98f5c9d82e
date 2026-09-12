import ScalarFormInput_default from "../ScalarForm/ScalarFormInput.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createCommentVNode, createElementBlock, createElementVNode, defineComponent, mergeModels, mergeProps, onMounted, openBlock, ref, renderSlot, toDisplayString, unref, useModel, vModelDynamic, withCtx, withDirectives } from "vue";
//#region src/components/ScalarTextInput/ScalarTextInput.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex items-center flex-1 relative" };
var _hoisted_2 = {
	key: 0,
	class: "select-none whitespace-nowrap text-transparent"
};
var _hoisted_3 = ["aria-readonly", "readonly"];
var _hoisted_4 = {
	key: 1,
	class: "absolute flex items-center inset-0 select-none overflow-hidden whitespace-nowrap"
};
var _hoisted_5 = {
	key: 0,
	class: "text-c-2"
};
var _hoisted_6 = { class: "text-transparent" };
var _hoisted_7 = {
	key: 1,
	class: "text-c-2"
};
var ScalarTextInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarTextInput",
	props: /* @__PURE__ */ mergeModels({ readonly: { type: Boolean } }, {
		"modelValue": {},
		"modelModifiers": {}
	}),
	emits: /* @__PURE__ */ mergeModels(["click"], ["update:modelValue"]),
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const model = useModel(__props, "modelValue");
		const input = ref();
		const { stylingAttrsCx, otherAttrs } = useBindCx();
		onMounted(() => {
			if ("autofocus" in otherAttrs.value) input.value?.focus();
		});
		function handleClick(event) {
			emit("click", event);
			if (__props.readonly) input.value?.select();
			else input.value?.focus();
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarFormInput_default), mergeProps({ is: "div" }, unref(stylingAttrsCx)("cursor-text text-c-1", __props.readonly ? "" : "focus-within:bg-b-1"), { onClick: handleClick }), {
				default: withCtx(() => [createElementVNode("div", _hoisted_1, [
					_ctx.$slots.prefix ? (openBlock(), createElementBlock("div", _hoisted_2, [renderSlot(_ctx.$slots, "prefix")])) : createCommentVNode("", true),
					withDirectives(createElementVNode("input", mergeProps({
						ref_key: "input",
						ref: input,
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
						"aria-readonly": __props.readonly || void 0,
						class: "z-1 min-w-0 flex-1 rounded-none border-none bg-transparent placeholder:font-[inherit] focus-within:outline-none",
						readonly: __props.readonly
					}, unref(otherAttrs)), null, 16, _hoisted_3), [[vModelDynamic, model.value]]),
					_ctx.$slots.prefix || _ctx.$slots.suffix ? (openBlock(), createElementBlock("div", _hoisted_4, [
						_ctx.$slots.prefix ? (openBlock(), createElementBlock("span", _hoisted_5, [renderSlot(_ctx.$slots, "prefix")])) : createCommentVNode("", true),
						createElementVNode("span", _hoisted_6, toDisplayString(model.value || _ctx.$attrs.placeholder), 1),
						_ctx.$slots.suffix ? (openBlock(), createElementBlock("span", _hoisted_7, [renderSlot(_ctx.$slots, "suffix")])) : createCommentVNode("", true)
					])) : createCommentVNode("", true)
				]), renderSlot(_ctx.$slots, "aside")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
export { ScalarTextInput_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarTextInput.vue.script.js.map