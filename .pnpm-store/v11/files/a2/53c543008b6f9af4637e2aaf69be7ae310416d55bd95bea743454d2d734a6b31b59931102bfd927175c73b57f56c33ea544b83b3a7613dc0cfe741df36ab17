import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, nextTick, normalizeStyle, openBlock, ref, renderList, unref, vModelText, withDirectives } from "vue";
import { ScalarIcon } from "@scalar/components/icon";
//#region src/v2/features/environments/components/EnvironmentColors.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 1,
	class: "color-selector flex h-4 flex-row items-center justify-between gap-1.5 space-x-1"
};
var _hoisted_2 = ["onClick"];
var _hoisted_3 = {
	key: 2,
	class: "color-selector flex h-4 flex-1 items-center gap-2 rounded"
};
var _hoisted_4 = ["placeholder"];
var DEFAULT_GRADIENT = "linear-gradient(to right, rgb(235, 87, 87), rgb(242, 201, 76), rgb(76, 183, 130), rgb(78, 167, 252), rgb(250, 96, 122))";
/** Check if the active color is one of the preset options. */
var EnvironmentColors_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "EnvironmentColors",
	props: { activeColor: {} },
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const customColor = ref("");
		const customColorInputRef = ref(null);
		const showCustomInput = ref(false);
		const showSelector = ref(false);
		/**
		* Predefined color options available in the color picker.
		* Each option provides a standard color choice for the environment.
		*/
		const colorOptions = [
			"#FFFFFF",
			"#EF0006",
			"#EDBE20",
			"#069061",
			"#FB892C",
			"#0082D0",
			"#5203D1",
			"#FFC0CB"
		];
		/** Default gradient shown when no custom color is selected. */
		const isPresetColor = computed(() => colorOptions.includes(__props.activeColor));
		/** Check if a custom color is being used (not in the preset list). */
		const isCustomColor = computed(() => __props.activeColor && !isPresetColor.value && !showCustomInput.value);
		/** Check if the given color matches the currently active color. */
		const isActiveColor = (color) => __props.activeColor === color;
		/**
		* Style for the custom color button.
		* Shows the actual color if custom, otherwise shows a gradient.
		*/
		const customButtonStyle = computed(() => {
			const displayColor = customColor.value || __props.activeColor;
			return isCustomColor.value || customColor.value ? `background-color: ${displayColor};` : `background: ${DEFAULT_GRADIENT};`;
		});
		/**
		* Toggle the custom color input visibility.
		* Focuses the input after it becomes visible.
		*/
		const toggleCustomInput = async () => {
			showCustomInput.value = !showCustomInput.value;
			showSelector.value = false;
			if (!showCustomInput.value) return;
			await nextTick();
			customColorInputRef.value?.focus();
		};
		/** Toggle the color selector visibility. */
		const toggleSelector = () => {
			showSelector.value = !showSelector.value;
		};
		/**
		* Select a color and emit the selection event.
		* Ensures the color value has a # prefix for hex colors.
		*/
		const selectColor = (color) => {
			emit("select", color && !color.startsWith("#") ? `#${color}` : color);
			showSelector.value = false;
		};
		/**
		* Handle custom color input changes.
		* Formats the color and emits the selection.
		*/
		const handleCustomColorInput = () => {
			if (!customColor.value) return;
			const formattedColor = customColor.value.startsWith("#") ? customColor.value : `#${customColor.value}`;
			customColor.value = formattedColor;
			selectColor(formattedColor);
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", null, [
				!showCustomInput.value && !showSelector.value ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: "flex h-4 w-4 cursor-pointer items-center justify-center rounded-full",
					style: normalizeStyle({ backgroundColor: __props.activeColor }),
					onClick: toggleSelector
				}, [__props.activeColor ? (openBlock(), createBlock(unref(ScalarIcon), {
					key: 0,
					class: "text-c-btn p-0.5",
					icon: "Checkmark",
					size: "xs"
				})) : createCommentVNode("", true)], 4)) : createCommentVNode("", true),
				!showCustomInput.value && showSelector.value ? (openBlock(), createElementBlock("div", _hoisted_1, [
					(openBlock(), createElementBlock(Fragment, null, renderList(colorOptions, (option) => {
						return createElementVNode("div", {
							key: option,
							class: "flex h-4 w-4 cursor-pointer items-center justify-center rounded-full",
							style: normalizeStyle({ backgroundColor: option }),
							onClick: ($event) => selectColor(option)
						}, [isActiveColor(option) ? (openBlock(), createBlock(unref(ScalarIcon), {
							key: 0,
							class: "text-c-btn p-0.5",
							icon: "Checkmark",
							size: "xs"
						})) : createCommentVNode("", true)], 12, _hoisted_2);
					}), 64)),
					_cache[1] || (_cache[1] = createElementVNode("hr", { class: "border-ghost h-5 w-0.5 border-l" }, null, -1)),
					createElementVNode("button", {
						class: "z-10 flex h-4 w-4 cursor-pointer flex-row items-center justify-center gap-2 rounded-full",
						style: normalizeStyle(customButtonStyle.value),
						type: "button",
						onClick: toggleCustomInput
					}, [isCustomColor.value ? (openBlock(), createBlock(unref(ScalarIcon), {
						key: 0,
						class: "text-c-btn",
						icon: "Checkmark",
						size: "xs"
					})) : createCommentVNode("", true)], 4)
				])) : createCommentVNode("", true),
				showCustomInput.value ? (openBlock(), createElementBlock("div", _hoisted_3, [
					_cache[2] || (_cache[2] = createElementVNode("span", { class: "absolute h-4 w-4 rounded-full border border-dashed" }, null, -1)),
					createElementVNode("span", {
						class: "z-[1] h-4 w-4 rounded-full",
						style: normalizeStyle(customButtonStyle.value)
					}, null, 4),
					withDirectives(createElementVNode("input", {
						ref_key: "customColorInputRef",
						ref: customColorInputRef,
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => customColor.value = $event),
						class: "w-full flex-1 border-transparent text-sm outline-none",
						placeholder: __props.activeColor || "#000000",
						type: "text",
						onInput: handleCustomColorInput
					}, null, 40, _hoisted_4), [[vModelText, customColor.value]]),
					createElementVNode("button", {
						class: "text-c-3 hover:bg-b-2 rounded-lg p-1.5",
						type: "button",
						onClick: toggleCustomInput
					}, [createVNode(unref(ScalarIcon), {
						icon: "Checkmark",
						size: "xs"
					})])
				])) : createCommentVNode("", true)
			]);
		};
	}
});
//#endregion
export { EnvironmentColors_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=EnvironmentColors.vue.script.js.map