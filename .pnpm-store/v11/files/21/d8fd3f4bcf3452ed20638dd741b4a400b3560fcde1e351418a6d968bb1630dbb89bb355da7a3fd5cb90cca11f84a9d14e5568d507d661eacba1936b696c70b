import ScalarListboxCheckbox_default from "../ScalarListbox/ScalarListboxCheckbox.vue.js";
import ScalarDropdownMenu_default from "../ScalarDropdown/ScalarDropdownMenu.vue.js";
import ScalarDropdownButton_default from "../ScalarDropdown/ScalarDropdownButton.vue.js";
import ScalarMenuLink_default from "./ScalarMenuLink.vue.js";
import { Fragment, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeModels, mergeProps, openBlock, renderList, toDisplayString, unref, useModel, withCtx } from "vue";
import { ScalarIconCaretRight, ScalarIconPlus, ScalarIconSwap } from "@scalar/icons";
import { DropdownMenu } from "radix-vue/namespaced";
//#region src/components/ScalarMenu/ScalarMenuWorkspacePicker.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex h-full items-center gap-1 flex-1 truncate" };
var ScalarMenuWorkspacePicker_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarMenuWorkspacePicker",
	props: /* @__PURE__ */ mergeModels({ workspaceOptions: {} }, {
		"modelValue": {},
		"modelModifiers": {}
	}),
	emits: /* @__PURE__ */ mergeModels(["createWorkspace"], ["update:modelValue"]),
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const model = useModel(__props, "modelValue");
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(DropdownMenu).Sub, null, {
				default: withCtx(() => [createVNode(ScalarMenuLink_default, mergeProps({
					icon: unref(ScalarIconSwap),
					submenu: ""
				}, _ctx.$attrs), {
					default: withCtx(() => [_cache[2] || (_cache[2] = createElementVNode("div", null, "Change workspace", -1)), createVNode(unref(ScalarIconCaretRight), {
						class: "ml-auto text-c-2 -mr-px size-3",
						weight: "bold"
					})]),
					_: 1
				}, 16, ["icon"]), createVNode(unref(DropdownMenu).Portal, null, {
					default: withCtx(() => [createVNode(unref(DropdownMenu).SubContent, {
						as: unref(ScalarDropdownMenu_default),
						class: "max-h-radix-popper z-context-plus",
						sideOffset: 3
					}, {
						default: withCtx(() => [createVNode(unref(DropdownMenu).RadioGroup, {
							modelValue: model.value,
							"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
							class: "contents"
						}, {
							default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.workspaceOptions, (group, groupIndex) => {
								return openBlock(), createElementBlock(Fragment, { key: groupIndex }, [
									group.label ? (openBlock(), createBlock(unref(DropdownMenu).Label, {
										key: 0,
										class: "px-3 py-1.5 text-xs font-medium text-c-3 select-none"
									}, {
										default: withCtx(() => [createTextVNode(toDisplayString(group.label), 1)]),
										_: 2
									}, 1024)) : createCommentVNode("", true),
									(openBlock(true), createElementBlock(Fragment, null, renderList(group.options, (w) => {
										return openBlock(), createBlock(unref(DropdownMenu).RadioItem, {
											key: w.id,
											as: unref(ScalarDropdownButton_default),
											class: "group/item flex items-center",
											value: w.id
										}, {
											default: withCtx(() => [createElementVNode("div", _hoisted_1, toDisplayString(w.label), 1), createVNode(unref(ScalarListboxCheckbox_default), {
												class: "ml-auto",
												selected: w.id === model.value
											}, null, 8, ["selected"])]),
											_: 2
										}, 1032, ["as", "value"]);
									}), 128)),
									groupIndex < __props.workspaceOptions.length - 1 ? (openBlock(), createBlock(unref(DropdownMenu).Separator, {
										key: 1,
										class: "h-px bg-b-3 my-1.5"
									})) : createCommentVNode("", true)
								], 64);
							}), 128))]),
							_: 1
						}, 8, ["modelValue"]), createVNode(unref(DropdownMenu).Item, {
							as: unref(ScalarDropdownButton_default),
							class: "flex items-center",
							onClick: _cache[1] || (_cache[1] = ($event) => emit("createWorkspace"))
						}, {
							default: withCtx(() => [createVNode(unref(ScalarIconPlus), {
								class: "bg-b-3 -ml-0.75 rounded p-1 size-5 text-c-3",
								weight: "bold"
							}), _cache[3] || (_cache[3] = createTextVNode(" Create workspace ", -1))]),
							_: 1
						}, 8, ["as"])]),
						_: 1
					}, 8, ["as"])]),
					_: 1
				})]),
				_: 1
			});
		};
	}
});
//#endregion
export { ScalarMenuWorkspacePicker_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarMenuWorkspacePicker.vue.script.js.map