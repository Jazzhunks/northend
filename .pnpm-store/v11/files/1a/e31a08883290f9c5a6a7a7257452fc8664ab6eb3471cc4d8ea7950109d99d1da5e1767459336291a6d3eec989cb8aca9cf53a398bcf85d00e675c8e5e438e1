import { useState } from "../state/state.js";
import { useSearch } from "../hooks/use-search.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, openBlock, renderList, renderSlot, toDisplayString, unref, withCtx } from "vue";
import { ScalarIconMagnifyingGlass } from "@scalar/icons";
import { ScalarPopover } from "@scalar/components/popover";
import { ScalarTextInput } from "@scalar/components/text-input";
//#region src/components/SearchPopover.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["onClick"];
var _hoisted_2 = ["src"];
var _hoisted_3 = {
	key: 1,
	class: "searchResultsEmpty"
};
var SearchPopover_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "SearchPopover",
	setup(__props) {
		const state = useState();
		const search = useSearch();
		const searchOptions = computed(() => search.results.value.filter((r) => !state.registryDocuments.value.some((d) => d.namespace === r.namespace && d.slug === r.slug)).map((result) => ({
			...result,
			label: result.title,
			id: result.id
		})));
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarPopover), {
				offset: 0,
				placement: "top-start",
				resize: "",
				style: { "width": "220px" }
			}, {
				popover: withCtx(({ close }) => [createVNode(unref(ScalarTextInput), {
					autofocus: "",
					class: "searchInput",
					modelValue: unref(search).query.value,
					placeholder: "Add an API",
					"onUpdate:modelValue": _cache[0] || (_cache[0] = (v) => unref(search).query.value = v ?? "")
				}, {
					prefix: withCtx(() => [createVNode(unref(ScalarIconMagnifyingGlass), { class: "searchIcon" })]),
					_: 1
				}, 8, ["modelValue"]), searchOptions.value.length ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(searchOptions.value, (option) => {
					return openBlock(), createElementBlock("button", {
						key: option.id,
						class: "searchItem",
						type: "button",
						onClick: () => {
							unref(state).addDocument(option);
							close();
						}
					}, [option.logoUrl ? (openBlock(), createElementBlock("img", {
						key: 0,
						class: "searchItemLogo",
						src: option.logoUrl
					}, null, 8, _hoisted_2)) : createCommentVNode("", true), createElementVNode("span", null, toDisplayString(option.title), 1)], 8, _hoisted_1);
				}), 128)) : (openBlock(), createElementBlock("span", _hoisted_3, " No APIs found "))]),
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, void 0, true)]),
				_: 3
			});
		};
	}
});
//#endregion
export { SearchPopover_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=SearchPopover.vue.script.js.map