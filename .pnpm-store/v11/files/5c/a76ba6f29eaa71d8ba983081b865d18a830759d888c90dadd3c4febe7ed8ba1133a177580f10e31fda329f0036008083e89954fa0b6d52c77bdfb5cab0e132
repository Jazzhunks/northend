import DataTableCell_default from "../../../components/data-table/DataTableCell.vue.js";
import DataTableCheckbox_default from "../../../components/data-table/DataTableCheckbox.vue.js";
import DataTableRow_default from "../../../components/data-table/DataTableRow.vue.js";
import OAuthScopesAddModal_default from "./OAuthScopesAddModal.vue.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, nextTick, normalizeClass, openBlock, ref, renderList, toDisplayString, unref, watch, withCtx, withModifiers } from "vue";
import { ScalarButton } from "@scalar/components/button";
import { ScalarIconPencilSimple, ScalarIconTrash } from "@scalar/icons";
import { useModal } from "@scalar/components/modal";
import { ScalarIcon } from "@scalar/components/icon";
import { ScalarIconButton } from "@scalar/components/icon-button";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ScalarSearchInput } from "@scalar/components/search-input";
//#region src/v2/blocks/scalar-auth-selector-block/components/OAuthScopesInput.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex h-fit w-full" };
var _hoisted_2 = { class: "group/scopes-accordion flex h-auto min-h-8 items-center gap-1.5 pr-2.25 pl-3 text-left" };
var _hoisted_3 = { class: "flex shrink-0 items-center gap-1.75" };
var _hoisted_4 = {
	class: "grid max-h-40 auto-rows-auto overflow-x-hidden overflow-y-auto",
	style: { gridTemplateColumns: "1fr auto" }
};
var _hoisted_5 = { class: "no-scrollbar text-c-2 group-hover/scope-row:text-c-1 flex min-h-8 min-w-0 flex-1 items-center gap-1 overflow-x-auto px-3 py-1.5 pr-20 text-xs text-nowrap" };
var _hoisted_6 = { class: "font-code shrink-0 text-xs" };
var _hoisted_7 = { class: "whitespace-nowrap" };
var OAuthScopesInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "OAuthScopesInput",
	props: {
		flowType: {},
		flow: {},
		selectedScopes: {}
	},
	emits: [
		"update:selectedScopes",
		"upsert:scope",
		"delete:scope"
	],
	setup(__props, { emit: __emit }) {
		const emits = __emit;
		const searchQuery = ref("");
		/**
		* The scope currently being edited, used to switch the shared modal into edit mode.
		* Null means the modal is in "add" mode.
		*/
		const editingScope = ref(null);
		/** List of all available scopes */
		const scopes = computed(() => Object.entries(__props.flow?.scopes ?? {}).map(([key, val]) => ({
			id: key,
			label: key,
			description: val
		})));
		const scopeCount = computed(() => Object.keys(__props.flow?.scopes ?? {}).length);
		/** Search is only useful once the list is long enough to scan */
		const showScopeSearch = computed(() => scopeCount.value >= 10);
		const filteredScopes = computed(() => {
			const query = showScopeSearch.value ? searchQuery.value : "";
			if (!query) return scopes.value;
			const regex = new RegExp(query.split("").map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*"), "i");
			return scopes.value.filter(({ label, description }) => regex.test(`${label} ${description}`));
		});
		const hasScopes = computed(() => Object.keys(__props.flow?.scopes ?? {}).length > 0);
		const allScopesSelected = computed(() => __props.selectedScopes.length === Object.keys(__props.flow?.scopes ?? {}).length);
		const setScope = (scopeKey, checked) => {
			if (checked) return emits("update:selectedScopes", { scopes: Array.from(new Set([...__props.selectedScopes, scopeKey])) });
			emits("update:selectedScopes", { scopes: __props.selectedScopes.filter((scope) => scope !== scopeKey) });
		};
		/** Select all scopes */
		const selectAllScopes = () => emits("update:selectedScopes", { scopes: Object.keys(__props.flow?.scopes ?? {}) });
		/** Deselect all scopes */
		const deselectAllScopes = () => emits("update:selectedScopes", { scopes: [] });
		const scopeFormModal = useModal();
		/**
		* Forces the Disclosure to remount with `defaultOpen` set so the panel auto-expands
		* the moment a brand-new scope is added. Bumping this counter is paired with toggling
		* `expandOnNextMount` so the remount opens the panel, then reverts to the default
		* closed-on-mount behavior for any future unrelated remounts (e.g. collapse on empty).
		*
		* The Disclosure `:key` is only this counter — not a separate `hasScopes` segment — so
		* adding the first scope does not remount twice (empty prefix → with-scopes prefix),
		* which would reopen with `defaultOpen=false` and collapse the panel right when rows appear.
		*/
		const remountKey = ref(0);
		const expandOnNextMount = ref(false);
		watch(hasScopes, (has, had) => {
			if (had && !has) {
				expandOnNextMount.value = false;
				remountKey.value += 1;
			}
		});
		/** Open the modal in "add new scope" mode */
		const openAddScopeModal = () => {
			editingScope.value = null;
			scopeFormModal.show();
		};
		/** Open the modal in "edit scope" mode prefilled with the chosen row */
		const openEditScopeModal = (scope) => {
			editingScope.value = {
				name: scope.id,
				description: scope.description ?? ""
			};
			scopeFormModal.show();
		};
		/**
		* Submit handler shared by Add Scope and Edit Scope. For renames, the `upsertScope` mutator on
		* the workspace store rewrites the selection state in place, so the component does not need to
		* emit a follow-up `update:selectedScopes`.
		*
		* When adding a brand-new scope (no `oldName`), the payload sets `enable: true` so the
		* `upsertScope` mutator also adds the new scope to any selection requirement that references
		* this scheme. The Disclosure is then remounted with `defaultOpen=true` so the user
		* immediately sees (and sees selected) the scope they just added.
		*/
		const handleScopeFormSubmit = async (payload) => {
			const isAdd = !payload.oldName;
			emits("upsert:scope", {
				scope: payload.name,
				description: payload.description,
				flowType: __props.flowType,
				...payload.oldName ? { oldScope: payload.oldName } : {},
				...isAdd ? { enable: true } : {}
			});
			if (!isAdd) return;
			expandOnNextMount.value = true;
			remountKey.value += 1;
			await nextTick();
			expandOnNextMount.value = false;
		};
		/**
		* Remove the scope from the flow. Selection cleanup (dropping the deleted key from any
		* currently-selected scopes) is handled by the `deleteScope` mutator on the workspace store,
		* so the component does not need to emit a follow-up `update:selectedScopes` here.
		*/
		const handleDeleteScope = (scopeKey) => {
			emits("delete:scope", {
				scope: scopeKey,
				flowType: __props.flowType
			});
		};
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(DataTableCell_default), { class: "h-auto !max-h-[initial] min-h-8 items-center" }, {
				default: withCtx(() => [createElementVNode("div", _hoisted_1, [_cache[6] || (_cache[6] = createElementVNode("div", { class: "text-c-1 h-full items-center" }, null, -1)), (openBlock(), createBlock(unref(Disclosure), {
					key: remountKey.value,
					as: "div",
					class: "bl flex w-full flex-col",
					defaultOpen: expandOnNextMount.value
				}, {
					default: withCtx(() => [createElementVNode("div", _hoisted_2, [createVNode(unref(DisclosureButton), {
						class: normalizeClass([
							"min-w-0 flex-1 text-left",
							hasScopes.value ? "hover:text-c-1 cursor-pointer" : "cursor-default",
							(__props.selectedScopes.length || 0) > 0 ? "text-c-1" : "text-c-3"
						]),
						disabled: !hasScopes.value
					}, {
						default: withCtx(() => [hasScopes.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createTextVNode(" Scopes Selected " + toDisplayString(__props.selectedScopes.length || 0) + " / " + toDisplayString(Object.keys(__props.flow?.scopes ?? {}).length || 0), 1)], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createTextVNode(" No Scopes Defined ")], 64))]),
						_: 1
					}, 8, ["class", "disabled"]), createElementVNode("div", _hoisted_3, [
						createVNode(unref(ScalarButton), {
							class: "pr-0.75 pl-1 transition-none",
							size: "sm",
							variant: "ghost",
							onClick: withModifiers(openAddScopeModal, ["stop"])
						}, {
							default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode(" Add Scope ", -1)])]),
							_: 1
						}),
						hasScopes.value && allScopesSelected.value ? (openBlock(), createBlock(unref(ScalarButton), {
							key: 0,
							class: "pr-0.75 pl-1 transition-none",
							size: "sm",
							variant: "ghost",
							onClick: withModifiers(deselectAllScopes, ["stop"])
						}, {
							default: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode(" Deselect All ", -1)])]),
							_: 1
						})) : createCommentVNode("", true),
						hasScopes.value && !allScopesSelected.value ? (openBlock(), createBlock(unref(ScalarButton), {
							key: 1,
							class: "pr-0.75 pl-1 transition-none",
							size: "sm",
							variant: "ghost",
							onClick: withModifiers(selectAllScopes, ["stop"])
						}, {
							default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode(" Select All ", -1)])]),
							_: 1
						})) : createCommentVNode("", true),
						hasScopes.value ? (openBlock(), createBlock(unref(DisclosureButton), {
							key: 2,
							class: "text-c-3 hover:text-c-2 -m-0.5 flex shrink-0 items-center justify-center rounded p-0.5 focus-visible:outline-offset-2"
						}, {
							default: withCtx(({ open }) => [createVNode(unref(ScalarIcon), {
								class: "group-hover/scopes-accordion:text-c-2",
								icon: open ? "ChevronDown" : "ChevronRight",
								size: "md"
							}, null, 8, ["icon"])]),
							_: 1
						})) : createCommentVNode("", true)
					])]), createVNode(unref(DisclosurePanel), { as: "template" }, {
						default: withCtx(() => [createElementVNode("div", null, [showScopeSearch.value ? (openBlock(), createBlock(unref(ScalarSearchInput), {
							key: 0,
							modelValue: searchQuery.value,
							"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchQuery.value = $event),
							class: "flex items-center text-xs"
						}, null, 8, ["modelValue"])) : createCommentVNode("", true), createElementVNode("table", _hoisted_4, [(openBlock(true), createElementBlock(Fragment, null, renderList(filteredScopes.value, ({ id, label, description }) => {
							return openBlock(), createBlock(unref(DataTableRow_default), {
								key: id,
								class: "text-c-2 group/scope-row",
								onClick: ($event) => setScope(id, !__props.selectedScopes.includes(id))
							}, {
								default: withCtx(() => [createVNode(unref(DataTableCell_default), { class: "box-border flex !max-h-[initial] w-full min-w-0 cursor-pointer items-stretch overflow-hidden px-0 py-0" }, {
									default: withCtx(() => [createElementVNode("div", _hoisted_5, [createElementVNode("span", _hoisted_6, toDisplayString(label), 1), String(description ?? "").trim() ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [_cache[5] || (_cache[5] = createElementVNode("span", { class: "shrink-0" }, "–", -1)), createElementVNode("span", _hoisted_7, toDisplayString(description), 1)], 64)) : createCommentVNode("", true)]), createElementVNode("div", {
										class: "oauth-scope-row-action-rail absolute top-0 right-0 z-[1] flex h-full min-w-[4.5rem] items-center justify-end gap-0.5 py-1 pr-2 pl-4 opacity-0 transition-opacity group-focus-within/scope-row:opacity-100 group-hover/scope-row:opacity-100",
										onClick: _cache[1] || (_cache[1] = withModifiers(() => {}, ["stop"]))
									}, [createVNode(unref(ScalarIconButton), {
										icon: unref(ScalarIconPencilSimple),
										label: `Edit ${label}`,
										size: "sm",
										onClick: withModifiers(($event) => openEditScopeModal({
											id,
											description: description ?? ""
										}), ["stop"])
									}, null, 8, [
										"icon",
										"label",
										"onClick"
									]), createVNode(unref(ScalarIconButton), {
										icon: unref(ScalarIconTrash),
										label: `Delete ${label}`,
										size: "sm",
										onClick: withModifiers(($event) => handleDeleteScope(id), ["stop"])
									}, null, 8, [
										"icon",
										"label",
										"onClick"
									])])]),
									_: 2
								}, 1024), createVNode(unref(DataTableCheckbox_default), {
									modelValue: __props.selectedScopes.includes(id),
									"onUpdate:modelValue": ($event) => setScope(id, $event)
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 2
							}, 1032, ["onClick"]);
						}), 128))])])]),
						_: 1
					})]),
					_: 1
				}, 8, ["defaultOpen"]))]), createVNode(OAuthScopesAddModal_default, {
					scope: editingScope.value,
					scopes: Object.keys(__props.flow.scopes ?? {}),
					state: unref(scopeFormModal),
					onSubmit: handleScopeFormSubmit
				}, null, 8, [
					"scope",
					"scopes",
					"state"
				])]),
				_: 1
			});
		};
	}
});
//#endregion
export { OAuthScopesInput_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=OAuthScopesInput.vue.script.js.map