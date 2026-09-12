import { useDocumentSearch } from "../hooks/use-document-search.js";
import SearchResult_default from "./SearchResult.vue.js";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, isRef, openBlock, ref, renderList, toDisplayString, unref, watch, withCtx, withKeys, withModifiers } from "vue";
import { ScalarModal } from "@scalar/components/modal";
import { nanoid } from "nanoid";
import { ScalarSearchInput } from "@scalar/components/search-input";
import { ScalarSearchResultList } from "@scalar/components/search-results";
//#region src/v2/features/search/components/DocumentSearchModal.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	class: "mb-0 flex flex-col",
	role: "search"
};
var DocumentSearchModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DocumentSearchModal",
	props: {
		modalState: {},
		document: {}
	},
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		/** Base id for the search form. */
		const id = nanoid();
		const listboxId = `${id}-search-result`;
		const instructionsId = `${id}-search-instructions`;
		const { query, results } = useDocumentSearch(() => props.document);
		const selectedIndex = ref(void 0);
		/**
		* Reset the query every time the modal is opened so users always start from a
		* clean state. Matches the reference search modal behaviour.
		*/
		watch(() => props.modalState.open, (open) => {
			if (open) {
				query.value = "";
				selectedIndex.value = void 0;
			}
		});
		/** Keyboard navigation, wrapping around the ends of the result list. */
		const navigateSearchResults = (direction) => {
			const offset = direction === "up" ? -1 : 1;
			const length = results.value.length;
			if (length === 0) return;
			if (typeof selectedIndex.value === "number") {
				selectedIndex.value = (selectedIndex.value + offset + length) % length;
				return;
			}
			selectedIndex.value = offset === -1 ? length - 1 : 0;
		};
		function handleSelect(idx) {
			if (typeof idx !== "number" || !results.value[idx]) return;
			const result = results.value[idx];
			props.modalState.hide();
			emit("select", result.item.id);
		}
		/**
		* aria-activedescendant for the combobox. Each result item must render the
		* matching id for assistive tech to announce the selection correctly.
		*/
		const activeDescendantId = computed(() => {
			const selectedResult = results.value[selectedIndex.value ?? -1];
			return selectedResult ? `search-result-${selectedResult.item.id}` : void 0;
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarModal), {
				"aria-label": "Document Search",
				state: __props.modalState,
				variant: "search"
			}, {
				default: withCtx(() => [
					createElementVNode("div", _hoisted_1, [createVNode(unref(ScalarSearchInput), {
						modelValue: unref(query),
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(query) ? query.value = $event : null),
						"aria-activedescendant": activeDescendantId.value,
						"aria-autocomplete": "list",
						"aria-controls": listboxId,
						"aria-describedby": instructionsId,
						role: "combobox",
						onBlur: _cache[1] || (_cache[1] = ($event) => selectedIndex.value = void 0),
						onKeydown: [
							_cache[2] || (_cache[2] = withKeys(withModifiers(($event) => navigateSearchResults("down"), ["stop", "prevent"]), ["down"])),
							_cache[3] || (_cache[3] = withKeys(withModifiers(() => handleSelect(selectedIndex.value), ["stop", "prevent"]), ["enter"])),
							_cache[4] || (_cache[4] = withKeys(withModifiers(($event) => navigateSearchResults("up"), ["stop", "prevent"]), ["up"]))
						]
					}, null, 8, ["modelValue", "aria-activedescendant"])]),
					createVNode(unref(ScalarSearchResultList), {
						id: listboxId,
						"aria-label": "Document Search Results",
						class: "custom-scroll px-1 pb-1",
						noResults: !unref(results).length
					}, {
						query: withCtx(() => [createTextVNode(toDisplayString(unref(query)), 1)]),
						default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(unref(results), (result, idx) => {
							return openBlock(), createBlock(SearchResult_default, {
								id: `search-result-${result.item.id}`,
								key: result.refIndex,
								isSelected: selectedIndex.value === idx,
								result,
								onClick: withModifiers(() => handleSelect(idx), ["prevent"])
							}, null, 8, [
								"id",
								"isSelected",
								"result",
								"onClick"
							]);
						}), 128))]),
						_: 1
					}, 8, ["noResults"]),
					createElementVNode("div", {
						id: instructionsId,
						class: "ref-search-meta"
					}, [..._cache[5] || (_cache[5] = [createElementVNode("span", {
						"aria-hidden": "true",
						class: "contents"
					}, [createElementVNode("span", null, "↑↓ Navigate"), createElementVNode("span", null, "⏎ Select")], -1), createElementVNode("span", { class: "sr-only" }, " Press up arrow / down arrow to navigate, enter to select, type to filter results ", -1)])])
				]),
				_: 1
			}, 8, ["state"]);
		};
	}
});
//#endregion
export { DocumentSearchModal_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=DocumentSearchModal.vue.script.js.map