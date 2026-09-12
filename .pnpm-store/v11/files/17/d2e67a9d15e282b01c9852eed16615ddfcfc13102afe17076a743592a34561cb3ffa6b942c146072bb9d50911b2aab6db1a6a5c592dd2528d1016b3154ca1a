import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, normalizeClass, openBlock, renderList, toDisplayString, unref, withCtx } from "vue";
import { ScalarButton } from "@scalar/components/button";
import { ScalarIcon } from "@scalar/components/icon";
import { ScalarDropdown, ScalarDropdownDivider, ScalarDropdownItem } from "@scalar/components/dropdown";
//#region src/v2/blocks/scalar-address-bar-block/components/EnvironmentSelector.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "relative flex items-center" };
var _hoisted_2 = { class: "flex max-w-[220px] min-w-0 items-center gap-1.5" };
var _hoisted_3 = { class: "text-xxs block max-w-[160px] min-w-0 truncate text-left font-medium" };
var _hoisted_4 = { class: "min-w-0 flex-1 truncate" };
var _hoisted_5 = { class: "bg-c-accent text-b-1 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full p-[3px]" };
var _hoisted_6 = { class: "min-w-0 flex-1 text-left" };
var _hoisted_7 = { class: "block truncate" };
var _hoisted_8 = { class: "flex h-4 w-4 items-center justify-center" };
var _hoisted_9 = {
	key: 5,
	class: "text-c-3 px-2 py-1.5 text-xs"
};
var EnvironmentSelector_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "EnvironmentSelector",
	props: {
		environments: { default: () => [] },
		activeEnvironment: {}
	},
	emits: ["select:environment", "add:environment"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		/** Whether an environment is currently active */
		const hasActiveEnvironment = computed(() => !!__props.activeEnvironment);
		/** Whether environments exist */
		const hasEnvironments = computed(() => __props.environments.length > 0);
		/** Whether the currently selected environment exists in the dropdown options */
		const hasSelectedEnvironmentInOptions = computed(() => {
			if (!__props.activeEnvironment) return false;
			return __props.environments.includes(__props.activeEnvironment);
		});
		/** True when an environment is selected but unavailable in the current context */
		const hasMissingActiveEnvironment = computed(() => hasActiveEnvironment.value && !hasSelectedEnvironmentInOptions.value);
		/** Display text for the button */
		const displayText = computed(() => {
			if (hasMissingActiveEnvironment.value) return `${__props.activeEnvironment} (Unavailable)`;
			if (hasActiveEnvironment.value) return __props.activeEnvironment;
			if (!hasEnvironments.value) return "Add Environment";
			return "Select Environment";
		});
		/** Button styling based on state */
		const buttonClass = computed(() => {
			if (hasMissingActiveEnvironment.value) return "hover:bg-b-2 text-c-2 border-transparent";
			if (hasActiveEnvironment.value) return "bg-c-accent/10 text-c-accent hover:bg-c-accent/20 border-c-accent/30";
			if (!hasEnvironments.value) return "hover:bg-b-2 text-c-3 border-transparent";
			return "hover:bg-b-2 text-c-2 border-transparent";
		});
		const handleAddEnvironment = () => {
			emit("add:environment");
		};
		const handleSelectEnvironment = (environmentName) => {
			emit("select:environment", environmentName);
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createVNode(unref(ScalarDropdown), null, {
				items: withCtx(() => [
					hasActiveEnvironment.value ? (openBlock(), createBlock(unref(ScalarDropdownItem), {
						key: 0,
						class: "group/item flex w-full items-center gap-1.5",
						onClick: _cache[0] || (_cache[0] = ($event) => handleSelectEnvironment(""))
					}, {
						default: withCtx(() => [createElementVNode("div", { class: normalizeClass(["flex h-4 w-4 items-center justify-center rounded-full p-[3px]", !__props.activeEnvironment ? "bg-c-accent text-b-1" : "shadow-border text-transparent"]) }, [createVNode(unref(ScalarIcon), {
							class: "size-2.5",
							icon: "Checkmark",
							thickness: "3"
						})], 2), _cache[1] || (_cache[1] = createElementVNode("span", { class: "text-c-2" }, "No Environment", -1))]),
						_: 1
					})) : createCommentVNode("", true),
					hasActiveEnvironment.value && hasEnvironments.value ? (openBlock(), createBlock(unref(ScalarDropdownDivider), { key: 1 })) : createCommentVNode("", true),
					(openBlock(true), createElementBlock(Fragment, null, renderList(__props.environments, (environmentName) => {
						return openBlock(), createBlock(unref(ScalarDropdownItem), {
							key: environmentName,
							class: "group/item flex w-full min-w-0 items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap",
							onClick: ($event) => handleSelectEnvironment(environmentName)
						}, {
							default: withCtx(() => [createElementVNode("div", { class: normalizeClass(["flex h-4 w-4 items-center justify-center rounded-full p-[3px]", __props.activeEnvironment === environmentName ? "bg-c-accent text-b-1" : "shadow-border text-transparent"]) }, [createVNode(unref(ScalarIcon), {
								class: "size-2.5",
								icon: "Checkmark",
								thickness: "3"
							})], 2), createElementVNode("span", _hoisted_4, toDisplayString(environmentName), 1)]),
							_: 2
						}, 1032, ["onClick"]);
					}), 128)),
					hasMissingActiveEnvironment.value ? (openBlock(), createBlock(unref(ScalarDropdownDivider), { key: 2 })) : createCommentVNode("", true),
					hasMissingActiveEnvironment.value ? (openBlock(), createBlock(unref(ScalarDropdownItem), {
						key: 3,
						class: "group/item flex h-auto w-full min-w-0 items-start gap-1.5 overflow-hidden",
						disabled: ""
					}, {
						default: withCtx(() => [createElementVNode("div", _hoisted_5, [createVNode(unref(ScalarIcon), {
							class: "size-2.5",
							icon: "Checkmark",
							thickness: "3"
						})]), createElementVNode("div", _hoisted_6, [createElementVNode("span", _hoisted_7, toDisplayString(__props.activeEnvironment), 1), _cache[2] || (_cache[2] = createElementVNode("span", { class: "text-c-3 block truncate text-xs" }, " Not available in this context ", -1))])]),
						_: 1
					})) : createCommentVNode("", true),
					hasEnvironments.value ? (openBlock(), createBlock(unref(ScalarDropdownDivider), { key: 4 })) : createCommentVNode("", true),
					createVNode(unref(ScalarDropdownItem), {
						class: "text-c-accent flex items-center gap-1.5",
						onClick: handleAddEnvironment
					}, {
						default: withCtx(() => [createElementVNode("div", _hoisted_8, [createVNode(unref(ScalarIcon), {
							icon: "Add",
							size: "sm"
						})]), createElementVNode("span", null, toDisplayString(hasEnvironments.value ? "New Environment" : "Create Environment"), 1)]),
						_: 1
					}),
					!hasEnvironments.value && !hasActiveEnvironment.value ? (openBlock(), createElementBlock("div", _hoisted_9, [..._cache[3] || (_cache[3] = [createElementVNode("p", { class: "mb-1" }, " Environments let you manage variables like API keys and base URLs across different contexts. ", -1)])])) : createCommentVNode("", true)
				]),
				default: withCtx(() => [createVNode(unref(ScalarButton), {
					"aria-label": `Current environment: ${displayText.value}`,
					class: normalizeClass(["line-clamp-1 h-full w-fit justify-start border px-2 py-1 font-normal transition-colors", buttonClass.value]),
					size: "sm",
					variant: "ghost"
				}, {
					default: withCtx(() => [createElementVNode("div", _hoisted_2, [
						createVNode(unref(ScalarIcon), {
							class: normalizeClass(["shrink-0", hasActiveEnvironment.value && !hasMissingActiveEnvironment.value ? "text-c-accent" : "text-c-3"]),
							icon: "Globe",
							size: "sm"
						}, null, 8, ["class"]),
						createElementVNode("span", _hoisted_3, toDisplayString(displayText.value), 1),
						createVNode(unref(ScalarIcon), {
							class: "shrink-0",
							icon: "ChevronDown",
							size: "xs"
						})
					])]),
					_: 1
				}, 8, ["aria-label", "class"])]),
				_: 1
			})]);
		};
	}
});
//#endregion
export { EnvironmentSelector_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=EnvironmentSelector.vue.script.js.map