import { computed, createElementBlock, defineComponent, mergeProps, nextTick, onMounted, openBlock, ref, vModelText, withDirectives, withKeys } from "vue";
//#region src/v2/features/command-palette/components/CommandActionInput.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["placeholder"];
var CommandActionInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	name: "CommandActionInput",
	inheritAttrs: false,
	props: {
		modelValue: {},
		placeholder: {},
		autofocus: {
			type: Boolean,
			default: true
		}
	},
	emits: ["update:modelValue", "delete"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const input = ref(null);
		/**
		* Two-way binding computed property for v-model support.
		* Ensures we always have a string value even if modelValue is undefined.
		*/
		const model = computed({
			get: () => __props.modelValue ?? "",
			set: (value) => emit("update:modelValue", value)
		});
		/**
		* Auto-focus the input after mounting if autofocus prop is true.
		* Uses nextTick to ensure the DOM is ready before focusing.
		*/
		onMounted(() => {
			nextTick(() => {
				if (__props.autofocus) input.value?.focus();
			});
		});
		/**
		* Handles Enter key to submit the parent form.
		* Shift+Enter is ignored to allow multi-line input if needed.
		*/
		const handleEnter = (event) => {
			if (event.shiftKey || !event.target) return;
			event.preventDefault();
			const target = event.target;
			const submitEvent = new Event("submit", { cancelable: true });
			target.form?.dispatchEvent(submitEvent);
		};
		/**
		* Handles Backspace key when input is empty.
		* Emits delete event to allow parent to navigate back or undo the last action.
		*/
		const handleDelete = (event) => {
			if (model.value !== "") return;
			event.preventDefault();
			event.stopPropagation();
			emit("delete", event);
		};
		return (_ctx, _cache) => {
			return withDirectives((openBlock(), createElementBlock("textarea", mergeProps({
				id: "command-action-input",
				ref_key: "input",
				ref: input,
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
				class: "min-h-8 w-full flex-1 resize-none border border-transparent py-1.5 pl-8.5 text-sm outline-none focus:border-b-1",
				placeholder: __props.placeholder ?? "",
				wrap: "hard"
			}, _ctx.$attrs, { onKeydown: [withKeys(handleDelete, ["delete"]), withKeys(handleEnter, ["enter"])] }), null, 16, _hoisted_1)), [[vModelText, model.value]]);
		};
	}
});
//#endregion
export { CommandActionInput_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=CommandActionInput.vue.script.js.map