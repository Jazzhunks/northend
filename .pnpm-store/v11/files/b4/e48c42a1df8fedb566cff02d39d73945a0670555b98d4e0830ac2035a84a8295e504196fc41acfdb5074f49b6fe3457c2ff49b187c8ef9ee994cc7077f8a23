import DataTable_default from "../../../components/data-table/DataTable.vue.js";
import DataTableHeader_default from "../../../components/data-table/DataTableHeader.vue.js";
import DataTableRow_default from "../../../components/data-table/DataTableRow.vue.js";
import RequestTableRow_default from "./RequestTableRow.vue.js";
import { Fragment, computed, createBlock, createElementBlock, createTextVNode, createVNode, defineComponent, openBlock, renderList, toDisplayString, unref, withCtx } from "vue";
//#region src/v2/blocks/request-block/components/RequestTable.vue?vue&type=script&setup=true&lang.ts
var RequestTable_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "RequestTable",
	props: {
		data: {},
		hasCheckboxDisabled: { type: Boolean },
		invalidParams: {},
		label: {},
		showUploadButton: { type: Boolean },
		showAddRowPlaceholder: {
			type: Boolean,
			default: true
		},
		environment: {}
	},
	emits: [
		"upsertRow",
		"deleteRow",
		"uploadFile",
		"removeFile",
		"navigate"
	],
	setup(__props, { emit: __emit }) {
		/**
		* Make this component more generic that can be used also for the operation body
		*/
		const emit = __emit;
		const columns = computed(() => {
			if (__props.showUploadButton) return [
				"36px",
				"",
				"",
				"auto"
			];
			return [
				"36px",
				"",
				""
			];
		});
		/** Add the last empty row (for ui purposes only) */
		const displayData = computed(() => {
			if (!__props.showAddRowPlaceholder) return __props.data;
			const last = __props.data.at(-1);
			if (!last || last.name !== "" || last.value !== "") return [...__props.data, {
				name: "",
				value: "",
				isDisabled: true
			}];
			return __props.data;
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(DataTable_default), {
				class: "group/table flex-1",
				columns: columns.value
			}, {
				default: withCtx(() => [createVNode(unref(DataTableRow_default), { class: "sr-only !block" }, {
					default: withCtx(() => [
						createVNode(unref(DataTableHeader_default), null, {
							default: withCtx(() => [createTextVNode(toDisplayString(__props.label) + " Enabled", 1)]),
							_: 1
						}),
						createVNode(unref(DataTableHeader_default), null, {
							default: withCtx(() => [createTextVNode(toDisplayString(__props.label) + " Key", 1)]),
							_: 1
						}),
						createVNode(unref(DataTableHeader_default), null, {
							default: withCtx(() => [createTextVNode(toDisplayString(__props.label) + " Value", 1)]),
							_: 1
						})
					]),
					_: 1
				}), (openBlock(true), createElementBlock(Fragment, null, renderList(displayData.value, (row, index) => {
					return openBlock(), createBlock(RequestTableRow_default, {
						key: index,
						data: row,
						environment: __props.environment,
						hasCheckboxDisabled: __props.hasCheckboxDisabled,
						invalidParams: __props.invalidParams,
						label: __props.label,
						showUploadButton: __props.showUploadButton,
						onDeleteRow: ($event) => emit("deleteRow", index),
						onNavigate: _cache[0] || (_cache[0] = (route) => emit("navigate", route)),
						onRemoveFile: ($event) => emit("removeFile", index),
						onUploadFile: ($event) => emit("uploadFile", index),
						onUpsertRow: (payload) => emit("upsertRow", index, payload)
					}, null, 8, [
						"data",
						"environment",
						"hasCheckboxDisabled",
						"invalidParams",
						"label",
						"showUploadButton",
						"onDeleteRow",
						"onRemoveFile",
						"onUploadFile",
						"onUpsertRow"
					]);
				}), 128))]),
				_: 1
			}, 8, ["columns"]);
		};
	}
});
//#endregion
export { RequestTable_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=RequestTable.vue.script.js.map