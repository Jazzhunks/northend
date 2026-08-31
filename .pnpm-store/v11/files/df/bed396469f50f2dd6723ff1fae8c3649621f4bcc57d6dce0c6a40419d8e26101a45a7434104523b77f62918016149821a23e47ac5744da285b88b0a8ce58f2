import { useTeleport } from "./useTeleport.js";
import { Teleport, createBlock, createElementVNode, defineComponent, mergeProps, openBlock, renderSlot, unref } from "vue";
var ScalarTeleport_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarTeleport",
	props: {
		to: {},
		immediate: { type: Boolean },
		disabled: { type: Boolean }
	},
	setup(__props) {
		const root = useTeleport();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Teleport, {
				defer: !__props.immediate,
				disabled: __props.disabled,
				to: __props.to || unref(root)
			}, [createElementVNode("div", mergeProps({
				class: "scalar-app",
				style: { "display": "contents" }
			}, _ctx.$attrs), [renderSlot(_ctx.$slots, "default")], 16)], 8, [
				"defer",
				"disabled",
				"to"
			]);
		};
	}
});
//#endregion
export { ScalarTeleport_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarTeleport.vue.script.js.map