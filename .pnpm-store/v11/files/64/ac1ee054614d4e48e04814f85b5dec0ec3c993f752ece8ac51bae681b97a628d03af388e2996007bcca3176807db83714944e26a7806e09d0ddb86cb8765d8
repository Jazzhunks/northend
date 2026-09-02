import ScalarColorModeToggleIcon_default from "./ScalarColorModeToggleIcon.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createElementBlock, createElementVNode, createVNode, defineComponent, mergeProps, normalizeClass, openBlock, unref, useModel } from "vue";
//#region src/components/ScalarColorModeToggle/ScalarColorModeToggleButton.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-pressed"];
var ScalarColorModeToggleButton_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarColorModeToggleButton",
	props: {
		"modelValue": { type: Boolean },
		"modelModifiers": {}
	},
	emits: ["update:modelValue"],
	setup(__props) {
		const { cx } = useBindCx();
		/** Whether the toggle is in dark mode */
		const model = useModel(__props, "modelValue");
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("button", mergeProps({
				"aria-pressed": model.value,
				type: "button"
			}, unref(cx)("group/toggle flex h-6 w-[38px] brightness-lifted -mx-px items-center py-1.5 -my-1.5 relative outline-none"), { onClick: _cache[0] || (_cache[0] = ($event) => model.value = !model.value) }), [_cache[1] || (_cache[1] = createElementVNode("div", { class: "h-3 w-full bg-border mx-px rounded-xl group-focus-visible/toggle:outline -outline-offset-1" }, null, -1)), createElementVNode("div", { class: normalizeClass(["size-[23px] left-border absolute border rounded-full flex items-center justify-center bg-b-1 group-focus-visible/toggle:outline -outline-offset-1 transition-transform duration-300 ease-in-out", { "translate-x-[14px]": model.value }]) }, [createVNode(ScalarColorModeToggleIcon_default, {
				is: "div",
				mode: model.value ? "dark" : "light"
			}, null, 8, ["mode"])], 2)], 16, _hoisted_1);
		};
	}
});
//#endregion
export { ScalarColorModeToggleButton_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarColorModeToggleButton.vue.script.js.map