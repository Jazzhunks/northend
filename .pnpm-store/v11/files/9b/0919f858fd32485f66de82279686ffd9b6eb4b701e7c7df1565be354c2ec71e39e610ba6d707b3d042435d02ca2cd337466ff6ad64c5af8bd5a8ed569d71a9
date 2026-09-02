import ScalarButton_default from "../ScalarButton/ScalarButton.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { Fragment, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, guardReactiveProps, mergeModels, normalizeProps, openBlock, renderList, toDisplayString, unref, useModel, withCtx } from "vue";
import { formatBytes } from "@scalar/helpers/formatters/format-bytes";
//#region src/components/ScalarFileUpload/ScalarFileUploadFileList.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "border rounded p-1 text-xs" };
var _hoisted_2 = { class: "flex items-center justify-between" };
var _hoisted_3 = { class: "flex-1 min-w-0 truncate" };
var _hoisted_4 = { class: "text-c-3" };
var _hoisted_5 = { class: "flex items-center gap-1.5" };
var ScalarFileUploadFileList_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarFileUploadFileList",
	props: {
		"modelValue": {},
		"modelModifiers": {}
	},
	emits: /* @__PURE__ */ mergeModels(["upload"], ["update:modelValue"]),
	setup(__props) {
		/** The files to display */
		const files = useModel(__props, "modelValue");
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", normalizeProps(guardReactiveProps(unref(cx)("flex flex-col gap-2 p-4"))), [
				_cache[4] || (_cache[4] = createElementVNode("div", { class: "text-c-2" }, "Selected files:", -1)),
				(openBlock(true), createElementBlock(Fragment, null, renderList(files.value, (file) => {
					return openBlock(), createElementBlock("ul", {
						key: file.name,
						class: "flex flex-col gap-0.5"
					}, [createElementVNode("li", _hoisted_1, [createElementVNode("div", _hoisted_2, [createElementVNode("div", _hoisted_3, toDisplayString(file.name), 1), createElementVNode("div", _hoisted_4, toDisplayString(unref(formatBytes)(file.size)), 1)])])]);
				}), 128)),
				createElementVNode("div", _hoisted_5, [createVNode(unref(ScalarButton_default), {
					size: "xs",
					onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("upload"))
				}, {
					default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode(" Upload ", -1)])]),
					_: 1
				}), createVNode(unref(ScalarButton_default), {
					size: "xs",
					variant: "outlined",
					onClick: _cache[1] || (_cache[1] = ($event) => files.value = [])
				}, {
					default: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode(" Clear ", -1)])]),
					_: 1
				})])
			], 16);
		};
	}
});
//#endregion
export { ScalarFileUploadFileList_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarFileUploadFileList.vue.script.js.map