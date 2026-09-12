import { createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, nextTick, openBlock, ref, toDisplayString, unref, vModelText, watch, withDirectives, withModifiers } from "vue";
import { ScalarIconCaretDown, ScalarIconCaretUp, ScalarIconMagnifyingGlass, ScalarIconX } from "@scalar/icons";
//#region src/components/ScalarVirtualText/ScalarVirtualTextSearch.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "shrink-0 whitespace-nowrap text-xs tabular-nums text-c-3"
};
var _hoisted_2 = ["disabled"];
var _hoisted_3 = ["disabled"];
var ScalarVirtualTextSearch_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarVirtualTextSearch",
	props: {
		query: {},
		matchCount: {},
		activeMatchIndex: {}
	},
	emits: [
		"update:query",
		"next",
		"prev",
		"close"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const searchInputRef = ref(null);
		const localQuery = ref(props.query);
		watch(() => props.query, (val) => {
			localQuery.value = val;
		});
		watch(localQuery, (val) => {
			emit("update:query", val);
		});
		/** Focus the input when mounted */
		const focus = () => {
			nextTick(() => searchInputRef.value?.focus());
		};
		/** Navigate on Enter / Shift+Enter inside the search input */
		const handleSearchKeydown = (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				if (e.shiftKey) emit("prev");
				else emit("next");
			}
			if (e.key === "Escape") {
				e.preventDefault();
				emit("close");
			}
		};
		__expose({ focus });
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: "scalar-virtual-text-search ml-auto mr-2 mt-2 flex h-fit w-fit items-center gap-1 overflow-visible rounded-lg bg-b-2 px-2 py-1 shadow-md",
				onClick: _cache[4] || (_cache[4] = withModifiers(() => {}, ["stop"]))
			}, [
				createVNode(unref(ScalarIconMagnifyingGlass), { class: "pointer-events-none size-3.5 shrink-0 text-c-3" }),
				withDirectives(createElementVNode("input", {
					ref_key: "searchInputRef",
					ref: searchInputRef,
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => localQuery.value = $event),
					"aria-label": "Search in text",
					autocomplete: "off",
					class: "scalar-virtual-text-search-input min-w-0 w-36 appearance-none border-none bg-transparent px-1 py-0.5 text-xs text-c-1 outline-none",
					placeholder: "Find...",
					spellcheck: "false",
					type: "search",
					onKeydown: handleSearchKeydown
				}, null, 544), [[vModelText, localQuery.value]]),
				localQuery.value ? (openBlock(), createElementBlock("span", _hoisted_1, toDisplayString(__props.matchCount > 0 ? `${__props.activeMatchIndex + 1} of ${__props.matchCount}` : "No results"), 1)) : createCommentVNode("", true),
				_cache[5] || (_cache[5] = createElementVNode("span", { class: "mx-0.5 h-3.5 w-px bg-b-3" }, null, -1)),
				createElementVNode("button", {
					"aria-label": "Previous match",
					class: "flex size-5 items-center justify-center rounded text-c-3 hover:bg-b-3 hover:text-c-1 disabled:pointer-events-none disabled:opacity-30",
					disabled: __props.matchCount === 0,
					title: "Previous match (Shift+Enter)",
					type: "button",
					onClick: _cache[1] || (_cache[1] = ($event) => emit("prev"))
				}, [createVNode(unref(ScalarIconCaretUp), { class: "size-3" })], 8, _hoisted_2),
				createElementVNode("button", {
					"aria-label": "Next match",
					class: "flex size-5 items-center justify-center rounded text-c-3 hover:bg-b-3 hover:text-c-1 disabled:pointer-events-none disabled:opacity-30",
					disabled: __props.matchCount === 0,
					title: "Next match (Enter)",
					type: "button",
					onClick: _cache[2] || (_cache[2] = ($event) => emit("next"))
				}, [createVNode(unref(ScalarIconCaretDown), { class: "size-3" })], 8, _hoisted_3),
				createElementVNode("button", {
					"aria-label": "Close search",
					class: "flex size-5 items-center justify-center rounded text-c-3 hover:bg-b-3 hover:text-c-1",
					title: "Close (Escape)",
					type: "button",
					onClick: _cache[3] || (_cache[3] = ($event) => emit("close"))
				}, [createVNode(unref(ScalarIconX), { class: "size-3" })])
			]);
		};
	}
});
//#endregion
export { ScalarVirtualTextSearch_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarVirtualTextSearch.vue.script.js.map