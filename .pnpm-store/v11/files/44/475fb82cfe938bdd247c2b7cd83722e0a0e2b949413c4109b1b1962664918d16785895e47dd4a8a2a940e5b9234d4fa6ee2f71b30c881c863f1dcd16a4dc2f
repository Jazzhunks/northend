import Section_default from "./Section.vue.js";
import Anchor_default from "../Anchor/Anchor.vue.js";
import { createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, normalizeClass, openBlock, renderSlot, unref, withCtx } from "vue";
import { ScalarIconCaretRight } from "@scalar/icons";
//#region src/components/Section/CompactSection.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-label"];
var _hoisted_2 = [
	"id",
	"aria-controls",
	"aria-expanded"
];
var CompactSection_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "CompactSection",
	props: {
		id: {},
		label: {},
		modelValue: { type: Boolean }
	},
	emits: ["update:modelValue", "copyAnchorUrl"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("section", {
				"aria-label": __props.label,
				class: "collapsible-section"
			}, [createElementVNode("button", {
				id: __props.id,
				"aria-controls": __props.id,
				"aria-expanded": __props.modelValue,
				class: normalizeClass(["collapsible-section-trigger", { "collapsible-section-trigger-open": __props.modelValue }]),
				type: "button",
				onClick: _cache[1] || (_cache[1] = ($event) => emit("update:modelValue", !__props.modelValue))
			}, [createVNode(unref(ScalarIconCaretRight), {
				class: normalizeClass(["size-3 transition-transform duration-100", { "rotate-90": __props.modelValue }]),
				weight: "bold"
			}, null, 8, ["class"]), createVNode(unref(Anchor_default), {
				class: "collapsible-section-header",
				onCopyAnchorUrl: _cache[0] || (_cache[0] = () => emit("copyAnchorUrl"))
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "heading", {}, void 0, true)]),
				_: 3
			})], 10, _hoisted_2), __props.modelValue ? (openBlock(), createBlock(Section_default, {
				key: 0,
				class: "collapsible-section-content",
				label: __props.label
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, void 0, true)]),
				_: 3
			}, 8, ["label"])) : createCommentVNode("", true)], 8, _hoisted_1);
		};
	}
});
//#endregion
export { CompactSection_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=CompactSection.vue.script.js.map