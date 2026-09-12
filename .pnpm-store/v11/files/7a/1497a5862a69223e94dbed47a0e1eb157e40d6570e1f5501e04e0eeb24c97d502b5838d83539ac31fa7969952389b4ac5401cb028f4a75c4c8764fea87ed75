import ScalarMarkdown_default from "./ScalarMarkdown.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createCommentVNode, createElementBlock, createPropsRestProxy, createTextVNode, createVNode, defineComponent, guardReactiveProps, mergeModels, mergeProps, normalizeClass, normalizeProps, onMounted, openBlock, renderSlot, toDisplayString, unref, useId, useModel, useTemplateRef } from "vue";
import { useResizeObserver } from "@vueuse/core";
//#region src/components/ScalarMarkdown/ScalarMarkdownSummary.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-controls", "aria-expanded"];
var ScalarMarkdownSummary_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarMarkdownSummary",
	props: /* @__PURE__ */ mergeModels({
		value: {},
		withImages: { type: Boolean },
		withAnchors: { type: Boolean },
		transform: { type: Function },
		transformType: {},
		clamp: { default: 1 },
		anchorPrefix: {},
		controlled: { type: Boolean }
	}, {
		"modelValue": {
			type: Boolean,
			default: false
		},
		"modelModifiers": {},
		"truncated": {
			type: Boolean,
			default: false
		},
		"truncatedModifiers": {}
	}),
	emits: ["update:modelValue", "update:truncated"],
	setup(__props) {
		const props = createPropsRestProxy(__props, ["clamp"]);
		const id = useId();
		/** * Whether the summary is open. */
		const open = useModel(__props, "modelValue");
		/** Whether the markdown is being truncated */
		const truncated = useModel(__props, "truncated");
		const markdown = useTemplateRef("scalar-markdown");
		useResizeObserver(() => markdown.value?.el, checkTruncation);
		/** Check if the markdown is being truncated */
		function checkTruncation() {
			const el = markdown.value?.el;
			if (!el) return;
			truncated.value = el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
		}
		onMounted(checkTruncation);
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", normalizeProps(guardReactiveProps(unref(cx)("group/summary flex gap-0.5", open.value ? "flex-col" : "flex-row items-baseline"))), [createVNode(ScalarMarkdown_default, mergeProps(props, {
				id: unref(id),
				ref: "scalar-markdown",
				clamp: open.value ? void 0 : __props.clamp,
				class: { "markdown-summary truncate": !open.value }
			}), null, 16, [
				"id",
				"clamp",
				"class"
			]), !__props.controlled && (truncated.value || open.value) ? (openBlock(), createElementBlock("button", {
				key: 0,
				"aria-controls": unref(id),
				"aria-expanded": open.value,
				class: normalizeClass(["whitespace-nowrap font-medium hover:underline", { "self-end": open.value }]),
				type: "button",
				onClick: _cache[0] || (_cache[0] = ($event) => open.value = !open.value)
			}, [renderSlot(_ctx.$slots, "button", { open: open.value }, () => [createTextVNode(toDisplayString(open.value ? " Show Less" : "More"), 1)])], 10, _hoisted_1)) : createCommentVNode("", true)], 16);
		};
	}
});
//#endregion
export { ScalarMarkdownSummary_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarMarkdownSummary.vue.script.js.map