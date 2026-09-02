import ValueEmitter_default from "./ValueEmitter.vue.js";
import { createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeProps, normalizeClass, openBlock, renderSlot, toDisplayString, unref, useId, withCtx } from "vue";
import { ScalarIcon } from "@scalar/components/icon";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
//#region src/v2/components/layout/CollapsibleSection.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-labelledby"];
var _hoisted_2 = { class: "text-c-1 m-0 flex flex-1 items-center gap-1.5 leading-[20px]" };
var _hoisted_3 = ["id"];
var _hoisted_4 = {
	key: 0,
	class: "sr-only"
};
var _hoisted_5 = {
	key: 0,
	class: "bg-b-2 text-c-2 inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs font-semibold"
};
var _hoisted_6 = { class: "sr-only" };
var _hoisted_7 = {
	key: 0,
	class: "ui-not-open:hidden flex items-center gap-2 pr-0.75"
};
var CollapsibleSection_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	name: "CollapsibleSection",
	props: {
		defaultOpen: {
			type: Boolean,
			default: true
		},
		itemCount: { default: 0 },
		isStatic: { type: Boolean }
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const headingId = useId();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Disclosure), {
				as: "div",
				class: normalizeClass(["group/collapse text-c-2 focus-within:text-c-1 last:ui-open:border-b-0", {
					"last-of-type:first-of-type:border-b-0": __props.isStatic,
					"border-b": !__props.isStatic
				}]),
				defaultOpen: __props.defaultOpen,
				static: __props.isStatic
			}, {
				default: withCtx(({ open }) => [createVNode(ValueEmitter_default, {
					value: open,
					onChange: _cache[0] || (_cache[0] = (value) => emit("update:modelValue", value))
				}, null, 8, ["value"]), createElementVNode("section", {
					"aria-labelledby": unref(headingId),
					class: "contents"
				}, [createElementVNode("div", { class: normalizeClass(["bg-b-2 flex items-center", __props.isStatic && "rounded-t-xl border-x border-t"]) }, [createVNode(unref(DisclosureButton), {
					class: normalizeClass(["hover:text-c-1 group box-content flex max-h-8 flex-1 items-center gap-2.5 overflow-hidden px-1 py-1.5 text-base font-medium outline-none md:px-1.5 xl:pr-0.5 xl:pl-2", __props.isStatic && "!pl-3"]),
					disabled: __props.isStatic
				}, {
					default: withCtx(() => [!__props.isStatic ? (openBlock(), createBlock(unref(ScalarIcon), {
						key: 0,
						class: "text-c-3 group-hover:text-c-1 rounded-px ui-open:rotate-90 ui-not-open:rotate-0 outline-offset-2 group-focus-visible:outline",
						icon: "ChevronRight",
						size: "md"
					})) : createCommentVNode("", true), createElementVNode("h2", _hoisted_2, [createElementVNode("span", {
						id: unref(headingId),
						class: "contents"
					}, [renderSlot(_ctx.$slots, "title", { open }), !open ? (openBlock(), createElementBlock("span", _hoisted_4, " (Collapsed) ")) : createCommentVNode("", true)], 8, _hoisted_3), !open && __props.itemCount ? (openBlock(), createElementBlock("span", _hoisted_5, [createTextVNode(toDisplayString(__props.itemCount) + " ", 1), createElementVNode("span", _hoisted_6, "Item" + toDisplayString(__props.itemCount === 1 ? "" : "s"), 1)])) : createCommentVNode("", true)])]),
					_: 2
				}, 1032, ["class", "disabled"]), _ctx.$slots.actions ? (openBlock(), createElementBlock("div", _hoisted_7, [renderSlot(_ctx.$slots, "actions", { open })])) : createCommentVNode("", true)], 2), createVNode(unref(DisclosurePanel), mergeProps(_ctx.$attrs, { class: "diclosure-panel h-full max-h-fit rounded-b" }), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open })]),
					_: 2
				}, 1040)], 8, _hoisted_1)]),
				_: 3
			}, 8, [
				"class",
				"defaultOpen",
				"static"
			]);
		};
	}
});
//#endregion
export { CollapsibleSection_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=CollapsibleSection.vue.script.js.map