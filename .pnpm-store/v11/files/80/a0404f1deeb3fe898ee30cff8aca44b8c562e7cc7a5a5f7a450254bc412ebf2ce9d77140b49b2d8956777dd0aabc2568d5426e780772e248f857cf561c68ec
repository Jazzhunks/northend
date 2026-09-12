import { useFormGroupInput } from "./useFormGroups.js";
import { cva, useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, defineComponent, mergeProps, openBlock, renderSlot, resolveDynamicComponent, unref, withCtx } from "vue";
var ScalarFormInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarFormInput",
	props: { is: { default: "button" } },
	setup(__props) {
		const { cx } = useBindCx();
		const grouped = useFormGroupInput();
		const variants = cva({
			base: ["bg-b-1.5 flex items-center text-c-2 gap-0.75 p-3 text-base", "outline-offset-[-1px] has-[:focus-visible]:outline"],
			variants: {
				grouped: {
					true: "first:rounded-t-[inherit] last:rounded-b-[inherit]",
					false: "rounded shadow-border"
				},
				button: { true: "cursor-pointer hover:bg-b-2" }
			}
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.is), mergeProps({ type: __props.is === "button" ? "button" : void 0 }, unref(cx)(unref(variants)({
				button: __props.is === "button",
				grouped: unref(grouped)
			}))), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["type"]);
		};
	}
});
//#endregion
export { ScalarFormInput_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarFormInput.vue.script.js.map