import EnvironmentCreateModal_default from "./components/EnvironmentCreateModal.vue.js";
import EnvironmentDeleteModal_default from "./components/EnvironmentDeleteModal.vue.js";
import Environment_default from "./components/Environment.vue.js";
import { Fragment, createBlock, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, openBlock, ref, renderList, unref, withCtx } from "vue";
import { ScalarButton } from "@scalar/components/button";
import { ScalarIconPlus } from "@scalar/icons";
import { useModal } from "@scalar/components/modal";
//#region src/v2/features/environments/EnvironmentsList.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "text-c-3 flex h-full items-center justify-center rounded-lg border p-4" };
var EnvironmentsList_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "EnvironmentsList",
	props: {
		environments: {},
		eventBus: {},
		activeEnvironment: {},
		collectionType: {}
	},
	setup(__props) {
		const createEnvironmentModalState = useModal();
		const deleteEnvironmentModalState = useModal();
		/** Track the currently selected environment for editing or deleting */
		const selectedEnvironmentName = ref(null);
		/** Opens the delete modal */
		const openDeleteModal = (name) => {
			selectedEnvironmentName.value = name;
			deleteEnvironmentModalState.show();
		};
		/** Deletes the selected environment */
		const deleteEnvironment = () => {
			if (!selectedEnvironmentName.value) return;
			__props.eventBus.emit("environment:delete:environment", {
				environmentName: selectedEnvironmentName.value,
				collectionType: __props.collectionType
			});
		};
		/** Opens the upsert modal, leave name empty for add */
		const openUpsertModal = (name) => {
			selectedEnvironmentName.value = name ?? null;
			createEnvironmentModalState.show();
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [
				(openBlock(true), createElementBlock(Fragment, null, renderList(Object.entries(__props.environments), ([environmentName, environment]) => {
					return openBlock(), createBlock(Environment_default, {
						key: environmentName,
						collectionType: __props.collectionType,
						environment,
						environmentName,
						eventBus: __props.eventBus,
						isActive: __props.activeEnvironment === environmentName,
						onDelete: () => openDeleteModal(environmentName),
						onEdit: () => openUpsertModal(environmentName)
					}, null, 8, [
						"collectionType",
						"environment",
						"environmentName",
						"eventBus",
						"isActive",
						"onDelete",
						"onEdit"
					]);
				}), 128)),
				createElementVNode("div", _hoisted_1, [createVNode(unref(ScalarButton), {
					class: "hover:bg-b-2 hover:text-c-1 flex items-center gap-2",
					size: "xs",
					variant: "ghost",
					onClick: _cache[0] || (_cache[0] = () => openUpsertModal())
				}, {
					default: withCtx(() => [createVNode(unref(ScalarIconPlus)), _cache[1] || (_cache[1] = createTextVNode(" Add Environment ", -1))]),
					_: 1
				})]),
				createVNode(EnvironmentCreateModal_default, {
					collectionType: __props.collectionType,
					environments: __props.environments,
					eventBus: __props.eventBus,
					selectedEnvironmentName: selectedEnvironmentName.value,
					state: unref(createEnvironmentModalState)
				}, null, 8, [
					"collectionType",
					"environments",
					"eventBus",
					"selectedEnvironmentName",
					"state"
				]),
				createVNode(EnvironmentDeleteModal_default, {
					name: selectedEnvironmentName.value,
					state: unref(deleteEnvironmentModalState),
					onSubmit: deleteEnvironment
				}, null, 8, ["name", "state"])
			], 64);
		};
	}
});
//#endregion
export { EnvironmentsList_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=EnvironmentsList.vue.script.js.map