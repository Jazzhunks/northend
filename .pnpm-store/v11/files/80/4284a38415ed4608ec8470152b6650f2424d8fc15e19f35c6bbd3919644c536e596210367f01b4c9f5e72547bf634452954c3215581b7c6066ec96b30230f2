import { useFileDialog } from "../../../../hooks/use-file-dialog.js";
import RequestTable_default from "./RequestTable.vue.js";
import { getFormBodyRows } from "../helpers/get-form-body-rows.js";
import { createBlock, defineComponent, openBlock, ref, watch } from "vue";
//#region src/v2/blocks/request-block/components/RequestBodyForm.vue?vue&type=script&setup=true&lang.ts
var RequestBodyForm_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "RequestBodyForm",
	props: {
		example: {},
		bodySchema: {},
		selectedContentType: {},
		environment: {}
	},
	emits: ["update:formValue"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		/** Local state for form body rows */
		const localFormBodyRows = ref([]);
		/** Sync the local form body rows with the example and schema */
		watch(() => [
			__props.example,
			__props.bodySchema,
			__props.selectedContentType
		], ([newExample, schema, contentType]) => {
			localFormBodyRows.value = getFormBodyRows(newExample, contentType, schema);
		}, { immediate: true });
		const handleUpdateFormValue = (rows) => {
			emit("update:formValue", rows.map((row) => ({
				name: row.name,
				value: row.value,
				isDisabled: row.isDisabled ?? false
			})));
		};
		/** Update a row in the table, combines with the previous data so we emit a whole row */
		const handleUpsertRow = (index, payload) => {
			if (index >= localFormBodyRows.value.length) {
				localFormBodyRows.value = [...localFormBodyRows.value, {
					name: "",
					value: "",
					...payload,
					isDisabled: false
				}];
				handleUpdateFormValue(localFormBodyRows.value);
				return;
			}
			localFormBodyRows.value = localFormBodyRows.value.map((row, i) => i === index ? {
				...row,
				...payload
			} : row);
			handleUpdateFormValue(localFormBodyRows.value);
		};
		/** Delete a row from the table */
		const handleDeleteRow = (index) => {
			localFormBodyRows.value = localFormBodyRows.value.filter((_, i) => i !== index);
			handleUpdateFormValue(localFormBodyRows.value);
		};
		/** Handle file upload for a specific row index */
		const handleFileUpload = (index) => {
			const { open } = useFileDialog({
				onChange: (files) => {
					const file = files?.[0];
					if (file) {
						const currentRow = localFormBodyRows.value[index];
						handleUpsertRow(index, {
							name: currentRow?.name || file.name,
							value: file
						});
					}
				},
				multiple: false,
				accept: "*/*"
			});
			open();
		};
		return (_ctx, _cache) => {
			return __props.selectedContentType === "multipart/form-data" ? (openBlock(), createBlock(RequestTable_default, {
				key: 0,
				data: localFormBodyRows.value,
				environment: __props.environment,
				showUploadButton: "",
				onDeleteRow: handleDeleteRow,
				onRemoveFile: _cache[0] || (_cache[0] = (index) => handleUpsertRow(index, { value: void 0 })),
				onUploadFile: handleFileUpload,
				onUpsertRow: handleUpsertRow
			}, null, 8, ["data", "environment"])) : (openBlock(), createBlock(RequestTable_default, {
				key: 1,
				data: localFormBodyRows.value,
				environment: __props.environment,
				onDeleteRow: handleDeleteRow,
				onUpsertRow: handleUpsertRow
			}, null, 8, ["data", "environment"]));
		};
	}
});
//#endregion
export { RequestBodyForm_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=RequestBodyForm.vue.script.js.map