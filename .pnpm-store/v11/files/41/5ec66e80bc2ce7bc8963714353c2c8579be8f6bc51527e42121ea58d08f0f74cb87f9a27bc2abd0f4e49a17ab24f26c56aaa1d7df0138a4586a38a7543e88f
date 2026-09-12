import ScalarMenuLink_default from "./ScalarMenuLink.vue.js";
import { cva, useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, defineComponent, mergeProps, openBlock, renderSlot, unref, withCtx } from "vue";
var ScalarMenuProduct_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarMenuProduct",
	props: {
		is: { default: "a" },
		selected: { type: Boolean },
		icon: { type: [Object, Function] }
	},
	setup(__props) {
		const { cx } = useBindCx();
		const variants = cva({
			base: "gap-1.5",
			variants: { selected: {
				true: "pointer-events-none bg-b-2 dark:bg-b-3",
				false: "cursor-pointer hover:bg-b-2 dark:hover:bg-b-3"
			} }
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarMenuLink_default), mergeProps({
				is: __props.is,
				icon: __props.icon,
				strong: "",
				target: "_blank"
			}, unref(cx)(unref(variants)({ selected: __props.selected }))), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["is", "icon"]);
		};
	}
});
//#endregion
export { ScalarMenuProduct_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarMenuProduct.vue.script.js.map