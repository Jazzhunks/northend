import { useState } from "../../state/state.js";
import { useSearch } from "../../hooks/use-search.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, openBlock, renderList, toDisplayString, unref, withCtx } from "vue";
import { ScalarModal } from "@scalar/components/modal";
import { ScalarIcon } from "@scalar/components/icon";
import { ScalarSearchInput } from "@scalar/components/search-input";
//#region src/views/Catalog/Catalog.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "catalog custom-scroll"
};
var _hoisted_2 = ["onClick"];
var _hoisted_3 = { class: "left" };
var _hoisted_4 = ["src"];
var _hoisted_5 = { class: "right" };
var _hoisted_6 = { class: "item-top" };
var _hoisted_7 = { class: "version" };
var _hoisted_8 = { class: "description" };
var Catalog_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Catalog",
	props: { modal: {} },
	setup(__props) {
		const search = useSearch();
		const state = useState();
		const searchOptions = computed(() => search.results.value.filter((r) => {
			return !state.registryDocuments.value.some((d) => d.namespace === r.namespace && d.slug === r.slug);
		}).map((result) => ({
			...result,
			label: result.title,
			id: result.id
		})));
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarModal), {
				class: "catalogModal",
				state: __props.modal
			}, {
				default: withCtx(() => [createVNode(unref(ScalarSearchInput), {
					autofocus: "",
					class: "searchInput",
					modelValue: unref(search).query.value,
					"onUpdate:modelValue": _cache[0] || (_cache[0] = (v) => unref(search).query.value = v ?? "")
				}, null, 8, ["modelValue"]), searchOptions.value.length ? (openBlock(), createElementBlock("div", _hoisted_1, [(openBlock(true), createElementBlock(Fragment, null, renderList(searchOptions.value, (option) => {
					return openBlock(), createElementBlock("button", {
						key: option.id,
						class: "item",
						type: "button",
						onClick: () => {
							unref(state).addDocument(option);
							__props.modal.hide();
						}
					}, [createElementVNode("div", _hoisted_3, [option.logoUrl ? (openBlock(), createElementBlock("img", {
						key: 0,
						class: "logo",
						src: option.logoUrl
					}, null, 8, _hoisted_4)) : (openBlock(), createBlock(unref(ScalarIcon), {
						key: 1,
						class: "logo",
						logo: "Openapi"
					}))]), createElementVNode("div", _hoisted_5, [createElementVNode("div", _hoisted_6, [createElementVNode("span", null, toDisplayString(option.title), 1), createElementVNode("span", _hoisted_7, "v" + toDisplayString(option.currentVersion), 1)]), createElementVNode("span", _hoisted_8, " @" + toDisplayString(option.namespace) + "/" + toDisplayString(option.slug), 1)])], 8, _hoisted_2);
				}), 128))])) : createCommentVNode("", true)]),
				_: 1
			}, 8, ["state"]);
		};
	}
});
//#endregion
export { Catalog_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=Catalog.vue.script.js.map