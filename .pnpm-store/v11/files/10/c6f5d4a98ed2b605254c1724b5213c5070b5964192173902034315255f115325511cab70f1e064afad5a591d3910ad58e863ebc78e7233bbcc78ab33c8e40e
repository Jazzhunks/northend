import { createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, guardReactiveProps, normalizeProps, openBlock, renderSlot, unref, withCtx, withKeys, withModifiers } from "vue";
import { ScalarButton } from "@scalar/components/button";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
//#region src/v2/features/command-palette/components/CommandActionForm.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex gap-2" };
var _hoisted_2 = { class: "flex max-h-8 flex-1" };
var CommandActionForm_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	name: "CommandActionForm",
	props: {
		loader: {},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	emits: [
		"submit",
		"cancel",
		"back"
	],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const { cx } = useBindCx();
		/** Handle form submission, only emit if not disabled */
		const handleSubmit = () => {
			if (!__props.disabled) emit("submit");
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("form", {
				class: "flex w-full flex-col gap-3",
				onKeydown: _cache[0] || (_cache[0] = withKeys(withModifiers(() => {}, ["stop"]), ["enter"])),
				onSubmit: withModifiers(handleSubmit, ["prevent", "stop"])
			}, [createElementVNode("div", normalizeProps(guardReactiveProps(unref(cx)("relative flex min-h-20 flex-col rounded"))), [renderSlot(_ctx.$slots, "default")], 16), createElementVNode("div", _hoisted_1, [createElementVNode("div", _hoisted_2, [renderSlot(_ctx.$slots, "options")]), createVNode(unref(ScalarButton), {
				class: "max-h-8 px-3 text-xs",
				disabled: __props.disabled,
				loader: __props.loader,
				type: "submit"
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "submit", {}, () => [_cache[1] || (_cache[1] = createTextVNode("Continue", -1))])]),
				_: 3
			}, 8, ["disabled", "loader"])])], 32);
		};
	}
});
//#endregion
export { CommandActionForm_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=CommandActionForm.vue.script.js.map