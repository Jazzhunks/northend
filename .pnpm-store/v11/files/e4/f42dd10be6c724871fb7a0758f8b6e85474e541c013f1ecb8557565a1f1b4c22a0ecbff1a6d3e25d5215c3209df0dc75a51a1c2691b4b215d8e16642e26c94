import ScalarCopyBackdrop_default from "../ScalarCopy/ScalarCopyBackdrop.vue.js";
import ScalarCodeBlockCopy_default from "../ScalarCodeBlock/ScalarCodeBlockCopy.vue.js";
import ScalarVirtualText_default from "../ScalarVirtualText/ScalarVirtualText.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createCommentVNode, createElementBlock, createVNode, defineComponent, guardReactiveProps, normalizeClass, normalizeProps, openBlock, unref, withCtx } from "vue";
var ScalarVirtualCodeBlock_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarVirtualCodeBlock",
	props: {
		content: {},
		lang: { default: "plaintext" },
		copy: {
			type: [String, Boolean],
			default: "hover"
		},
		lineHeight: { default: 20 }
	},
	setup(__props) {
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", normalizeProps(guardReactiveProps(unref(cx)("scalar-code-block group/code-block flex flex-col", "relative bg-b-1 min-h-0 min-w-0"))), [createVNode(ScalarVirtualText_default, {
				containerClass: "custom-scroll overflow-auto flex flex-1 max-h-screen",
				contentClass: "language-plaintext whitespace-pre font-code text-base p-2",
				lineHeight: __props.lineHeight,
				text: __props.content
			}, null, 8, ["lineHeight", "text"]), __props.copy ? (openBlock(), createBlock(ScalarCodeBlockCopy_default, {
				key: 0,
				class: normalizeClass(["scalar-code-copy absolute top-2.5 right-2.5", [{ "opacity-100": __props.copy === "always" }]]),
				content: __props.content,
				showLang: true,
				lang: __props.lang
			}, {
				backdrop: withCtx(() => [createVNode(ScalarCopyBackdrop_default, { class: "scalar-code-copy-backdrop -right-1.5 -top-1" })]),
				_: 1
			}, 8, [
				"class",
				"content",
				"lang"
			])) : createCommentVNode("", true)], 16);
		};
	}
});
//#endregion
export { ScalarVirtualCodeBlock_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarVirtualCodeBlock.vue.script.js.map