import ScalarCopy_default from "../ScalarCopy/ScalarCopy.vue.js";
import { LANGUAGE_LABELS } from "./constants.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, defineComponent, mergeModels, mergeProps, normalizeClass, openBlock, renderSlot, toDisplayString, unref, useModel, withCtx } from "vue";
//#region src/components/ScalarCodeBlock/ScalarCodeBlockCopy.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "hidden group-hocus-within/code-block:inline" };
var ScalarCodeBlockCopy_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarCodeBlockCopy",
	props: /* @__PURE__ */ mergeModels({
		showLang: { type: Boolean },
		content: {},
		lang: {}
	}, {
		"copied": {
			type: Boolean,
			default: false
		},
		"copiedModifiers": {}
	}),
	emits: ["update:copied"],
	setup(__props) {
		const copied = useModel(__props, "copied");
		/** Handles the copy button click */
		const contentToCopy = computed(() => {
			return typeof __props.content === "string" ? __props.content : JSON.stringify(__props.content, null, 2);
		});
		/** Type guard to check if the language is a standard language */
		const isStandardLanguage = (lang) => lang in LANGUAGE_LABELS;
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarCopy_default), mergeProps({
				content: contentToCopy.value,
				showLabel: "",
				copied: copied.value,
				"onUpdate:copied": _cache[0] || (_cache[0] = ($event) => copied.value = $event),
				placement: "left"
			}, { ...unref(cx)(copied.value ? "opacity-100" : "opacity-0 group-hocus-within/code-block:opacity-100") }), createSlots({
				backdrop: withCtx(() => [renderSlot(_ctx.$slots, "backdrop")]),
				_: 2
			}, [__props.lang ? {
				name: "copy",
				fn: withCtx(() => [createElementVNode("span", _hoisted_1, [__props.showLang ? (openBlock(), createElementBlock("span", {
					key: 0,
					class: normalizeClass(["group-hocus/copy-button:sr-only", { capitalize: !isStandardLanguage(__props.lang) }])
				}, toDisplayString(isStandardLanguage(__props.lang) ? unref(LANGUAGE_LABELS)[__props.lang] : __props.lang), 3)) : createCommentVNode("", true), createElementVNode("span", { class: normalizeClass({ "group-hocus/copy-button:not-sr-only sr-only": __props.showLang }) }, "Copy", 2)])]),
				key: "0"
			} : void 0]), 1040, ["content", "copied"]);
		};
	}
});
//#endregion
export { ScalarCodeBlockCopy_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarCodeBlockCopy.vue.script.js.map