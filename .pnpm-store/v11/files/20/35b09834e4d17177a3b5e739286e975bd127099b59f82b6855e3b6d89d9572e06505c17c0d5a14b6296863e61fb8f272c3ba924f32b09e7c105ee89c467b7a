import { useCardRegion } from "./useCardHeading.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { computed, createElementBlock, defineComponent, mergeProps, openBlock, renderSlot, unref } from "vue";
var ScalarCard_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarCard",
	props: { label: {} },
	setup(__props) {
		const { id } = useCardRegion();
		const labelAttrs = computed(() => {
			if (__props.label) return { "aria-label": __props.label };
			if (id.value) return { "aria-labelledby": id.value };
			return {};
		});
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", mergeProps({ role: "group" }, {
				...labelAttrs.value,
				...unref(cx)("scalar-card bg-b-2 flex flex-col divide-y rounded-xl border")
			}), [renderSlot(_ctx.$slots, "default")], 16);
		};
	}
});
//#endregion
export { ScalarCard_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarCard.vue.script.js.map