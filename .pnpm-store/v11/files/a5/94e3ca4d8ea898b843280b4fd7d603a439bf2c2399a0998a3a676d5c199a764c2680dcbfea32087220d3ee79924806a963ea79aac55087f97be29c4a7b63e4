import SectionFilterButton_default from "./SectionFilterButton.vue.js";
import { Fragment, createBlock, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeModels, nextTick, openBlock, ref, renderList, toDisplayString, unref, useModel, withCtx, withKeys } from "vue";
import { ScalarIcon } from "@scalar/components/icon";
//#region src/components/SectionFilter.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "request-section-content request-section-content-filter fade-request-section-content text-c-3 pointer-events-auto relative hidden w-full justify-end gap-[1.5px] rounded py-1.75 text-xs xl:flex" };
var _hoisted_2 = { class: "filter-button context-bar-group-hover:text-c-1 absolute -right-[30px] flex items-center" };
var _hoisted_3 = { class: "context-bar-group-hover:hidden mr-1.5" };
var SectionFilter_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "SectionFilter",
	props: /* @__PURE__ */ mergeModels({
		filters: { default: () => [] },
		filterIds: {}
	}, {
		"modelValue": {},
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props) {
		const model = useModel(__props, "modelValue");
		const tablist = ref();
		/** Keyboard navigation */
		const navigateSection = (direction) => {
			const offset = direction === "prev" ? -1 : 1;
			const index = model.value ? __props.filters.indexOf(model.value) : 0;
			const length = __props.filters.length;
			const newIndex = (index + offset + length) % length;
			model.value = __props.filters[newIndex];
			nextTick(() => {
				if (tablist.value) {
					const selectedButton = tablist.value.querySelector(`button[aria-selected="true"]`);
					if (selectedButton) selectedButton.focus();
				}
			});
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "tablist",
				ref: tablist,
				class: "filter-hover context-bar-group ml-auto hidden lg:flex",
				role: "tablist",
				onKeydown: [_cache[0] || (_cache[0] = withKeys(($event) => navigateSection("prev"), ["left"])), _cache[1] || (_cache[1] = withKeys(($event) => navigateSection("next"), ["right"]))]
			}, [createElementVNode("div", _hoisted_1, [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.filters, (filter) => {
				return openBlock(), createBlock(SectionFilterButton_default, {
					key: filter,
					class: "filter-hover-item",
					controls: __props.filterIds?.[filter],
					role: "tab",
					selected: model.value === filter,
					onClick: ($event) => model.value = filter
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(filter), 1)]),
					_: 2
				}, 1032, [
					"controls",
					"selected",
					"onClick"
				]);
			}), 128)), createElementVNode("div", _hoisted_2, [createElementVNode("span", _hoisted_3, toDisplayString(model.value), 1), createVNode(unref(ScalarIcon), {
				icon: "FilterList",
				size: "md",
				thickness: "2"
			})])])], 544);
		};
	}
});
//#endregion
export { SectionFilter_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=SectionFilter.vue.script.js.map