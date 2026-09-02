import CommandActionForm_default from "../../../features/command-palette/components/CommandActionForm.vue.js";
import CommandActionInput_default from "../../../features/command-palette/components/CommandActionInput.vue.js";
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, nextTick, openBlock, ref, toDisplayString, unref, watch, withCtx } from "vue";
import { ScalarModal } from "@scalar/components/modal";
//#region src/v2/blocks/scalar-auth-selector-block/components/OAuthScopesAddModal.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex min-h-8 items-start gap-2 text-sm" };
var _hoisted_2 = { class: "flex min-h-8 items-start gap-2 text-sm" };
var _hoisted_3 = {
	key: 0,
	class: "text-red text-xs",
	role: "alert"
};
var OAuthScopesAddModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "OAuthScopesAddModal",
	props: {
		state: {},
		scopes: {},
		scope: { default: null }
	},
	emits: ["cancel", "submit"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const isEditMode = computed(() => __props.scope !== null);
		const title = computed(() => isEditMode.value ? "Edit Scope" : "Add Scope");
		const submitLabel = computed(() => isEditMode.value ? "Save" : "Add Scope");
		const scopeData = ref({
			name: "",
			description: ""
		});
		/**
		* Tracks whether the user has interacted with the name field so we can defer the
		* "name is required" hint until after the first edit, rather than on initial render.
		*/
		const hasTouchedName = ref(false);
		watch(() => scopeData.value.name, () => {
			hasTouchedName.value = true;
		});
		const trimmedName = computed(() => scopeData.value.name.trim());
		/**
		* Whether the chosen name collides with an existing scope on the flow.
		* In edit mode we allow keeping the original name unchanged.
		*/
		const isDuplicateName = computed(() => {
			if (!trimmedName.value) return false;
			if (isEditMode.value && trimmedName.value === __props.scope?.name) return false;
			return __props.scopes.includes(trimmedName.value);
		});
		/** Human readable validation message rendered inline in the modal */
		const validationError = computed(() => {
			if (isDuplicateName.value) return `A scope named "${trimmedName.value}" already exists.`;
			if (hasTouchedName.value && !trimmedName.value) return "Scope name is required.";
			return null;
		});
		const isSubmitDisabled = computed(() => !trimmedName.value || isDuplicateName.value);
		const handleSubmit = () => {
			if (isSubmitDisabled.value) return;
			emit("submit", {
				name: trimmedName.value,
				description: scopeData.value.description,
				...isEditMode.value && __props.scope ? { oldName: __props.scope.name } : {}
			});
			__props.state.hide();
		};
		watch(() => __props.state.open, (isOpen) => {
			if (!isOpen) return;
			scopeData.value = __props.scope ? {
				name: __props.scope.name,
				description: __props.scope.description
			} : {
				name: "",
				description: ""
			};
			nextTick(() => {
				hasTouchedName.value = false;
			});
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarModal), {
				bodyClass: "overflow-y-auto",
				size: "xs",
				state: __props.state,
				title: title.value
			}, {
				default: withCtx(() => [createVNode(unref(CommandActionForm_default), {
					disabled: isSubmitDisabled.value,
					onCancel: _cache[2] || (_cache[2] = ($event) => emit("cancel")),
					onSubmit: handleSubmit
				}, {
					submit: withCtx(() => [createTextVNode(toDisplayString(submitLabel.value), 1)]),
					default: withCtx(() => [
						createElementVNode("div", _hoisted_1, [_cache[3] || (_cache[3] = createTextVNode(" Name: ", -1)), createVNode(unref(CommandActionInput_default), {
							modelValue: scopeData.value.name,
							"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => scopeData.value.name = $event),
							autofocus: "",
							class: "field-sizing-content !p-0",
							placeholder: "read:user"
						}, null, 8, ["modelValue"])]),
						createElementVNode("div", _hoisted_2, [_cache[4] || (_cache[4] = createTextVNode(" Description: ", -1)), createVNode(unref(CommandActionInput_default), {
							modelValue: scopeData.value.description,
							"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => scopeData.value.description = $event),
							autofocus: false,
							class: "field-sizing-content !p-0",
							placeholder: "Read user data"
						}, null, 8, ["modelValue"])]),
						validationError.value ? (openBlock(), createElementBlock("div", _hoisted_3, toDisplayString(validationError.value), 1)) : createCommentVNode("", true)
					]),
					_: 1
				}, 8, ["disabled"])]),
				_: 1
			}, 8, ["state", "title"]);
		};
	}
});
//#endregion
export { OAuthScopesAddModal_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=OAuthScopesAddModal.vue.script.js.map