import ScalarDropdownButton_default from "../ScalarDropdown/ScalarDropdownButton.vue.js";
import ScalarIconLegacyAdapter_default from "../ScalarIcon/ScalarIconLegacyAdapter.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createElementBlock, createElementVNode, defineComponent, mergeProps, normalizeClass, openBlock, renderSlot, unref, withCtx } from "vue";
import { DropdownMenu } from "radix-vue/namespaced";
//#region src/components/ScalarMenu/ScalarMenuLink.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 1,
	class: "size-3"
};
var ScalarMenuLink_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarMenuLink",
	props: {
		is: { default: "a" },
		icon: { type: [Object, Function] },
		strong: { type: Boolean },
		submenu: { type: Boolean }
	},
	setup(__props) {
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarDropdownButton_default), mergeProps(unref(cx)("flex items-center"), {
				is: __props.submenu ? unref(DropdownMenu).SubTrigger : unref(DropdownMenu).Item,
				as: __props.is
			}), {
				default: withCtx(() => [__props.icon ? (openBlock(), createBlock(unref(ScalarIconLegacyAdapter_default), {
					key: 0,
					class: normalizeClass([__props.strong ? "text-c-1" : "text-c-2", typeof __props.icon === "string" ? "size-3" : "size-3.5 -mx-px"]),
					icon: __props.icon,
					thickness: __props.strong ? "2.5" : "2",
					weight: __props.strong ? "bold" : "regular"
				}, null, 8, [
					"class",
					"icon",
					"thickness",
					"weight"
				])) : (openBlock(), createElementBlock("div", _hoisted_1)), createElementVNode("div", { class: normalizeClass(["flex items-center flex-1 min-w-0 truncate", __props.strong ? "font-medium" : "font-normal"]) }, [renderSlot(_ctx.$slots, "default")], 2)]),
				_: 3
			}, 16, ["is", "as"]);
		};
	}
});
//#endregion
export { ScalarMenuLink_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarMenuLink.vue.script.js.map