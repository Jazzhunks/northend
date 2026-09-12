import ScalarDropdownMenu_default from "../ScalarDropdown/ScalarDropdownMenu.vue.js";
import ScalarMenuButton_default from "./ScalarMenuButton.vue.js";
import ScalarMenuProducts_default from "./ScalarMenuProducts.vue.js";
import ScalarMenuResources_default from "./ScalarMenuResources.vue.js";
import { createBlock, createSlots, createVNode, defineComponent, mergeProps, openBlock, ref, renderSlot, unref, withCtx } from "vue";
import { DropdownMenu } from "radix-vue/namespaced";
var ScalarMenu_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarMenu",
	setup(__props) {
		/** Whether the menu is open */
		const open = ref(false);
		/** Close the menu */
		function close() {
			open.value = false;
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(DropdownMenu).Root, {
				open: open.value,
				"onUpdate:open": _cache[0] || (_cache[0] = ($event) => open.value = $event)
			}, {
				default: withCtx(() => [createVNode(unref(DropdownMenu).Trigger, { asChild: "" }, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "button", { open: open.value }, () => [createVNode(ScalarMenuButton_default, {
						class: "min-w-0",
						open: open.value
					}, createSlots({ _: 2 }, [
						_ctx.$slots.logo ? {
							name: "logo",
							fn: withCtx(() => [renderSlot(_ctx.$slots, "logo")]),
							key: "0"
						} : void 0,
						_ctx.$slots.title ? {
							name: "title",
							fn: withCtx(() => [renderSlot(_ctx.$slots, "title")]),
							key: "1"
						} : void 0,
						_ctx.$slots.label ? {
							name: "label",
							fn: withCtx(() => [renderSlot(_ctx.$slots, "label")]),
							key: "2"
						} : void 0
					]), 1032, ["open"])])]),
					_: 3
				}), createVNode(unref(DropdownMenu).Content, mergeProps({
					align: "start",
					as: unref(ScalarDropdownMenu_default),
					class: "max-h-radix-popper z-context",
					sideOffset: 5
				}, _ctx.$attrs), {
					default: withCtx(() => [
						renderSlot(_ctx.$slots, "products", { close }, () => [createVNode(ScalarMenuProducts_default)]),
						renderSlot(_ctx.$slots, "profile", { close }),
						renderSlot(_ctx.$slots, "sections", { close }, () => [createVNode(ScalarMenuResources_default)])
					]),
					_: 3
				}, 16, ["as"])]),
				_: 3
			}, 8, ["open"]);
		};
	}
});
//#endregion
export { ScalarMenu_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarMenu.vue.script.js.map