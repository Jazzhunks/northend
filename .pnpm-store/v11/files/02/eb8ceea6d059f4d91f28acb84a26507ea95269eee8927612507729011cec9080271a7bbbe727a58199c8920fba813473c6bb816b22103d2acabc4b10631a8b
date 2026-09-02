import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { computed, createElementBlock, defineComponent, mergeProps, openBlock, unref, useTemplateRef } from "vue";
import { htmlFromMarkdown, isHeading, textFromNode } from "@scalar/code-highlight";
//#region src/components/ScalarMarkdown/ScalarMarkdown.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["innerHTML"];
var ScalarMarkdown_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarMarkdown",
	props: {
		value: {},
		withImages: {
			type: Boolean,
			default: false
		},
		withAnchors: {
			type: Boolean,
			default: false
		},
		transform: { type: Function },
		transformType: {},
		clamp: {},
		anchorPrefix: {}
	},
	setup(__props, { expose: __expose }) {
		const { cx } = useBindCx();
		__expose({ el: useTemplateRef("div") });
		const transformHeading = (node) => {
			if (!__props.withAnchors) return __props.transform?.(node) || node;
			if (!isHeading(node)) return node;
			/** Basic slugify for the heading text */
			const slug = textFromNode(node).toLowerCase().replace(/\s+/g, "-");
			node.data = { hProperties: { id: __props.anchorPrefix ? `${__props.anchorPrefix}/description/${slug}` : slug } };
			if (__props.transform) return __props.transform(node);
			return node;
		};
		const html = computed(() => {
			return htmlFromMarkdown(__props.value ?? "", {
				removeTags: __props.withImages ? [] : ["img", "picture"],
				transform: __props.withAnchors && __props.transformType === "heading" ? transformHeading : __props.transform,
				transformType: __props.transformType
			});
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", mergeProps({ ref: "div" }, unref(cx)("markdown", { "line-clamp-(--markdown-clamp)": !!__props.clamp }), {
				style: { "--markdown-clamp": __props.clamp },
				innerHTML: html.value
			}), null, 16, _hoisted_1);
		};
	}
});
//#endregion
export { ScalarMarkdown_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarMarkdown.vue.script.js.map