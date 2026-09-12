import { createBlock, defineComponent, openBlock, unref } from "vue";
import { ScalarWrappingText } from "@scalar/components/wrapping-text";
//#region src/components/SidebarItemLabel.vue?vue&type=script&setup=true&lang.ts
var SidebarItemLabel_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "SidebarItemLabel",
	props: {
		item: {},
		operationTitleSource: {}
	},
	setup(__props) {
		return (_ctx, _cache) => {
			return __props.item.type === "model" || __props.item.type === "example" ? (openBlock(), createBlock(unref(ScalarWrappingText), {
				key: 0,
				preset: "property",
				text: __props.item.title
			}, null, 8, ["text"])) : (openBlock(), createBlock(unref(ScalarWrappingText), {
				key: 1,
				text: __props.operationTitleSource === "path" && "path" in __props.item ? __props.item.path : __props.item.title
			}, null, 8, ["text"]));
		};
	}
});
//#endregion
export { SidebarItemLabel_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=SidebarItemLabel.vue.script.js.map