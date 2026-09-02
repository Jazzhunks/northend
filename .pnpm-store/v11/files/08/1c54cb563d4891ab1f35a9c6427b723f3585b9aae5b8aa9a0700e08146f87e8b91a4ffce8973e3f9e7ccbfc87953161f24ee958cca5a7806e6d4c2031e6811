import ScalarColorModeToggleIcon_default from "./ScalarColorModeToggleIcon.vue.js";
import ScalarColorModeToggleButton_default from "./ScalarColorModeToggleButton.vue.js";
import { computed, createBlock, defineComponent, isRef, openBlock, unref } from "vue";
import { useColorMode } from "@scalar/use-hooks/useColorMode";
var ScalarColorModeToggle_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarColorModeToggle",
	props: { variant: { default: "switch" } },
	setup(__props) {
		const { isDarkMode, toggleColorMode, darkLightMode } = useColorMode();
		const ariaLabel = computed(() => isDarkMode.value ? "Set light mode" : "Set dark mode");
		return (_ctx, _cache) => {
			return __props.variant === "switch" ? (openBlock(), createBlock(ScalarColorModeToggleButton_default, {
				key: 0,
				modelValue: unref(isDarkMode),
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(isDarkMode) ? isDarkMode.value = $event : null),
				"aria-label": ariaLabel.value
			}, null, 8, ["modelValue", "aria-label"])) : (openBlock(), createBlock(ScalarColorModeToggleIcon_default, {
				key: 1,
				"aria-label": ariaLabel.value,
				mode: unref(darkLightMode),
				onClick: unref(toggleColorMode)
			}, null, 8, [
				"aria-label",
				"mode",
				"onClick"
			]));
		};
	}
});
//#endregion
export { ScalarColorModeToggle_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarColorModeToggle.vue.script.js.map