import { createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, openBlock, renderSlot, toDisplayString, unref, withCtx, withModifiers } from "vue";
import { ScalarButton } from "@scalar/components/button";
//#region src/components/Sidebar/Actions/SidebarListElementForm.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex justify-between gap-10" };
var SidebarListElementForm_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "SidebarListElementForm",
	props: {
		danger: { type: Boolean },
		label: {}
	},
	emits: ["cancel", "submit"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("form", {
				class: "flex flex-col gap-4 text-base",
				onSubmit: _cache[1] || (_cache[1] = withModifiers(($event) => emit("submit"), ["prevent"]))
			}, [renderSlot(_ctx.$slots, "default"), createElementVNode("div", _hoisted_1, [createVNode(unref(ScalarButton), {
				size: "sm",
				type: "button",
				variant: "outlined",
				onClick: _cache[0] || (_cache[0] = ($event) => emit("cancel"))
			}, {
				default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode(" Cancel ", -1)])]),
				_: 1
			}), createVNode(unref(ScalarButton), {
				"data-testid": "sidebar-list-element-form-submit-button",
				size: "sm",
				type: "submit",
				variant: __props.danger ? "danger" : "solid"
			}, {
				default: withCtx(() => [createTextVNode(toDisplayString(__props.label ?? "Save"), 1)]),
				_: 1
			}, 8, ["variant"])])], 32);
		};
	}
});
//#endregion
export { SidebarListElementForm_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=SidebarListElementForm.vue.script.js.map