import { createElementBlock, createElementVNode, createVNode, defineComponent, mergeProps, nextTick, normalizeClass, onBeforeMount, onBeforeUnmount, openBlock, ref, renderSlot, unref, watch, withCtx } from "vue";
import { ScalarTeleportRoot } from "@scalar/components/teleport";
import { addScalarClassesToHeadless } from "@scalar/components/helpers";
import { useFocusTrap } from "@vueuse/integrations/useFocusTrap";
//#region src/v2/components/modals/ModalClientContainer.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "scalar scalar-app z-overlay relative" };
var ModalClientContainer_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ModalClientContainer",
	props: { modalState: {} },
	emits: ["open", "close"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const client = ref(null);
		const { activate: activateFocusTrap, deactivate: deactivateFocusTrap } = useFocusTrap(client, {
			allowOutsideClick: true,
			fallbackFocus: () => client.value
		});
		onBeforeMount(() => addScalarClassesToHeadless());
		watch(() => props.modalState.open, async (open) => {
			if (open) {
				await nextTick();
				activateFocusTrap();
				emit("open");
			} else {
				deactivateFocusTrap();
				emit("close");
			}
		}, { immediate: false });
		onBeforeUnmount(() => {
			deactivateFocusTrap();
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("div", { class: normalizeClass(["scalar-container", { "scalar-client--open": __props.modalState.open }]) }, [createElementVNode("div", mergeProps({
				ref_key: "client",
				ref: client,
				"aria-label": "API Client",
				"aria-modal": "true"
			}, _ctx.$attrs, {
				class: "scalar-app-layout scalar-client",
				role: "dialog",
				tabindex: "-1"
			}), [createVNode(unref(ScalarTeleportRoot), null, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, void 0, true)]),
				_: 3
			})], 16), createElementVNode("div", {
				class: "scalar-app-exit",
				onClick: _cache[0] || (_cache[0] = ($event) => __props.modalState.hide())
			})], 2)]);
		};
	}
});
//#endregion
export { ModalClientContainer_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ModalClientContainer.vue.script.js.map