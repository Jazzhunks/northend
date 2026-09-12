import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { computed, createBlock, createElementVNode, defineComponent, mergeProps, openBlock, resolveDynamicComponent, unref, withCtx } from "vue";
var ScalarColorModeToggleIcon_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarColorModeToggleIcon",
	props: {
		is: { default: "button" },
		mode: { default: "light" }
	},
	setup(__props) {
		const { cx } = useBindCx();
		const ariaLabel = computed(() => __props.mode === "dark" ? "Set light mode" : "Set dark mode");
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.is), mergeProps({
				"aria-label": ariaLabel.value,
				class: `toggle-icon-${__props.mode}`,
				type: __props.is === "button" ? "button" : void 0
			}, unref(cx)("size-3 flex items-center justify-center text-c-1")), {
				default: withCtx(() => [..._cache[0] || (_cache[0] = [
					createElementVNode("span", { class: "toggle-icon-sun-ray" }, null, -1),
					createElementVNode("span", { class: "toggle-icon-sun-ray" }, null, -1),
					createElementVNode("span", { class: "toggle-icon-sun-ray" }, null, -1),
					createElementVNode("span", { class: "toggle-icon-sun-ray" }, null, -1),
					createElementVNode("span", { class: "toggle-icon-ellipse" }, [createElementVNode("span", { class: "toggle-icon-moon-mask" })], -1)
				])]),
				_: 1
			}, 16, [
				"aria-label",
				"class",
				"type"
			]);
		};
	}
});
//#endregion
export { ScalarColorModeToggleIcon_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarColorModeToggleIcon.vue.script.js.map