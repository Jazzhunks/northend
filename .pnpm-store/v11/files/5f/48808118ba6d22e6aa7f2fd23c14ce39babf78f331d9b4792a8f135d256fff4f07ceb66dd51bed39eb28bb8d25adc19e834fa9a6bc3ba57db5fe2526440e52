import { useFileDialog } from "../../../../hooks/use-file-dialog.js";
import CodeInput_default from "../../../components/code-input/CodeInput.vue.js";
import DataTable_default from "../../../components/data-table/DataTable.vue.js";
import DataTableHeader_default from "../../../components/data-table/DataTableHeader.vue.js";
import DataTableRow_default from "../../../components/data-table/DataTableRow.vue.js";
import { getFileName } from "../helpers/files.js";
import RequestBodyForm_default from "./RequestBodyForm.vue.js";
import CollapsibleSection_default from "../../../components/layout/CollapsibleSection.vue.js";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, openBlock, toDisplayString, unref, withCtx } from "vue";
import { ScalarButton } from "@scalar/components/button";
import { ScalarListbox } from "@scalar/components/listbox";
import { objectEntries } from "@scalar/helpers/object/object-entries";
import { ScalarIcon } from "@scalar/components/icon";
import { getExampleFromBody, getSelectedBodyContentType } from "@scalar/workspace-store/request-example";
import { parseMimeType } from "@scalar/helpers/http/mime-type";
import { unpackProxyObject } from "@scalar/workspace-store/helpers/unpack-proxy";
import { CONTENT_TYPES } from "@scalar/helpers/http/content-types";
import { resolve } from "@scalar/workspace-store/resolve";
//#region src/v2/blocks/request-block/components/RequestBody.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "text-c-3 flex min-h-10 w-full items-center justify-center border-t p-2 text-sm"
};
var _hoisted_2 = {
	key: 1,
	class: "flex items-center justify-center overflow-hidden border-t p-1.5"
};
var _hoisted_3 = { class: "text-c-2 w-full max-w-full overflow-hidden rounded border px-1.5 py-1 text-xs whitespace-nowrap" };
var RequestBody_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "RequestBody",
	props: {
		requestBody: {},
		exampleKey: {},
		title: {},
		environment: {},
		requestBodyCompositionSelection: {}
	},
	emits: [
		"update:contentType",
		"update:value",
		"update:formValue"
	],
	setup(__props, { emit: __emit }) {
		const emits = __emit;
		const contentTypeToLanguageMap = {
			"application/json": "json",
			"application/xml": "xml",
			"application/yaml": "yaml"
		};
		/** Selected content type with default */
		const selectedContentType = computed(() => getSelectedBodyContentType(__props.requestBody, __props.exampleKey) ?? "none");
		/**
		* Strips MIME parameters (such as `charset=utf-8`) for dropdown labels, aligned with how we treat
		* media types elsewhere (see api-reference `normalizeMimeType` / WHATWG essence).
		*/
		const contentTypeLabel = (raw) => parseMimeType(raw).essence;
		/**
		* Build the dropdown options for the content type selector.
		*
		* The list is composed of two groups:
		*   1. The built-in content types we ship friendly labels for (JSON, XML, Multipart Form, etc.).
		*   2. Any additional content types defined on the OpenAPI request body that are not in the built-in list
		*      (for example `text/csv`, `application/pdf`, vendor types like `application/vnd.api+json`, ...).
		*
		* The OpenAPI-defined extras are appended at the bottom so the well-known options stay on top, and
		* users can always pick the exact content type the operation actually accepts.
		*/
		const contentTypeOptions = computed(() => {
			const builtIn = objectEntries(CONTENT_TYPES).map(([id, label]) => ({
				id,
				label
			}));
			const extras = Object.keys(__props.requestBody?.content ?? {}).filter((type) => {
				if (type in CONTENT_TYPES) return false;
				return !(contentTypeLabel(type) in CONTENT_TYPES);
			}).map((type) => ({
				id: type,
				label: contentTypeLabel(type)
			}));
			return [...builtIn, ...extras];
		});
		const selectedContentTypeModel = computed({
			get: () => {
				const found = contentTypeOptions.value.find((it) => it.id === selectedContentType.value);
				if (found) return found;
				const essence = contentTypeLabel(selectedContentType.value);
				const friendly = CONTENT_TYPES[essence] ?? essence;
				return {
					id: selectedContentType.value,
					label: friendly
				};
			},
			set: (v) => {
				emits("update:contentType", { value: v.id });
			}
		});
		function handleFileUpload(callback) {
			const { open } = useFileDialog({
				onChange: (files) => {
					const file = files?.[0];
					if (file) callback(file);
				},
				multiple: false,
				accept: "*/*"
			});
			open();
		}
		/** Dereferenced example */
		const example = computed(() => __props.requestBody && getExampleFromBody(__props.requestBody, selectedContentType.value, __props.exampleKey, __props.requestBodyCompositionSelection));
		/** Convert the example value to a string for the code editor */
		const bodyValue = computed(() => {
			if (!example.value) return "";
			const value = example.value.value;
			if (typeof value === "string") return value;
			return JSON.stringify(value, null, 2);
		});
		/** Resolved schema for the request body */
		const bodySchema = computed(() => {
			return resolve.schema(__props.requestBody?.content?.[selectedContentType.value]?.schema);
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(CollapsibleSection_default), null, {
				title: withCtx(() => [createTextVNode(toDisplayString(__props.title), 1)]),
				default: withCtx(() => [createVNode(unref(DataTable_default), {
					columns: [""],
					presentational: ""
				}, {
					default: withCtx(() => [createVNode(unref(DataTableHeader_default), { class: "relative col-span-full flex h-8 cursor-pointer items-center justify-between border-r-0 !p-0" }, {
						default: withCtx(() => [createVNode(unref(ScalarListbox), {
							modelValue: selectedContentTypeModel.value,
							"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => selectedContentTypeModel.value = $event),
							options: contentTypeOptions.value,
							teleport: ""
						}, {
							default: withCtx(() => [createVNode(unref(ScalarButton), {
								class: "text-c-2 hover:text-c-1 flex h-full w-fit gap-1.5 px-3 font-normal",
								fullWidth: "",
								variant: "ghost"
							}, {
								default: withCtx(() => [createElementVNode("span", null, toDisplayString(selectedContentTypeModel.value.label), 1), createVNode(unref(ScalarIcon), {
									icon: "ChevronDown",
									size: "md"
								})]),
								_: 1
							})]),
							_: 1
						}, 8, ["modelValue", "options"])]),
						_: 1
					}), createVNode(unref(DataTableRow_default), null, {
						default: withCtx(() => [selectedContentType.value === "none" ? (openBlock(), createElementBlock("div", _hoisted_1, [..._cache[5] || (_cache[5] = [createElementVNode("span", null, "No Body", -1)])])) : selectedContentType.value === "application/octet-stream" ? (openBlock(), createElementBlock("div", _hoisted_2, [unref(getFileName)(unref(unpackProxyObject)(example.value?.value)) !== void 0 ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createElementVNode("span", _hoisted_3, toDisplayString(unref(getFileName)(unref(unpackProxyObject)(example.value?.value))), 1), createVNode(unref(ScalarButton), {
							class: "bg-b-2 hover:bg-b-3 text-c-2 ml-1 border-0 shadow-none",
							size: "sm",
							variant: "outlined",
							onClick: _cache[1] || (_cache[1] = ($event) => emits("update:value", {
								payload: void 0,
								contentType: selectedContentType.value
							}))
						}, {
							default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode(" Delete ", -1)])]),
							_: 1
						})], 64)) : (openBlock(), createBlock(unref(ScalarButton), {
							key: 1,
							class: "bg-b-2 hover:bg-b-3 text-c-2 border-0 shadow-none",
							size: "sm",
							variant: "outlined",
							onClick: _cache[2] || (_cache[2] = () => handleFileUpload((file) => emits("update:value", {
								payload: file,
								contentType: selectedContentType.value
							})))
						}, {
							default: withCtx(() => [_cache[7] || (_cache[7] = createElementVNode("span", null, "Select File", -1)), createVNode(unref(ScalarIcon), {
								class: "ml-1",
								icon: "Upload",
								size: "xs",
								thickness: "2.5"
							})]),
							_: 1
						}))])) : selectedContentType.value === "multipart/form-data" || selectedContentType.value === "application/x-www-form-urlencoded" ? (openBlock(), createBlock(RequestBodyForm_default, {
							key: 2,
							bodySchema: bodySchema.value,
							environment: __props.environment,
							example: example.value,
							selectedContentType: selectedContentType.value,
							"onUpdate:formValue": _cache[3] || (_cache[3] = (payload) => emits("update:formValue", {
								payload,
								contentType: selectedContentType.value
							}))
						}, null, 8, [
							"bodySchema",
							"environment",
							"example",
							"selectedContentType"
						])) : (openBlock(), createBlock(unref(CodeInput_default), {
							key: 3,
							class: "border-t px-3",
							content: "",
							environment: __props.environment,
							language: contentTypeToLanguageMap[selectedContentType.value] ?? "plaintext",
							lineNumbers: "",
							lint: "",
							modelValue: bodyValue.value,
							withFakeData: "",
							"onUpdate:modelValue": _cache[4] || (_cache[4] = (value) => emits("update:value", {
								payload: value,
								contentType: selectedContentType.value
							}))
						}, null, 8, [
							"environment",
							"language",
							"modelValue"
						]))]),
						_: 1
					})]),
					_: 1
				})]),
				_: 1
			});
		};
	}
});
//#endregion
export { RequestBody_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=RequestBody.vue.script.js.map