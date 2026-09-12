import { Transition, createBlock, createCommentVNode, createElementBlock, createTextVNode, createVNode, defineComponent, onBeforeUnmount, onMounted, openBlock, ref, unref, withCtx } from "vue";
import { ScalarButton } from "@scalar/components/button";
import { ScalarLoading, useLoadingState } from "@scalar/components/loading";
//#region src/v2/blocks/response-block/components/ResponseLoadingOverlay.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "bg-b-1 z-overlay absolute inset-0 flex flex-col items-center justify-center gap-6"
};
var ResponseLoadingOverlay_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ResponseLoadingOverlay",
	props: { eventBus: {} },
	setup(__props) {
		const loader = useLoadingState();
		const timeout = ref();
		const startLoading = () => {
			clearTimeout(timeout.value);
			timeout.value = setTimeout(() => loader.start(), 1e3);
		};
		const stopLoading = () => {
			clearTimeout(timeout.value);
			timeout.value = void 0;
			loader.clear();
		};
		onMounted(() => {
			__props.eventBus.on("hooks:on:request:sent", startLoading);
			__props.eventBus.on("hooks:on:request:complete", stopLoading);
		});
		onBeforeUnmount(() => {
			__props.eventBus.off("hooks:on:request:sent", startLoading);
			__props.eventBus.off("hooks:on:request:complete", stopLoading);
			stopLoading();
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Transition, null, {
				default: withCtx(() => [unref(loader).isActive ? (openBlock(), createElementBlock("div", _hoisted_1, [createVNode(unref(ScalarLoading), {
					class: "text-c-3",
					loader: unref(loader),
					size: "3xl"
				}, null, 8, ["loader"]), createVNode(unref(ScalarButton), {
					variant: "ghost",
					onClick: _cache[0] || (_cache[0] = ($event) => __props.eventBus.emit("operation:cancel:request"))
				}, {
					default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode(" Cancel ", -1)])]),
					_: 1
				})])) : createCommentVNode("", true)]),
				_: 1
			});
		};
	}
});
//#endregion
export { ResponseLoadingOverlay_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ResponseLoadingOverlay.vue.script.js.map