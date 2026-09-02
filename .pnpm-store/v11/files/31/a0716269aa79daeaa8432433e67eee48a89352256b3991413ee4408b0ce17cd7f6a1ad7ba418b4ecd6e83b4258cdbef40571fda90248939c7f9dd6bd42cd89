import { prettifyJsoncString } from "../helpers/prettify-jsonc-string.js";
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, defineComponent, openBlock, ref, toRef, unref, useId } from "vue";
import { useCodeMirror } from "@scalar/use-codemirror";
import { ScalarCodeBlockCopy } from "@scalar/components/code-block";
//#region src/v2/blocks/response-block/components/ResponseBodyRaw.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	class: "scalar-code-block group/code-block relative grid min-h-0 overflow-hidden p-px outline-none has-focus-visible:outline",
	"data-testid": "response-body-raw"
};
var _hoisted_2 = {
	class: "custom-scroll relative pr-1",
	tabindex: "0"
};
var ResponseBodyRaw_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ResponseBodyRaw",
	props: {
		content: {},
		language: {},
		prettyPrintJson: { type: Boolean }
	},
	setup(__props) {
		const props = __props;
		const codeMirrorRef = ref(null);
		/** Base id for the code block */
		const id = useId();
		const { codeMirror } = useCodeMirror({
			codeMirrorRef,
			readOnly: true,
			lineNumbers: true,
			content: toRef(computed(() => {
				const { content, language, prettyPrintJson = false } = props;
				if (typeof content !== "string") {
					if (content == null) return "";
					return String(content);
				}
				if (prettyPrintJson && language === "json") return prettifyJsoncString(content);
				return content;
			})),
			language: toRef(() => props.language),
			forceFoldGutter: true
		});
		const getCurrentContent = () => {
			return codeMirror.value?.state.doc.toString() || "";
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("div", _hoisted_2, [createElementVNode("div", {
				ref_key: "codeMirrorRef",
				ref: codeMirrorRef
			}, null, 512)]), getCurrentContent() ? (openBlock(), createBlock(unref(ScalarCodeBlockCopy), {
				key: 0,
				"aria-controls": unref(id),
				class: "absolute top-2 right-2",
				content: getCurrentContent()
			}, null, 8, ["aria-controls", "content"])) : createCommentVNode("", true)]);
		};
	}
});
//#endregion
export { ResponseBodyRaw_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ResponseBodyRaw.vue.script.js.map