import ScalarHotkey_default from "../ScalarHotkey/ScalarHotkey.vue.js";
import { useTooltip } from "./useTooltip.js";
import { computed, createElementBlock, defineComponent, h, normalizeClass, openBlock, ref, render, renderSlot } from "vue";
var ScalarHotkeyTooltip_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarHotkeyTooltip",
	props: {
		content: { default: "" },
		hotkey: {},
		modifier: {},
		delay: { default: () => 300 },
		placement: { default: "top" },
		offset: { default: () => 4 }
	},
	setup(__props) {
		const wrapperRef = ref(null);
		useTooltip({
			content: computed(() => {
				if (!document) return "";
				const el = document.createElement("div");
				const hotKeyClass = "-m-0.5 border-none p-0 grid grid-flow-col *:border *:h-5 *:min-w-5 *:border-border-tooltip *:rounded *:px-1 *:flex *:items-center *:justify-center";
				if (__props.content) render(h("div", { class: "flex items-center gap-2" }, [__props.content, h(ScalarHotkey_default, {
					class: hotKeyClass,
					hotkey: __props.hotkey,
					modifier: __props.modifier
				})]), el);
				else render(h(ScalarHotkey_default, {
					class: hotKeyClass,
					hotkey: __props.hotkey,
					modifier: __props.modifier
				}), el);
				return el.innerHTML;
			}),
			contentTarget: "innerHTML",
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
export { ScalarHotkeyTooltip_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarHotkeyTooltip.vue.script.js.map