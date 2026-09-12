import { useDropdownItem } from "./useDropdown.js";
import ScalarDropdownButton_default from "./ScalarDropdownButton.vue.js";
import { createBlock, defineComponent, openBlock, renderSlot, unref, useId, withCtx } from "vue";
var ScalarDropdownItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarDropdownItem",
	props: {
		id: { default: () => useId() },
		disabled: { type: Boolean }
	},
	emits: ["click"],
	setup(__props) {
		const { active } = useDropdownItem();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(ScalarDropdownButton_default, {
				id: __props.id,
				active: unref(active) === __props.id,
				disabled: __props.disabled,
				role: "menuitem",
				tabindex: "-1",
				onClick: _cache[0] || (_cache[0] = (e) => _ctx.$emit("click", e)),
				onMouseenter: _cache[1] || (_cache[1] = ($event) => active.value = __props.id)
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, void 0, true)]),
				_: 3
			}, 8, [
				"id",
				"active",
				"disabled"
			]);
		};
	}
});
//#endregion
export { ScalarDropdownItem_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarDropdownItem.vue.script.js.map