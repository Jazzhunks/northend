import DataTable_default from "../../../components/data-table/DataTable.vue.js";
import DataTableHeader_default from "../../../components/data-table/DataTableHeader.vue.js";
import DataTableRow_default from "../../../components/data-table/DataTableRow.vue.js";
import DataTableText_default from "../../../components/data-table/DataTableText.vue.js";
import CollapsibleSection_default from "../../../components/layout/CollapsibleSection.vue.js";
import HelpfulLink_default from "../../../../components/HelpfulLink.vue.js";
import { Fragment, createBlock, createElementBlock, createTextVNode, createVNode, defineComponent, openBlock, renderList, renderSlot, toDisplayString, unref, withCtx } from "vue";
import { httpHeaders } from "@scalar/helpers/http/http-headers";
//#region src/v2/blocks/response-block/components/Headers.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "max-h-[calc(100%-32px)] overflow-y-auto"
};
var _hoisted_2 = {
	key: 1,
	class: "text-c-3 bg-b-1 flex min-h-[64px] items-center justify-center border-t px-4 text-sm"
};
var Headers_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Headers",
	props: { headers: {} },
	setup(__props) {
		const findHeaderInfo = (name) => httpHeaders[name.toLowerCase()];
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(CollapsibleSection_default), {
				class: "overflow-auto",
				defaultOpen: false,
				itemCount: __props.headers.length
			}, {
				title: withCtx(() => [renderSlot(_ctx.$slots, "title")]),
				default: withCtx(() => [__props.headers.length ? (openBlock(), createElementBlock("div", _hoisted_1, [createVNode(unref(DataTable_default), {
					columns: ["minmax(auto, min-content)", "minmax(50%, 1fr)"],
					scroll: ""
				}, {
					default: withCtx(() => [createVNode(unref(DataTableRow_default), { class: "sr-only !block" }, {
						default: withCtx(() => [createVNode(unref(DataTableHeader_default), null, {
							default: withCtx(() => [..._cache[0] || (_cache[0] = [createTextVNode("Header Key", -1)])]),
							_: 1
						}), createVNode(unref(DataTableHeader_default), null, {
							default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode("Header Value", -1)])]),
							_: 1
						})]),
						_: 1
					}), (openBlock(true), createElementBlock(Fragment, null, renderList(__props.headers, (item) => {
						return openBlock(), createBlock(unref(DataTableRow_default), {
							key: item.name,
							class: "group/row text-c-1"
						}, {
							default: withCtx(() => [createVNode(unref(DataTableText_default), { class: "bg-b-1 sticky left-0 z-1 max-w-full group-first/row:border-t-0" }, {
								default: withCtx(() => [typeof findHeaderInfo(item.name)?.url === "string" ? (openBlock(), createBlock(HelpfulLink_default, {
									key: 0,
									class: "decoration-c-3",
									href: findHeaderInfo(item.name).url
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(item.name), 1)]),
									_: 2
								}, 1032, ["href"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createTextVNode(toDisplayString(item.name), 1)], 64))]),
								_: 2
							}, 1024), createVNode(unref(DataTableText_default), {
								class: "z-0 group-first/row:border-t-0",
								text: item.value
							}, null, 8, ["text"])]),
							_: 2
						}, 1024);
					}), 128))]),
					_: 1
				})])) : (openBlock(), createElementBlock("div", _hoisted_2, " No headers "))]),
				_: 3
			}, 8, ["itemCount"]);
		};
	}
});
//#endregion
export { Headers_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=Headers.vue.script.js.map