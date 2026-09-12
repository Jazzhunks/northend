import { filterByOptionLabel } from "./filter-by-option-label.js";
import ScalarListboxCheckbox_default from "../ScalarListbox/ScalarListboxCheckbox.vue.js";
import ScalarComboboxOption_default from "./ScalarComboboxOption.vue.js";
import ScalarComboboxOptionGroup_default from "./ScalarComboboxOptionGroup.vue.js";
import { isGroups } from "./types.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeModels, onMounted, openBlock, ref, renderList, renderSlot, toDisplayString, unref, useId, useModel, useSlots, vModelText, vShow, watch, withCtx, withDirectives, withKeys, withModifiers } from "vue";
import { ScalarIconMagnifyingGlass, ScalarIconPlus } from "@scalar/icons";
//#region src/components/ScalarCombobox/ScalarComboboxOptions.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "relative flex" };
var _hoisted_2 = ["aria-activedescendant", "placeholder"];
var _hoisted_3 = ["aria-multiselectable"];
var _hoisted_4 = { class: "inline-block min-w-0 flex-1 truncate text-c-1" };
var ScalarComboboxOptions_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarComboboxOptions",
	props: /* @__PURE__ */ mergeModels({
		options: {},
		placeholder: {},
		filterFn: {
			type: Function,
			default: filterByOptionLabel
		},
		multiselect: { type: Boolean }
	}, {
		"modelValue": { default: [] },
		"modelModifiers": {}
	}),
	emits: /* @__PURE__ */ mergeModels(["add"], ["update:modelValue"]),
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const model = useModel(__props, "modelValue");
		const slots = useSlots();
		/** A unique ID for the combobox */
		const id = `scalar-combobox-items-${useId()}`;
		/** A static option entry for the "Add a new option" option */
		const addOption = {
			id: `${useId()}-add`,
			label: "Add a new option"
		};
		/** Generate a unique ID for an option */
		function getOptionId(option) {
			return `${id}-${option.id}`;
		}
		/** A flat list of all options */
		const options = computed(() => isGroups(__props.options) ? __props.options.flatMap((group) => group.options) : __props.options);
		/** An list of all groups */
		const groups = computed(() => isGroups(__props.options) ? __props.options : [{
			label: "",
			options: __props.options
		}]);
		const query = ref("");
		const activeRef = ref(model.value?.[0] ?? options.value[0]);
		onMounted(() => {
			query.value = "";
			activeRef.value = model.value?.[0] ?? options.value[0];
			if (model.value[0]) setTimeout(() => {
				const value = model.value[0];
				if (!value) return;
				document?.getElementById(getOptionId(value))?.scrollIntoView({ block: "nearest" });
			}, 10);
		});
		watch(() => query.value, () => activeRef.value = withAdd.value[0]);
		/** The filtered list of options */
		const filtered = computed(() => __props.filterFn(query.value, options.value, groups.value));
		/** The list of filtered options with the "Add a new option" option */
		const withAdd = computed(() => slots.add ? [...filtered.value, addOption] : filtered.value);
		function toggleSelected(option) {
			if (!option) return;
			if (option.id === addOption.id) {
				addNew();
				return;
			}
			if (__props.multiselect) if (model.value.some((o) => o.id === option.id)) model.value = model.value.filter((o) => o.id !== option.id);
			else model.value = [...model.value, options.value.find((o) => o.id === option.id)];
			else model.value = [options.value.find((o) => o.id === option.id)];
		}
		function moveActive(dir) {
			const list = withAdd.value;
			const nextIdx = list.findIndex((option) => option.id === activeRef.value?.id) + dir;
			if (nextIdx < 0 || nextIdx > list.length - 1) return;
			activeRef.value = list[nextIdx];
			if (!activeRef.value) return;
			document?.getElementById(getOptionId(activeRef.value))?.scrollIntoView({
				behavior: "smooth",
				block: "nearest"
			});
		}
		function addNew() {
			emit("add");
			query.value = "";
		}
		const input = ref(null);
		onMounted(() => setTimeout(() => input.value?.focus(), 0));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createElementVNode("div", _hoisted_1, [createVNode(unref(ScalarIconMagnifyingGlass), { class: "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-c-3 size-4" }), withDirectives(createElementVNode("input", {
				ref_key: "input",
				ref: input,
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => query.value = $event),
				"aria-activedescendant": activeRef.value ? getOptionId(activeRef.value) : void 0,
				"aria-autocomplete": "list",
				"aria-controls": id,
				class: "min-w-0 flex-1 rounded border-0 py-2.5 pl-8 pr-3 leading-none text-c-1 -outline-offset-1",
				"data-1p-ignore": "",
				placeholder: __props.placeholder,
				role: "combobox",
				tabindex: "0",
				type: "text",
				onKeydown: [
					_cache[1] || (_cache[1] = withKeys(withModifiers(($event) => moveActive(1), ["prevent"]), ["down"])),
					_cache[2] || (_cache[2] = withKeys(withModifiers(($event) => activeRef.value && toggleSelected(activeRef.value), ["prevent"]), ["enter"])),
					_cache[3] || (_cache[3] = withKeys(withModifiers(($event) => moveActive(-1), ["prevent"]), ["up"]))
				]
			}, null, 40, _hoisted_2), [[vModelText, query.value]])]), withDirectives(createElementVNode("ul", {
				id,
				"aria-multiselectable": __props.multiselect,
				class: "border-t p-0.75 custom-scroll overscroll-contain flex-1 min-h-0",
				role: "listbox",
				tabindex: "-1"
			}, [(openBlock(true), createElementBlock(Fragment, null, renderList(groups.value, (group, i) => {
				return openBlock(), createBlock(ScalarComboboxOptionGroup_default, {
					id: `${id}-group-${i}`,
					key: i,
					hidden: !group.options.some((o) => filtered.value.some((f) => f.id === o.id)) || !group.label
				}, {
					label: withCtx(() => [_ctx.$slots.group ? renderSlot(_ctx.$slots, "group", {
						key: 0,
						group
					}) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createTextVNode(toDisplayString(group.label), 1)], 64))]),
					default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(filtered.value, (option) => {
						return openBlock(), createElementBlock(Fragment, { key: option.id }, [group.options.some((o) => o.id === option.id) ? (openBlock(), createBlock(ScalarComboboxOption_default, {
							key: 0,
							id: getOptionId(option),
							active: activeRef.value?.id === option.id,
							selected: model.value.some((o) => o.id === option.id),
							onClick: ($event) => toggleSelected(option),
							onMousedown: _cache[4] || (_cache[4] = withModifiers(() => {}, ["prevent"])),
							onMouseenter: ($event) => activeRef.value = option
						}, {
							default: withCtx(({ active, selected }) => [_ctx.$slots.option ? renderSlot(_ctx.$slots, "option", {
								key: 0,
								active,
								option,
								selected
							}) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createVNode(unref(ScalarListboxCheckbox_default), {
								multiselect: __props.multiselect,
								selected: model.value.some((o) => o.id === option.id)
							}, null, 8, ["multiselect", "selected"]), createElementVNode("span", _hoisted_4, toDisplayString(option.label), 1)], 64))]),
							_: 2
						}, 1032, [
							"id",
							"active",
							"selected",
							"onClick",
							"onMouseenter"
						])) : createCommentVNode("", true)], 64);
					}), 128))]),
					_: 2
				}, 1032, ["id", "hidden"]);
			}), 128)), slots.add ? (openBlock(), createBlock(ScalarComboboxOption_default, {
				key: 0,
				id: getOptionId(addOption),
				active: activeRef.value?.id === addOption.id,
				onClick: addNew,
				onMousedown: _cache[5] || (_cache[5] = withModifiers(() => {}, ["prevent"])),
				onMouseenter: _cache[6] || (_cache[6] = ($event) => activeRef.value = addOption)
			}, {
				default: withCtx(({ active }) => [createVNode(unref(ScalarIconPlus), { class: "size-4 p-px" }), renderSlot(_ctx.$slots, "add", { active })]),
				_: 3
			}, 8, ["id", "active"])) : createCommentVNode("", true)], 8, _hoisted_3), [[vShow, filtered.value.length || slots.add]])], 64);
		};
	}
});
//#endregion
export { ScalarComboboxOptions_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarComboboxOptions.vue.script.js.map