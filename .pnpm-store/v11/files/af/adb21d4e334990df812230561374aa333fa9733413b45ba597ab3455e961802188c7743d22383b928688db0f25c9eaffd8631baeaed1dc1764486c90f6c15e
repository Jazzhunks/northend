import Catalog_default from "../views/Catalog/Catalog.vue.js";
import { Fragment, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, openBlock, renderSlot, unref, withCtx } from "vue";
import { useModal } from "@scalar/components/modal";
import { ScalarIconMagnifyingGlass, ScalarIconUpload } from "@scalar/icons";
import { ScalarDropdown, ScalarDropdownItem } from "@scalar/components/dropdown";
//#region src/components/ActionsDropdown.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "dropdown-item" };
var _hoisted_2 = { class: "dropdown-item" };
var ActionsDropdown_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ActionsDropdown",
	emits: ["uploadApi"],
	setup(__props) {
		const catalogModal = useModal();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createVNode(unref(ScalarDropdown), { offset: {
				crossAxis: -5,
				mainAxis: 5
			} }, {
				items: withCtx(() => [createVNode(unref(ScalarDropdownItem), { onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("uploadApi")) }, {
					default: withCtx(() => [createElementVNode("div", _hoisted_1, [createVNode(unref(ScalarIconUpload)), _cache[2] || (_cache[2] = createTextVNode(" Upload API ", -1))])]),
					_: 1
				}), createVNode(unref(ScalarDropdownItem), { onClick: _cache[1] || (_cache[1] = ($event) => unref(catalogModal).show()) }, {
					default: withCtx(() => [createElementVNode("div", _hoisted_2, [createVNode(unref(ScalarIconMagnifyingGlass)), _cache[3] || (_cache[3] = createTextVNode(" Search Catalog ", -1))])]),
					_: 1
				})]),
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, void 0, true)]),
				_: 3
			}), unref(catalogModal).open ? (openBlock(), createBlock(Catalog_default, {
				key: 0,
				modal: unref(catalogModal)
			}, null, 8, ["modal"])) : createCommentVNode("", true)], 64);
		};
	}
});
//#endregion
export { ActionsDropdown_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ActionsDropdown.vue.script.js.map