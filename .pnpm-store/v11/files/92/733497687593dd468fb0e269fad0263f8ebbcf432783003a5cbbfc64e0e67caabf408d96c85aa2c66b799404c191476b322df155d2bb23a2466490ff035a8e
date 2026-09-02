import { useTooltip } from "./useTooltip.js";
import { computed, createElementBlock, defineComponent, normalizeClass, openBlock, ref, renderSlot } from "vue";
var ScalarTooltip_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarTooltip",
	props: {
		content: { default: "" },
		delay: { default: () => 300 },
		placement: { default: "top" },
		offset: { default: () => 4 }
	},
	setup(__props) {
		const wrapperRef = ref(null);
		useTooltip({
			content: computed(() => __props.content),
			delay: computed(() => __props.delay),
			placement: computed(() => __props.placement),
			offset: computed(() => __props.offset),
			targetRef: computed(() => wrapperRef.value?.children?.[0] || wrapperRef.value || void 0)
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "wrapperRef",
				ref: wrapperRef,
				class: normalizeClass({ contents: !!_ctx.$slots.default })
			}, [renderSlot(_ctx.$slots, "default")], 2);
		};
	}
});
//#endregion
export { ScalarTooltip_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarTooltip.vue.script.js.map