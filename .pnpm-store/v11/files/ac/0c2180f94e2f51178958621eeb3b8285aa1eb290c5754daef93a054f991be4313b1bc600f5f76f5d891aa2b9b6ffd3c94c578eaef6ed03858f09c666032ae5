import { Fragment, computed, createElementBlock, createElementVNode, defineComponent, normalizeClass, normalizeStyle, openBlock, renderList, toDisplayString } from "vue";
//#region src/components/ScalarAsciiArt/ScalarAsciiArt.vue?vue&type=script&setup=true&lang.ts
var BLINK = 500;
var PRINT = 100;
var ScalarAsciiArt_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarAsciiArt",
	props: {
		art: {},
		animate: { type: Boolean }
	},
	setup(__props) {
		const props = __props;
		const lines = computed(() => props.art.split("\n"));
		const getLineAnimation = (chars, row) => ({
			animationDuration: `${chars * PRINT}ms, ${BLINK}ms`,
			animationTimingFunction: `steps(${chars}), step-end`,
			animationDelay: `${row * PRINT}ms, 0ms`,
			animationIterationCount: `1, ${((lines.value?.length ?? 0) + (lines.value?.[lines.value?.length - 1]?.length ?? 0) + 5) * PRINT / BLINK}`
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				"aria-hidden": "true",
				class: normalizeClass(["ascii-art font-code flex flex-col items-start text-[6px] leading-[7px]", { "ascii-art-animate": __props.animate }]),
				role: "presentation",
				inert: ""
			}, [(openBlock(true), createElementBlock(Fragment, null, renderList(lines.value, (line, i) => {
				return openBlock(), createElementBlock("span", {
					key: i,
					class: "inline-block",
					style: normalizeStyle({ width: `calc(${line.length + 1}ch)` })
				}, [createElementVNode("span", {
					class: "inline-block whitespace-pre overflow-hidden",
					style: normalizeStyle(getLineAnimation(line.length, i))
				}, toDisplayString(line), 5)], 4);
			}), 128))], 2);
		};
	}
});
//#endregion
export { ScalarAsciiArt_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarAsciiArt.vue.script.js.map