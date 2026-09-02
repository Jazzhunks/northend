import { defineComponent, onBeforeUnmount, watch } from "vue";
var ValueEmitter_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	name: "ValueEmitter",
	props: { value: {} },
	emits: ["change", "unmount"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		watch(() => __props.value, (newValue) => emit("change", newValue), { immediate: true });
		onBeforeUnmount(() => emit("unmount"));
		return (_ctx, _cache) => {
			return null;
		};
	}
});
//#endregion
export { ValueEmitter_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ValueEmitter.vue.script.js.map