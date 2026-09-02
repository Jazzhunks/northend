import { getIcon, getLogo } from "./utils/index.js";
import { variants } from "./variants.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { computed, createBlock, defineComponent, guardReactiveProps, normalizeProps, openBlock, resolveDynamicComponent, unref, useCssVars } from "vue";
var ScalarIcon_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarIcon",
	props: {
		icon: {},
		logo: {},
		size: {},
		thickness: {},
		label: {}
	},
	setup(__props) {
		useCssVars((_ctx) => ({ "c07589c2": stroke.value }));
		const props = __props;
		const { cx } = useBindCx();
		const stroke = computed(() => props.thickness ?? "2");
		const accessibilityAttrs = computed(() => props.label ? { "aria-label": props.label } : {
			"aria-hidden": true,
			"role": "presentation"
		});
		const svg = computed(() => {
			if (props.icon) return getIcon(props.icon);
			if (props.logo) return getLogo(props.logo);
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(svg.value), normalizeProps(guardReactiveProps({
				...unref(cx)("scalar-icon", unref(variants)({ size: __props.size })),
				...accessibilityAttrs.value
			})), null, 16);
		};
	}
});
//#endregion
export { ScalarIcon_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarIcon.vue.script.js.map