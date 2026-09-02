import { cva, cx } from "@scalar/use-hooks/useBindCx";
import { createBlock, defineComponent, normalizeClass, openBlock, renderSlot, resolveDynamicComponent, unref, withCtx } from "vue";
var ScalarDropdownButton_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarDropdownButton",
	props: {
		is: { default: "button" },
		active: { type: Boolean },
		disabled: { type: Boolean }
	},
	setup(__props) {
		const variants = cva({
			base: [
				"block h-8 min-w-0 gap-1.5 rounded px-2.5 py-1.5 text-left",
				"truncate  no-underline text-sm text-c-1",
				"cursor-pointer hover:bg-b-2 highlighted:bg-b-2"
			],
			variants: {
				disabled: { true: "pointer-events-none text-c-3" },
				active: { true: "" }
			},
			compoundVariants: [{
				disabled: false,
				active: true,
				class: "bg-b-2"
			}]
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.is), {
				"aria-disabled": __props.disabled,
				class: normalizeClass(["item", unref(cx)("scalar-dropdown-item", unref(variants)({
					active: __props.active,
					disabled: __props.disabled
				}))]),
				type: __props.is === "button" ? "button" : void 0
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, void 0, true)]),
				_: 3
			}, 8, [
				"aria-disabled",
				"class",
				"type"
			]);
		};
	}
});
//#endregion
export { ScalarDropdownButton_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarDropdownButton.vue.script.js.map