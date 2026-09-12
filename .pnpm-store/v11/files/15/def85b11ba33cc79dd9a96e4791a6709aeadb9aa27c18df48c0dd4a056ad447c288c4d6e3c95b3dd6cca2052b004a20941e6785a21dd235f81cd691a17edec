import { createBlock, createTextVNode, createVNode, defineComponent, openBlock, renderSlot, unref, withCtx } from "vue";
import { ScalarIconGear } from "@scalar/icons";
import { ScalarMenu, ScalarMenuLink, ScalarMenuProducts, ScalarMenuResources, ScalarMenuSection, ScalarMenuSupport, ScalarMenuWorkspacePicker } from "@scalar/components/menu";
//#region src/v2/components/sidebar/SidebarMenu.vue?vue&type=script&setup=true&lang.ts
var SidebarMenu_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "SidebarMenu",
	props: {
		activeWorkspace: {},
		workspaces: {}
	},
	emits: [
		"create:workspace",
		"select:workspace",
		"navigate:to:settings"
	],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarMenu), null, {
				products: withCtx(() => [createVNode(unref(ScalarMenuProducts), { selected: "client" })]),
				sections: withCtx(({ close }) => [
					createVNode(unref(ScalarMenuSection), null, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "sidebarMenuActions", {}, () => [createVNode(unref(ScalarMenuWorkspacePicker), {
							modelValue: __props.activeWorkspace.id,
							workspaceOptions: __props.workspaces,
							onCreateWorkspace: _cache[0] || (_cache[0] = ($event) => emit("create:workspace")),
							"onUpdate:modelValue": _cache[1] || (_cache[1] = (value) => emit("select:workspace", value))
						}, null, 8, ["modelValue", "workspaceOptions"]), createVNode(unref(ScalarMenuLink), {
							is: "button",
							icon: unref(ScalarIconGear),
							onClick: () => {
								close();
								emit("navigate:to:settings");
							}
						}, {
							default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode(" Settings ", -1)])]),
							_: 1
						}, 8, ["icon", "onClick"])])]),
						_: 2
					}, 1024),
					createVNode(unref(ScalarMenuResources)),
					createVNode(unref(ScalarMenuSupport))
				]),
				_: 3
			});
		};
	}
});
//#endregion
export { SidebarMenu_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=SidebarMenu.vue.script.js.map