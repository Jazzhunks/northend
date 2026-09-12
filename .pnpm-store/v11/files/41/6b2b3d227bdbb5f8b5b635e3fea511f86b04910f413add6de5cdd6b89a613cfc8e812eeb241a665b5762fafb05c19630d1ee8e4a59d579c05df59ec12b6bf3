import ScalarVirtualTextSearch_default from "./ScalarVirtualTextSearch.vue.js";
import { Fragment, computed, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, nextTick, normalizeClass, normalizeStyle, onBeforeUnmount, onMounted, openBlock, ref, renderList, toDisplayString, watch } from "vue";
//#region src/components/ScalarVirtualText/ScalarVirtualText.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "sticky top-0 z-10 flex h-0 w-full justify-end overflow-visible"
};
var ScalarVirtualText_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarVirtualText",
	props: {
		text: {},
		lineHeight: { default: 20 },
		containerClass: { default: "" },
		contentClass: { default: "" },
		lineClass: { default: "" },
		searchable: {
			type: Boolean,
			default: false
		}
	},
	setup(__props) {
		const props = __props;
		const containerRef = ref(null);
		const searchRef = ref(null);
		const scrollPosition = ref(0);
		const containerHeight = ref(0);
		const searchQuery = ref("");
		const searchOpen = ref(false);
		const activeMatchIndex = ref(0);
		/** Array of text broken into lines */
		const lines = computed(() => props.text.split("\n"));
		/** Total height of all lines combined */
		const totalHeight = computed(() => lines.value.length * props.lineHeight);
		/** Index of the first visible line */
		const visibleStartIndex = computed(() => Math.floor(scrollPosition.value / props.lineHeight));
		/** Index of the last visible line */
		const visibleEndIndex = computed(() => Math.min(Math.ceil((scrollPosition.value + containerHeight.value) / props.lineHeight), lines.value.length));
		const BUFFER = 10;
		/** Index of the first rendered line (clamped, shared between slice and offset) */
		const renderStartIndex = computed(() => Math.max(0, visibleStartIndex.value - BUFFER));
		/** Array of visible lines, including buffer for smooth scrolling */
		const visibleLines = computed(() => {
			const end = Math.min(lines.value.length, visibleEndIndex.value + BUFFER);
			return lines.value.slice(renderStartIndex.value, end);
		});
		/** Pixel offset for the visible content slice */
		const contentOffset = computed(() => renderStartIndex.value * props.lineHeight);
		const searchMatches = computed(() => {
			const query = searchQuery.value;
			if (!query) return [];
			const lowerQuery = query.toLowerCase();
			const matches = [];
			for (let i = 0; i < lines.value.length; i++) {
				const line = lines.value[i];
				if (!line) continue;
				const lowerLine = line.toLowerCase();
				let pos = 0;
				while (pos < lowerLine.length) {
					const idx = lowerLine.indexOf(lowerQuery, pos);
					if (idx === -1) break;
					matches.push({
						line: i,
						start: idx,
						end: idx + query.length
					});
					pos = idx + lowerQuery.length;
				}
			}
			return matches;
		});
		/** Set of line indices that contain at least one match, for quick lookup */
		const matchLineSet = computed(() => {
			const set = /* @__PURE__ */ new Set();
			for (const m of searchMatches.value) set.add(m.line);
			return set;
		});
		/** Clamp active index when match count changes */
		watch(() => searchMatches.value.length, (count) => {
			if (count === 0) activeMatchIndex.value = 0;
			else if (activeMatchIndex.value >= count) activeMatchIndex.value = count - 1;
		});
		/** Scroll the container so the active match's line is visible */
		const scrollToMatch = (match) => {
			if (!containerRef.value) return;
			const targetScroll = match.line * props.lineHeight;
			const viewTop = containerRef.value.scrollTop;
			const viewBottom = viewTop + containerRef.value.clientHeight;
			if (targetScroll < viewTop || targetScroll + props.lineHeight > viewBottom) containerRef.value.scrollTop = targetScroll - containerRef.value.clientHeight / 2;
		};
		const goToMatch = (index) => {
			const match = searchMatches.value[index];
			if (!match) return;
			activeMatchIndex.value = index;
			scrollToMatch(match);
		};
		const nextMatch = () => {
			if (searchMatches.value.length === 0) return;
			goToMatch((activeMatchIndex.value + 1) % searchMatches.value.length);
		};
		const prevMatch = () => {
			if (searchMatches.value.length === 0) return;
			goToMatch((activeMatchIndex.value - 1 + searchMatches.value.length) % searchMatches.value.length);
		};
		const openSearch = () => {
			searchOpen.value = true;
			nextTick(() => searchRef.value?.focus());
		};
		const closeSearch = () => {
			searchOpen.value = false;
			searchQuery.value = "";
			activeMatchIndex.value = 0;
		};
		/** Intercepts Cmd/Ctrl+F when searchable and the container has focus */
		const handleKeydown = (e) => {
			if (!props.searchable) return;
			if ((e.metaKey || e.ctrlKey) && e.key === "f") {
				e.preventDefault();
				e.stopPropagation();
				openSearch();
			}
			if (e.key === "Escape" && searchOpen.value) {
				e.preventDefault();
				closeSearch();
			}
		};
		/** Jump to the first match whenever the query changes */
		watch(searchQuery, () => {
			activeMatchIndex.value = 0;
			const first = searchMatches.value[0];
			if (first) scrollToMatch(first);
		});
		/** Updates the scroll position when the container is scrolled */
		const handleScroll = () => containerRef.value && (scrollPosition.value = containerRef.value.scrollTop);
		/** Updates the container height when the window is resized */
		const updateContainerHeight = () => containerRef.value && (containerHeight.value = containerRef.value.clientHeight);
		onMounted(() => {
			updateContainerHeight();
			window.addEventListener("resize", updateContainerHeight);
		});
		onBeforeUnmount(() => {
			window.removeEventListener("resize", updateContainerHeight);
		});
		const getLineSegments = (absoluteIndex) => {
			const lineText = lines.value[absoluteIndex] ?? "";
			if (!searchQuery.value || !matchLineSet.value.has(absoluteIndex)) return [{
				text: lineText,
				highlight: false,
				active: false
			}];
			const lineMatches = searchMatches.value.filter((m) => m.line === absoluteIndex);
			const segments = [];
			let cursor = 0;
			for (const match of lineMatches) {
				if (match.start > cursor) segments.push({
					text: lineText.slice(cursor, match.start),
					highlight: false,
					active: false
				});
				const isActive = searchMatches.value.indexOf(match) === activeMatchIndex.value;
				segments.push({
					text: lineText.slice(match.start, match.end),
					highlight: true,
					active: isActive
				});
				cursor = match.end;
			}
			if (cursor < lineText.length) segments.push({
				text: lineText.slice(cursor),
				highlight: false,
				active: false
			});
			return segments;
		};
		/**
		* Converts a relative visible-line index to the absolute line index
		* in the full text.
		*/
		const toAbsoluteIndex = (relativeIndex) => renderStartIndex.value + relativeIndex;
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "containerRef",
				ref: containerRef,
				class: normalizeClass(["scalar-virtual-text relative overflow-auto", __props.containerClass]),
				tabindex: "0",
				onKeydown: handleKeydown,
				onScroll: handleScroll
			}, [
				__props.searchable && searchOpen.value ? (openBlock(), createElementBlock("div", _hoisted_1, [createVNode(ScalarVirtualTextSearch_default, {
					ref_key: "searchRef",
					ref: searchRef,
					query: searchQuery.value,
					"onUpdate:query": _cache[0] || (_cache[0] = ($event) => searchQuery.value = $event),
					activeMatchIndex: activeMatchIndex.value,
					matchCount: searchMatches.value.length,
					onClose: closeSearch,
					onNext: nextMatch,
					onPrev: prevMatch
				}, null, 8, [
					"query",
					"activeMatchIndex",
					"matchCount"
				])])) : createCommentVNode("", true),
				createElementVNode("div", { style: normalizeStyle({ height: `${totalHeight.value}px` }) }, null, 4),
				createElementVNode("code", {
					class: normalizeClass(["scalar-virtual-text-content absolute left-0 right-0 top-0", __props.contentClass]),
					style: normalizeStyle({ transform: `translateY(${contentOffset.value}px)` })
				}, [(openBlock(true), createElementBlock(Fragment, null, renderList(visibleLines.value, (line, index) => {
					return openBlock(), createElementBlock("div", {
						key: renderStartIndex.value + index,
						class: normalizeClass(["scalar-virtual-text-line", __props.lineClass]),
						style: normalizeStyle({
							height: `${props.lineHeight}px`,
							lineHeight: `${props.lineHeight}px`
						})
					}, [searchQuery.value && matchLineSet.value.has(toAbsoluteIndex(index)) ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(getLineSegments(toAbsoluteIndex(index)), (segment, sIdx) => {
						return openBlock(), createElementBlock(Fragment, { key: sIdx }, [segment.highlight ? (openBlock(), createElementBlock("mark", {
							key: 0,
							class: normalizeClass(["scalar-virtual-text-highlight", segment.active ? "scalar-virtual-text-highlight-active" : ""])
						}, toDisplayString(segment.text), 3)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createTextVNode(toDisplayString(segment.text), 1)], 64))], 64);
					}), 128)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createTextVNode(toDisplayString(line), 1)], 64))], 6);
				}), 128))], 6)
			], 34);
		};
	}
});
//#endregion
export { ScalarVirtualText_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarVirtualText.vue.script.js.map