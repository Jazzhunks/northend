import { variants } from "./variants.js";
import ScalarIcon_default from "./ScalarIcon.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, defineComponent, mergeProps, openBlock, resolveDynamicComponent, unref } from "vue";
var ScalarIconLegacyAdapter_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarIconLegacyAdapter",
	props: {
		icon: { type: [Object, Function] },
		label: {},
		weight: {},
		logo: {},
		size: {},
		thickness: {}
	},
	setup(__props) {
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return typeof __props.icon === "string" ? (openBlock(), createBlock(ScalarIcon_default, mergeProps({ key: 0 }, {
				..._ctx.$props,
				..._ctx.$attrs
			}, { icon: __props.icon }), null, 16, ["icon"])) : (openBlock(), createBlock(resolveDynamicComponent(__props.icon), mergeProps({
				key: 1,
				label: __props.label,
				weight: __props.weight
			}, unref(cx)(unref(variants)({ size: __props.size }))), null, 16, ["label", "weight"]));
		};
	}
});
//#endregion
export { ScalarIconLegacyAdapter_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarIconLegacyAdapter.vue.script.js.map