import { createBlock, createElementVNode, createTextVNode, createVNode, defineComponent, openBlock, unref, withCtx } from "vue";
import { ScalarButton } from "@scalar/components/button";
import { ScalarModal } from "@scalar/components/modal";
//#region src/v2/features/environments/components/EnvironmentDeleteModal.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex justify-between" };
var EnvironmentDeleteModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "EnvironmentDeleteModal",
	props: {
		state: {},
		name: { default: "unknown" }
	},
	emits: ["cancel", "submit"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarModal), {
				bodyClass: "border-t-0 rounded-t-lg flex flex-col gap-4",
				size: "xxs",
				state: __props.state,
				title: `Delete ${__props.name}`
			}, {
				default: withCtx(() => [_cache[4] || (_cache[4] = createElementVNode("p", { class: "text-c-2 text-sm leading-normal text-pretty" }, " Are you sure you want to delete this environment? This action cannot be undone. ", -1)), createElementVNode("div", _hoisted_1, [createVNode(unref(ScalarButton), {
					size: "sm",
					variant: "outlined",
					onClick: _cache[0] || (_cache[0] = () => {
						emit("cancel");
						__props.state.hide();
					})
				}, {
					default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode(" Cancel ", -1)])]),
					_: 1
				}), createVNode(unref(ScalarButton), {
					size: "sm",
					variant: "danger",
					onClick: _cache[1] || (_cache[1] = () => {
						emit("submit");
						__props.state.hide();
					})
				}, {
					default: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode(" Delete Environment ", -1)])]),
					_: 1
				})])]),
				_: 1
			}, 8, ["state", "title"]);
		};
	}
});
//#endregion
export { EnvironmentDeleteModal_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=EnvironmentDeleteModal.vue.script.js.map