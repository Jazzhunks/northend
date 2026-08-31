import { cva, useBindCx } from "@scalar/use-hooks/useBindCx";
import { createCommentVNode, createElementBlock, createElementVNode, createStaticVNode, defineComponent, mergeProps, normalizeClass, normalizeProps, openBlock, unref } from "vue";
//#region src/components/ScalarLoading/ScalarLoading.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "circular-loader" };
var ScalarLoading_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarLoading",
	props: {
		loader: {},
		size: {}
	},
	setup(__props) {
		const { cx } = useBindCx();
		const variants = cva({
			variants: { size: {
				"xs": "size-3",
				"sm": "size-3.5",
				"md": "size-4",
				"lg": "size-5",
				"xl": "size-6",
				"2xl": "size-8",
				"3xl": "size-10",
				"full": "size-full"
			} },
			defaultVariants: { size: "full" }
		});
		return (_ctx, _cache) => {
			return __props.loader ? (openBlock(), createElementBlock("div", normalizeProps(mergeProps({ key: 0 }, unref(cx)("loader-wrapper", unref(variants)({ size: __props.size })))), [(openBlock(), createElementBlock("svg", {
				class: normalizeClass(["svg-loader", {
					"icon-is-valid": __props.loader.isValid,
					"icon-is-invalid": __props.loader.isInvalid
				}]),
				viewBox: "0 0 100 100",
				xmlns: "http://www.w3.org/2000/svg",
				"xmlns:xlink": "http://www.w3.org/1999/xlink"
			}, [_cache[0] || (_cache[0] = createStaticVNode("<path class=\"svg-path svg-check-mark\" d=\"m 0 60 l 30 30 l 70 -80\" data-v-27df5cd8></path><path class=\"svg-path svg-x-mark\" d=\"m 50 50 l 40 -40\" data-v-27df5cd8></path><path class=\"svg-path svg-x-mark\" d=\"m 50 50 l 40 40\" data-v-27df5cd8></path><path class=\"svg-path svg-x-mark\" d=\"m 50 50 l -40 -40\" data-v-27df5cd8></path><path class=\"svg-path svg-x-mark\" d=\"m 50 50 l -40 40\" data-v-27df5cd8></path>", 5)), createElementVNode("g", _hoisted_1, [createElementVNode("circle", {
				class: normalizeClass(["loader-path", { "loader-path-off": !__props.loader.isLoading }]),
				cx: "50",
				cy: "50",
				fill: "none",
				r: "20",
				"stroke-width": "3"
			}, null, 2)])], 2))], 16)) : createCommentVNode("", true);
		};
	}
});
//#endregion
export { ScalarLoading_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarLoading.vue.script.js.map