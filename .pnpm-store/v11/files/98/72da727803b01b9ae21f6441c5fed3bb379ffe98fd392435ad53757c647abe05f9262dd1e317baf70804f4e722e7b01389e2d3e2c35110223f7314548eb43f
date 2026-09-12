import ScalarFileUploadDropTarget_default from "./ScalarFileUploadDropTarget.vue.js";
import ScalarFileUploadError_default from "./ScalarFileUploadError.vue.js";
import ScalarFileUploadInput_default from "./ScalarFileUploadInput.vue.js";
import ScalarFileUploadInputCompact_default from "./ScalarFileUploadInputCompact.vue.js";
import ScalarFileUploadLoading_default from "./ScalarFileUploadLoading.vue.js";
import { isExtensionList } from "./types.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, mergeModels, mergeProps, openBlock, ref, renderSlot, resolveDynamicComponent, toDisplayString, unref, useModel, withCtx, withModifiers } from "vue";
//#region src/components/ScalarFileUpload/ScalarFileUpload.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["accept", "multiple"];
var ScalarFileUpload_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarFileUpload",
	props: /* @__PURE__ */ mergeModels({
		multiple: { type: Boolean },
		accept: { default: "*" },
		loader: {},
		variant: { default: "default" }
	}, {
		"modelValue": {},
		"modelModifiers": {},
		"error": {},
		"errorModifiers": {}
	}),
	emits: /* @__PURE__ */ mergeModels(["selected"], ["update:modelValue", "update:error"]),
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		/** The selected files */
		const files = useModel(__props, "modelValue");
		/** The error message */
		const error = useModel(__props, "error");
		/** The hidden input element */
		const input = ref();
		/** Whether the mouse is hovering over the file upload component */
		const dragover = ref(false);
		/** Opens the file dialog to select files */
		function openFileDialog() {
			input.value?.click();
		}
		/** Handles a list of files */
		function handleFileList(fileList) {
			error.value = void 0;
			if (!fileList || fileList.length < 1) {
				error.value = `No files found to upload`;
				return;
			}
			const f = Array.from(fileList);
			if (!__props.multiple && f.length > 1) {
				error.value = `Too many files selected`;
				return;
			}
			files.value = f;
			emit("selected", f);
		}
		/** Handles the change event from the input */
		function handleChange(event) {
			const f = event.target.files;
			handleFileList(f);
		}
		/** Handles a drop of files from the dropzone  */
		function handleDrop(e) {
			dragover.value = false;
			handleFileList(e.dataTransfer?.files);
		}
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", mergeProps(unref(cx)("flex flex-col relative border-dashed border-1 has-[input:focus-visible]:outline outline-offset-1 rounded"), {
				onDragenter: _cache[1] || (_cache[1] = ($event) => dragover.value = true),
				onDragover: _cache[2] || (_cache[2] = withModifiers(() => {}, ["prevent"])),
				onDrop: withModifiers(handleDrop, ["prevent"])
			}), [
				renderSlot(_ctx.$slots, "default", { open: openFileDialog }, () => [(openBlock(), createBlock(resolveDynamicComponent(__props.variant === "compact" ? ScalarFileUploadInputCompact_default : ScalarFileUploadInput_default), {
					extensions: unref(isExtensionList)(__props.accept) ? __props.accept : void 0,
					onClick: openFileDialog
				}, createSlots({ _: 2 }, [_ctx.$slots.label ? {
					name: "default",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "label")]),
					key: "0"
				} : void 0, error.value ? {
					name: "sublabel",
					fn: withCtx(() => [createVNode(ScalarFileUploadError_default, null, {
						default: withCtx(() => [createTextVNode(toDisplayString(error.value), 1)]),
						_: 1
					})]),
					key: "1"
				} : void 0]), 1032, ["extensions"]))]),
				dragover.value ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: "absolute inset-0",
					onDragleave: _cache[0] || (_cache[0] = ($event) => dragover.value = false)
				}, [renderSlot(_ctx.$slots, "drop-target", {}, () => [createVNode(ScalarFileUploadDropTarget_default, null, createSlots({ _: 2 }, [_ctx.$slots["drop-target-label"] ? {
					name: "default",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "drop-target-label")]),
					key: "0"
				} : void 0]), 1024)])], 32)) : createCommentVNode("", true),
				__props.loader?.isActive ? (openBlock(), createBlock(ScalarFileUploadLoading_default, {
					key: 1,
					loader: __props.loader
				}, null, 8, ["loader"])) : createCommentVNode("", true),
				createElementVNode("input", {
					ref_key: "input",
					ref: input,
					accept: unref(isExtensionList)(__props.accept) ? __props.accept.join(",") : __props.accept,
					class: "sr-only",
					multiple: __props.multiple,
					type: "file",
					onChange: handleChange
				}, null, 40, _hoisted_1)
			], 16);
		};
	}
});
//#endregion
export { ScalarFileUpload_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarFileUpload.vue.script.js.map