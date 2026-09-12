import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, nextTick, normalizeClass, openBlock, ref, renderList, toDisplayString, unref, vModelText, watch, withCtx, withDirectives, withKeys } from "vue";
import { ScalarButton } from "@scalar/components/button";
import { ScalarIcon } from "@scalar/components/icon";
import { ScalarComboboxMultiselect } from "@scalar/components/combobox";
import { ScalarDropdown, ScalarDropdownDivider, ScalarDropdownItem } from "@scalar/components/dropdown";
//#region src/v2/components/data-table/DataTableInputSelect.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "group-[.alert]:outline-orange group-[.error]:outline-red w-full pr-10 -outline-offset-1 has-[:focus-visible]:rounded-[4px] has-[:focus-visible]:outline" };
var _hoisted_2 = { class: "text-c-1 whitespace-nowrap" };
var _hoisted_3 = { class: "text-c-1 overflow-hidden text-ellipsis" };
var _hoisted_4 = { class: "overflow-hidden text-ellipsis" };
var _hoisted_5 = { class: "flex h-4 w-4 items-center justify-center" };
var DataTableInputSelect_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DataTableInputSelect",
	props: {
		modelValue: { type: [
			String,
			Number,
			Boolean,
			Array,
			Object
		] },
		value: {},
		default: { type: [
			String,
			Number,
			Boolean,
			Array,
			Object
		] },
		canAddCustomValue: {
			type: Boolean,
			default: true
		},
		type: {}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const options = computed(() => props.value ?? []);
		const addingCustomValue = ref(false);
		const customValue = ref("");
		const inputRef = ref(null);
		watch(customValue, (newValue) => {
			emit("update:modelValue", newValue);
		});
		const updateSelected = (value) => {
			emit("update:modelValue", value);
			addingCustomValue.value = false;
		};
		const addCustomValue = () => {
			if (customValue.value.trim()) updateSelected(customValue.value);
		};
		const handleBlur = () => {
			if (!customValue.value.trim()) emit("update:modelValue", "");
			addingCustomValue.value = false;
		};
		const isSelected = (value) => {
			return props.modelValue.toString() === value;
		};
		watch(addingCustomValue, (newValue) => {
			if (newValue) nextTick(() => {
				inputRef.value?.focus();
			});
		});
		const initialValue = computed(() => {
			return props.modelValue !== void 0 ? props.modelValue : props.default;
		});
		/** Options for the array type */
		const arrayOptions = computed(() => options.value.map((option) => {
			const id = option.toString();
			return {
				id,
				label: id,
				value: id
			};
		}));
		/** Filter the options by what is selected */
		const selectedArrayOptions = computed(() => {
			const selectedValues = new Set(props.modelValue.toString().split(","));
			return arrayOptions.value.filter((option) => selectedValues.has(option.id));
		});
		/** Update the model value when the selected options change */
		const updateSelectedOptions = (selectedOptions) => {
			emit("update:modelValue", selectedOptions.map((option) => option.value).join(","));
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [__props.type === "array" ? (openBlock(), createBlock(unref(ScalarComboboxMultiselect), {
				key: 0,
				modelValue: selectedArrayOptions.value,
				options: arrayOptions.value,
				"onUpdate:modelValue": updateSelectedOptions
			}, {
				default: withCtx(() => [createVNode(unref(ScalarButton), {
					class: "custom-scroll h-full justify-start gap-1.5 px-2 py-1.5 pr-6 font-normal outline-none",
					fullWidth: "",
					variant: "ghost"
				}, {
					default: withCtx(() => [createElementVNode("span", _hoisted_2, toDisplayString(selectedArrayOptions.value.length > 0 ? selectedArrayOptions.value.map((option) => option.label).join(", ") : "Select a value"), 1), createVNode(unref(ScalarIcon), {
						class: "min-w-4",
						icon: "ChevronDown",
						size: "md"
					})]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue", "options"])) : addingCustomValue.value ? withDirectives((openBlock(), createElementBlock("input", {
				key: 1,
				ref_key: "inputRef",
				ref: inputRef,
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => customValue.value = $event),
				class: "text-c-1 w-full min-w-0 border-none px-2 py-1.5 outline-none",
				placeholder: "Value",
				type: "text",
				onBlur: handleBlur,
				onKeyup: withKeys(addCustomValue, ["enter"])
			}, null, 544)), [[vModelText, customValue.value]]) : (openBlock(), createBlock(unref(ScalarDropdown), {
				key: 2,
				resize: "",
				value: initialValue.value
			}, {
				items: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(options.value, (option) => {
					return openBlock(), createBlock(unref(ScalarDropdownItem), {
						key: option,
						class: "group/item flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap",
						value: option,
						onClick: ($event) => updateSelected(option)
					}, {
						default: withCtx(() => [createElementVNode("div", { class: normalizeClass(["flex h-4 w-4 items-center justify-center rounded-full p-[3px]", isSelected(option) ? "bg-c-accent text-b-1" : "shadow-border text-transparent"]) }, [createVNode(unref(ScalarIcon), {
							class: "size-2.5",
							icon: "Checkmark",
							thickness: "3"
						})], 2), createElementVNode("span", _hoisted_4, toDisplayString(option), 1)]),
						_: 2
					}, 1032, ["value", "onClick"]);
				}), 128)), __props.canAddCustomValue ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [options.value.length ? (openBlock(), createBlock(unref(ScalarDropdownDivider), { key: 0 })) : createCommentVNode("", true), createVNode(unref(ScalarDropdownItem), {
					class: "flex items-center gap-1.5",
					onClick: _cache[1] || (_cache[1] = ($event) => addingCustomValue.value = true)
				}, {
					default: withCtx(() => [createElementVNode("div", _hoisted_5, [createVNode(unref(ScalarIcon), {
						icon: "Add",
						size: "sm"
					})]), _cache[2] || (_cache[2] = createElementVNode("span", null, "Add value", -1))]),
					_: 1
				})], 64)) : createCommentVNode("", true)]),
				default: withCtx(() => [createVNode(unref(ScalarButton), {
					class: "size-full justify-start gap-1.5 overflow-auto px-2 py-1.5 font-normal whitespace-nowrap outline-none",
					variant: "ghost"
				}, {
					default: withCtx(() => [createElementVNode("span", _hoisted_3, toDisplayString(initialValue.value ?? "Select a value"), 1), createVNode(unref(ScalarIcon), {
						icon: "ChevronDown",
						size: "md"
					})]),
					_: 1
				})]),
				_: 1
			}, 8, ["value"]))]);
		};
	}
});
//#endregion
export { DataTableInputSelect_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=DataTableInputSelect.vue.script.js.map