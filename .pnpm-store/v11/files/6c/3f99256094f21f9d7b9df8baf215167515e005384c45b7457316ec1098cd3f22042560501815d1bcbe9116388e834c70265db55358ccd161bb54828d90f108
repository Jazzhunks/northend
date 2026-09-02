import { createBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, openBlock, toDisplayString, unref, withCtx } from "vue";
import { ScalarIconTag, ScalarIconTerminalWindow, ScalarIconTextAlignLeft } from "@scalar/icons";
import { HttpMethod } from "@scalar/sidebar";
import { ScalarSearchResultItem } from "@scalar/components/search-results";
//#region src/v2/features/search/components/SearchResult.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "sr-only" };
var _hoisted_2 = { class: "inline-flex items-center gap-1" };
var _hoisted_3 = { class: "sr-only" };
var SearchResult_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "SearchResult",
	props: {
		id: {},
		isSelected: { type: Boolean },
		result: {}
	},
	setup(__props) {
		/**
		* Icon used for each search result type. Operations use the terminal glyph to
		* match the sidebar's operation indicator, tags and headings use their closest
		* semantic equivalents.
		*/
		const ENTRY_ICONS = {
			heading: ScalarIconTextAlignLeft,
			operation: ScalarIconTerminalWindow,
			tag: ScalarIconTag
		};
		const ENTRY_LABELS = {
			heading: "Heading",
			operation: "Operation",
			tag: "Tag"
		};
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarSearchResultItem), {
				id: __props.id,
				icon: ENTRY_ICONS[__props.result.item.type],
				selected: __props.isSelected
			}, createSlots({
				default: withCtx(() => [createElementVNode("span", null, [
					createElementVNode("span", _hoisted_1, toDisplayString(ENTRY_LABELS[__props.result.item.type]) + ":\xA0", 1),
					createTextVNode(" " + toDisplayString(__props.result.item.title) + " ", 1),
					_cache[0] || (_cache[0] = createElementVNode("span", { class: "sr-only" }, ",", -1))
				])]),
				_: 2
			}, [__props.result.item.type === "operation" && (__props.result.item.method || __props.result.item.path) && __props.result.item.path !== __props.result.item.title ? {
				name: "description",
				fn: withCtx(() => [createElementVNode("span", _hoisted_2, [
					createVNode(unref(HttpMethod), {
						"aria-hidden": "true",
						method: __props.result.item.method ?? "get"
					}, null, 8, ["method"]),
					createElementVNode("span", _hoisted_3, " HTTP Method: " + toDisplayString(__props.result.item.method ?? "get"), 1),
					_cache[1] || (_cache[1] = createElementVNode("span", { class: "sr-only" }, "Path:\xA0", -1)),
					createTextVNode(" " + toDisplayString(__props.result.item.path), 1)
				])]),
				key: "0"
			} : __props.result.item.description ? {
				name: "description",
				fn: withCtx(() => [_cache[2] || (_cache[2] = createElementVNode("span", { class: "sr-only" }, "Description:\xA0", -1)), createTextVNode(" " + toDisplayString(__props.result.item.description), 1)]),
				key: "1"
			} : void 0]), 1032, [
				"id",
				"icon",
				"selected"
			]);
		};
	}
});
//#endregion
export { SearchResult_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=SearchResult.vue.script.js.map