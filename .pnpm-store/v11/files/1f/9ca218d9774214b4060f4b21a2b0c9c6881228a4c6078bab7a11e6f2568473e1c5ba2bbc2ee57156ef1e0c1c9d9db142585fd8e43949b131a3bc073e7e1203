import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock, renderSlot } from "vue";
//#region src/components/Badge/Badge.vue?vue&type=script&setup=true&lang.ts
var Badge_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Badge",
	props: { color: {} },
	setup(__props) {
		const badgeStyle = computed(() => __props.color ? {
			"--badge-background-color": __props.color,
			"--badge-text-color": `color-mix(in srgb, ${__props.color}, black 40%)`
		} : {});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: "badge",
				style: normalizeStyle(badgeStyle.value)
			}, [renderSlot(_ctx.$slots, "default", {}, void 0, true)], 4);
		};
	}
});
//#endregion
export { Badge_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=Badge.vue.script.js.map