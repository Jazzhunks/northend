import { formatHotkeySymbols, getKeyLabel } from "./formatHotkey.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { Fragment, computed, createElementBlock, createElementVNode, defineComponent, guardReactiveProps, normalizeProps, openBlock, renderList, toDisplayString, unref } from "vue";
//#region src/components/ScalarHotkey/ScalarHotkey.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	"aria-hidden": "true",
	class: "contents"
};
var _hoisted_2 = { class: "sr-only" };
var ScalarHotkey_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarHotkey",
	props: {
		hotkey: {},
		modifier: { default: () => ["Meta"] }
	},
	setup(__props) {
		const { cx } = useBindCx();
		const hotkeyChars = computed(() => formatHotkeySymbols(__props.hotkey, __props.modifier));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", normalizeProps(guardReactiveProps(unref(cx)("border-(--scalar-background-3) inline-flex gap-0.5 overflow-hidden rounded border text-xxs rounded-b p-1 font-medium uppercase leading-none"))), [(openBlock(true), createElementBlock(Fragment, null, renderList(hotkeyChars.value, (char, i) => {
				return openBlock(), createElementBlock("div", { key: i }, [createElementVNode("span", _hoisted_1, toDisplayString(char), 1), createElementVNode("span", _hoisted_2, toDisplayString(unref(getKeyLabel)(char)), 1)]);
			}), 128))], 16);
		};
	}
});
//#endregion
export { ScalarHotkey_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarHotkey.vue.script.js.map