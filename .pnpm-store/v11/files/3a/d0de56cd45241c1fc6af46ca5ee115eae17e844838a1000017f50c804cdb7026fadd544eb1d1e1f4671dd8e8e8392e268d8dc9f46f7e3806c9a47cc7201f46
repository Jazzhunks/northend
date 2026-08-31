import { THEME_CSS_VARS, useThemeSwatches } from "./useThemeSwatches.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { Fragment, createElementBlock, defineComponent, mergeProps, normalizeStyle, openBlock, renderList, unref } from "vue";
var ScalarThemeSwatches_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarThemeSwatches",
	props: { css: {} },
	setup(__props) {
		const { colors } = useThemeSwatches(() => __props.css);
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", mergeProps({ style: {
				"--bg-light": unref(colors).light["--scalar-background-1"],
				"--bg-dark": unref(colors).dark["--scalar-background-1"]
			} }, unref(cx)("flex *:size-3 overflow-hidden rounded", "bg-(--bg-light) dark:bg-(--bg-dark)")), [(openBlock(true), createElementBlock(Fragment, null, renderList(unref(THEME_CSS_VARS), (v) => {
				return openBlock(), createElementBlock("div", {
					key: v,
					class: "bg-(--bg-light) dark:bg-(--bg-dark)",
					style: normalizeStyle({
						"--bg-light": unref(colors).light[v],
						"--bg-dark": unref(colors).dark[v]
					})
				}, null, 4);
			}), 128))], 16);
		};
	}
});
//#endregion
export { ScalarThemeSwatches_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarThemeSwatches.vue.script.js.map