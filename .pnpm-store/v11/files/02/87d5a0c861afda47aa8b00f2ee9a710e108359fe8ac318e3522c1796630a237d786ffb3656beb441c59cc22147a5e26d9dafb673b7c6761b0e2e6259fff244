import { computed, createBlock, createElementBlock, createElementVNode, createVNode, defineComponent, openBlock, toDisplayString, unref, withCtx } from "vue";
import { ScalarButton } from "@scalar/components/button";
import { ScalarIconCaretDown } from "@scalar/icons";
import { ScalarListbox } from "@scalar/components/listbox";
//#region src/components/Selector.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "overflow-x-auto" };
var _hoisted_2 = {
	key: 1,
	class: "text-c-1 flex h-auto w-full items-center gap-0.75 rounded-b-lg px-3 py-1.5 text-base leading-[20px] whitespace-nowrap"
};
var _hoisted_3 = { class: "overflow-x-auto" };
var Selector_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Selector",
	props: {
		selectedServer: {},
		servers: {},
		target: {}
	},
	emits: ["update:modelValue"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const emit = __emit;
		const serverOptions = computed(() => __props.servers.map((server) => ({
			id: server.url,
			label: server.url
		})));
		const serverUrlWithoutTrailingSlash = computed(() => __props.selectedServer?.url?.replace(/\/$/, "") || "");
		const selectedServerOption = computed(() => serverOptions.value.find((opt) => opt.id === __props.selectedServer?.url));
		__expose({
			servers: __props.servers,
			serverUrlWithoutTrailingSlash,
			serverOptions,
			selectedServer: __props.selectedServer
		});
		return (_ctx, _cache) => {
			return serverOptions.value.length > 1 ? (openBlock(), createBlock(unref(ScalarListbox), {
				key: 0,
				ref: "elem",
				class: "group",
				modelValue: selectedServerOption.value,
				options: serverOptions.value,
				placement: "bottom-start",
				resize: "",
				target: __props.target,
				"onUpdate:modelValue": _cache[0] || (_cache[0] = (e) => emit("update:modelValue", e.id))
			}, {
				default: withCtx(() => [createVNode(unref(ScalarButton), {
					class: "bg-b-1 text-c-1 h-auto w-full justify-start gap-1.5 overflow-x-auto rounded-t-none rounded-b-xl px-3 py-1.5 text-base font-normal whitespace-nowrap -outline-offset-1",
					variant: "ghost"
				}, {
					default: withCtx(() => [
						_cache[1] || (_cache[1] = createElementVNode("span", { class: "sr-only" }, "Server:", -1)),
						createElementVNode("span", _hoisted_1, toDisplayString(serverUrlWithoutTrailingSlash.value || "Select a server"), 1),
						createVNode(unref(ScalarIconCaretDown), {
							class: "text-c-2 ui-open:rotate-180 mt-0.25 size-3 transition-transform duration-100",
							weight: "bold"
						})
					]),
					_: 1
				})]),
				_: 1
			}, 8, [
				"modelValue",
				"options",
				"target"
			])) : (openBlock(), createElementBlock("div", _hoisted_2, [_cache[2] || (_cache[2] = createElementVNode("span", { class: "sr-only" }, "Server:", -1)), createElementVNode("span", _hoisted_3, toDisplayString(serverUrlWithoutTrailingSlash.value), 1)]));
		};
	}
});
//#endregion
export { Selector_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=Selector.vue.script.js.map