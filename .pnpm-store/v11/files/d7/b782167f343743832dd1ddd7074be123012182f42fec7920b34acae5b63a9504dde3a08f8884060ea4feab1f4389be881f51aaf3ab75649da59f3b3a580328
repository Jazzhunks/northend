import CommandActionForm_default from "../../command-palette/components/CommandActionForm.vue.js";
import CommandActionInput_default from "../../command-palette/components/CommandActionInput.vue.js";
import EnvironmentColors_default from "./EnvironmentColors.vue.js";
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, openBlock, ref, toDisplayString, unref, watch, withCtx } from "vue";
import { ScalarModal } from "@scalar/components/modal";
//#region src/v2/features/environments/components/EnvironmentCreateModal.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex items-start gap-2" };
var _hoisted_2 = {
	key: 0,
	class: "text-red text-xs"
};
var DEFAULT_COLOR = "#FFFFFF";
var EnvironmentCreateModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "EnvironmentCreateModal",
	props: {
		environments: {},
		selectedEnvironmentName: {},
		state: {},
		eventBus: {},
		collectionType: {}
	},
	setup(__props) {
		/** Default color for new environments. */
		const name = ref("");
		const selectedColor = ref(DEFAULT_COLOR);
		/** Ensure [re]set the form on open */
		watch(() => __props.state.open, (isOpen) => {
			if (isOpen) {
				const environment = __props.environments[__props.selectedEnvironmentName ?? ""];
				if (__props.selectedEnvironmentName && environment) {
					name.value = __props.selectedEnvironmentName;
					selectedColor.value = environment.color;
				} else {
					name.value = "";
					selectedColor.value = DEFAULT_COLOR;
				}
			}
		});
		/**
		* Handle color selection from the color picker.
		* Updates the selected color for the new environment.
		*/
		const handleColorSelect = (color) => {
			selectedColor.value = color;
		};
		/** Emits an event to create the environment with the provided name and color. */
		const handleSubmit = () => {
			if (__props.selectedEnvironmentName) __props.eventBus.emit("environment:upsert:environment", {
				oldEnvironmentName: __props.selectedEnvironmentName,
				payload: { color: selectedColor.value },
				environmentName: name.value.trim(),
				collectionType: __props.collectionType
			});
			else __props.eventBus.emit("environment:upsert:environment", {
				environmentName: name.value.trim(),
				payload: { color: selectedColor.value },
				collectionType: __props.collectionType
			});
			__props.state.hide();
		};
		/** Check if the environment name is a duplicate */
		const isDuplicateName = computed(() => {
			if (__props.selectedEnvironmentName) return name.value !== __props.selectedEnvironmentName && Object.keys(__props.environments).includes(name.value);
			return Object.keys(__props.environments).includes(name.value);
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarModal), {
				bodyClass: "border-t-0 rounded-t-lg",
				size: "xs",
				state: __props.state
			}, {
				default: withCtx(() => [createVNode(unref(CommandActionForm_default), {
					disabled: !name.value.trim() || isDuplicateName.value,
					onSubmit: handleSubmit
				}, {
					submit: withCtx(() => [createTextVNode(toDisplayString(__props.selectedEnvironmentName ? "Update" : "Add") + " Environment ", 1)]),
					default: withCtx(() => [createElementVNode("div", _hoisted_1, [createVNode(EnvironmentColors_default, {
						activeColor: selectedColor.value,
						class: "peer",
						onSelect: handleColorSelect
					}, null, 8, ["activeColor"]), createVNode(unref(CommandActionInput_default), {
						modelValue: name.value,
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => name.value = $event),
						class: "-mt-[.5px] !p-0 peer-has-[.color-selector]:hidden",
						placeholder: "Environment name"
					}, null, 8, ["modelValue"])]), isDuplicateName.value ? (openBlock(), createElementBlock("div", _hoisted_2, " This environment name is already in use. ")) : createCommentVNode("", true)]),
					_: 1
				}, 8, ["disabled"])]),
				_: 1
			}, 8, ["state"]);
		};
	}
});
//#endregion
export { EnvironmentCreateModal_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=EnvironmentCreateModal.vue.script.js.map