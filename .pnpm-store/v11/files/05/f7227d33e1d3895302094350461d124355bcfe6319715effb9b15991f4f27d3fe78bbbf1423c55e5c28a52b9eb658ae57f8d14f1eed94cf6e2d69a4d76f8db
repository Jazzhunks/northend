import { PRESETS } from "./constants.js";
import { Fragment, computed, createCommentVNode, createElementBlock, createTextVNode, defineComponent, openBlock, renderList, toDisplayString } from "vue";
//#region src/components/ScalarWrappingText/ScalarWrappingText.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { key: 0 };
var ScalarWrappingText_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarWrappingText",
	props: {
		text: { default: "" },
		preset: { default: "path" },
		regex: {}
	},
	setup(__props) {
		/**
		* Unicode character for zero-width non-joiner
		*
		* @see https://en.wikipedia.org/wiki/Zero-width_non-joiner
		*/
		const ZWNJ = "⁠";
		const words = computed(() => {
			const wrapRegex = new RegExp(__props.regex ?? PRESETS[__props.preset], "g");
			return __props.text.replace(wrapRegex, `${ZWNJ}$&`).split(ZWNJ).filter(Boolean);
		});
		return (_ctx, _cache) => {
			return openBlock(true), createElementBlock(Fragment, null, renderList(words.value, (word, i) => {
				return openBlock(), createElementBlock(Fragment, { key: i }, [i !== 0 ? (openBlock(), createElementBlock("wbr", _hoisted_1)) : createCommentVNode("", true), createTextVNode(toDisplayString(word), 1)], 64);
			}), 128);
		};
	}
});
//#endregion
export { ScalarWrappingText_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarWrappingText.vue.script.js.map