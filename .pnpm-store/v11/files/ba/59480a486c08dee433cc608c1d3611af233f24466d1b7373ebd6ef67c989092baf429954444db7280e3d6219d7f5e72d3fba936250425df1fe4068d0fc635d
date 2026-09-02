import { getLibraryIcon } from "./icons.js";
import { createBlock, createCommentVNode, defineComponent, openBlock, resolveDynamicComponent, shallowRef, watchEffect } from "vue";
//#region src/library/LibraryIcon.vue?vue&type=script&setup=true&lang.ts
var LibraryIcon_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "LibraryIcon",
	props: { src: {} },
	setup(__props) {
		const props = __props;
		const data = shallowRef();
		watchEffect(async () => {
			data.value = await getLibraryIcon(props.src);
		});
		return (_ctx, _cache) => {
			return data.value ? (openBlock(), createBlock(resolveDynamicComponent(data.value), { key: 0 })) : createCommentVNode("", true);
		};
	}
});
//#endregion
export { LibraryIcon_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=LibraryIcon.vue.script.js.map