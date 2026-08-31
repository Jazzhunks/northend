import ScalarCopyBackdrop_default from "./ScalarCopyBackdrop.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { Transition, computed, createBlock, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeModels, mergeProps, normalizeClass, openBlock, renderSlot, resolveDynamicComponent, unref, useModel, withCtx } from "vue";
import { ScalarIconCheck, ScalarIconCopy } from "@scalar/icons";
//#region src/components/ScalarCopy/ScalarCopyButton.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	"aria-hidden": "true",
	class: "flex items-center py-1.5 mask-y-from-[calc(100%-8px)] mask-y-to-100%"
};
var _hoisted_2 = {
	key: 0,
	class: "whitespace-nowrap px-1.5"
};
var _hoisted_3 = {
	key: 0,
	class: "sr-only",
	role: "alert"
};
var _hoisted_4 = {
	key: 1,
	class: "sr-only"
};
var ScalarCopyButton_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarCopyButton",
	props: /* @__PURE__ */ mergeModels({
		showLabel: { type: Boolean },
		placement: { default: "right" }
	}, {
		"copied": {
			type: Boolean,
			default: false
		},
		"copiedModifiers": {}
	}),
	emits: ["update:copied"],
	setup(__props) {
		/** Whether the copy button has been clicked */
		const copied = useModel(__props, "copied");
		const { cx } = useBindCx();
		const icon = computed(() => {
			return copied.value ? ScalarIconCheck : ScalarIconCopy;
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("button", mergeProps({ type: "button" }, unref(cx)("group/copy-button relative z-0 flex items-center justify-center", "size-6 p-1.25 -m-1 rounded text-xs bg-b-2", copied.value ? "text-c-1" : "text-c-2 hover:text-c-1")), [
				createVNode(Transition, {
					enterActiveClass: "transition-transform",
					enterFromClass: "scale-0",
					enterToClass: "scale-100",
					leaveActiveClass: "transition-transform",
					leaveFromClass: "scale-100",
					leaveToClass: "scale-0",
					mode: "out-in"
				}, {
					default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(icon.value), { class: "size-full" }))]),
					_: 1
				}),
				_cache[4] || (_cache[4] = createElementVNode("div", { class: "bg-inherit rounded-[inherit] absolute inset-0 -z-1" }, null, -1)),
				createElementVNode("div", { class: normalizeClass(["group/copy-label absolute flex items-center -inset-y-0.5 rounded", {
					"left-0 pl-[100%]": __props.placement === "right",
					"right-0 pr-[100%]": __props.placement === "left"
				}]) }, [
					createElementVNode("div", _hoisted_1, [createVNode(Transition, {
						enterActiveClass: "transition-transform ease-out",
						enterFromClass: "translate-y-1.5",
						enterToClass: "translate-y-0",
						leaveActiveClass: "transition-transform ease-in",
						leaveFromClass: "translate-y-0",
						leaveToClass: "-translate-y-1.5",
						mode: "out-in"
					}, {
						default: withCtx(() => [copied.value ? (openBlock(), createElementBlock("div", _hoisted_2, [renderSlot(_ctx.$slots, "copied", {}, () => [_cache[0] || (_cache[0] = createTextVNode("Copied", -1))])])) : (openBlock(), createElementBlock("div", {
							key: 1,
							class: normalizeClass(["whitespace-nowrap px-1.5", { "group-hocus/copy-button:block hidden": !__props.showLabel && !copied.value }])
						}, [renderSlot(_ctx.$slots, "copy", {}, () => [_cache[1] || (_cache[1] = createTextVNode("Copy", -1))])], 2))]),
						_: 3
					})]),
					copied.value ? (openBlock(), createElementBlock("div", _hoisted_3, [renderSlot(_ctx.$slots, "copied", {}, () => [_cache[2] || (_cache[2] = createTextVNode("Copied", -1))])])) : (openBlock(), createElementBlock("div", _hoisted_4, [renderSlot(_ctx.$slots, "copy", {}, () => [_cache[3] || (_cache[3] = createTextVNode("Copy", -1))])])),
					renderSlot(_ctx.$slots, "backdrop", {}, () => [createVNode(ScalarCopyBackdrop_default)])
				], 2)
			], 16);
		};
	}
});
//#endregion
export { ScalarCopyButton_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarCopyButton.vue.script.js.map