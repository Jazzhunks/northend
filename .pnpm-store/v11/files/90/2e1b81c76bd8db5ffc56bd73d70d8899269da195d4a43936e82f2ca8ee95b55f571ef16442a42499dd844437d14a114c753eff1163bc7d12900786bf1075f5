import DataTable_default from "../../../components/data-table/DataTable.vue.js";
import DataTableHeader_default from "../../../components/data-table/DataTableHeader.vue.js";
import DataTableRow_default from "../../../components/data-table/DataTableRow.vue.js";
import DataTableText_default from "../../../components/data-table/DataTableText.vue.js";
import CollapsibleSection_default from "../../../components/layout/CollapsibleSection.vue.js";
import { Fragment, createBlock, createElementBlock, createTextVNode, createVNode, defineComponent, normalizeClass, openBlock, renderList, unref, withCtx } from "vue";
//#region src/v2/blocks/response-block/components/ResponseCookies.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "max-h-[calc(100%-32px)] overflow-y-auto"
};
var _hoisted_2 = {
	key: 1,
	class: "text-c-3 bg-b-1 flex min-h-[64px] items-center justify-center border-t px-4 text-sm"
};
var ResponseCookies_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ResponseCookies",
	props: { cookies: {} },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(CollapsibleSection_default), {
				class: "overflow-auto",
				defaultOpen: false,
				itemCount: __props.cookies.length
			}, {
				title: withCtx(() => [..._cache[0] || (_cache[0] = [createTextVNode("Cookies", -1)])]),
				default: withCtx(() => [__props.cookies.length ? (openBlock(), createElementBlock("div", _hoisted_1, [createVNode(unref(DataTable_default), {
					columns: ["minmax(auto, min-content)", "minmax(50%, 1fr)"],
					scroll: ""
				}, {
					default: withCtx(() => [createVNode(unref(DataTableRow_default), { class: "sr-only !block" }, {
						default: withCtx(() => [createVNode(unref(DataTableHeader_default), null, {
							default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode("Cookie Name", -1)])]),
							_: 1
						}), createVNode(unref(DataTableHeader_default), null, {
							default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode("Cookie Value", -1)])]),
							_: 1
						})]),
						_: 1
					}), (openBlock(true), createElementBlock(Fragment, null, renderList(__props.cookies, (item, index) => {
						return openBlock(), createBlock(unref(DataTableRow_default), {
							key: item.name,
							class: "group/row text-c-1"
						}, {
							default: withCtx(() => [createVNode(unref(DataTableText_default), {
								class: normalizeClass(["bg-b-1 sticky left-0 z-1 max-w-full", { "border-t-0": index === 0 }]),
								text: item.name
							}, null, 8, ["class", "text"]), createVNode(unref(DataTableText_default), {
								class: normalizeClass(["z-0", { "border-t-0": index === 0 }]),
								text: item.value
							}, null, 8, ["class", "text"])]),
							_: 2
						}, 1024);
					}), 128))]),
					_: 1
				})])) : (openBlock(), createElementBlock("div", _hoisted_2, " No cookies "))]),
				_: 1
			}, 8, ["itemCount"]);
		};
	}
});
//#endregion
export { ResponseCookies_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ResponseCookies.vue.script.js.map