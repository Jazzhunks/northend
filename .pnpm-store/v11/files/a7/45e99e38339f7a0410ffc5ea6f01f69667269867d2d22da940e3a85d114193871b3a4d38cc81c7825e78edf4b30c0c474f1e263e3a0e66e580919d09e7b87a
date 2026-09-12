import ScalarLoading_default from "../ScalarLoading/ScalarLoading.vue.js";
import ScalarIconButton_default from "../ScalarIconButton/ScalarIconButton.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, guardReactiveProps, mergeModels, mergeProps, normalizeProps, onMounted, openBlock, ref, unref, useModel, vModelText, withDirectives, withModifiers } from "vue";
import { ScalarIconMagnifyingGlass, ScalarIconX } from "@scalar/icons";
//#region src/components/ScalarSidebar/ScalarSidebarSearchInput.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-label"];
var ScalarSidebarSearchInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarSidebarSearchInput",
	props: /* @__PURE__ */ mergeModels({
		autofocus: { type: Boolean },
		loader: {},
		label: {}
	}, {
		"modelValue": {},
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props) {
		const inputRef = ref(null);
		const model = useModel(__props, "modelValue");
		function handleClear() {
			model.value = "";
			if (inputRef.value) inputRef.value.focus();
		}
		const { stylingAttrsCx, otherAttrs } = useBindCx();
		onMounted(() => __props.autofocus && inputRef.value?.focus());
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("label", normalizeProps(guardReactiveProps(unref(stylingAttrsCx)("flex items-center rounded border text-base has-[:focus-visible]:bg-sidebar-b-1 has-[:focus-visible]:outline h-8 gap-1 pl-2 pr-1.5", "bg-sidebar-b-search border-sidebar-border-search", model.value ? "text-sidebar-c-1" : "text-sidebar-c-search"))), [
				createVNode(unref(ScalarIconMagnifyingGlass), { class: "text-sidebar-c-search size-4" }),
				withDirectives(createElementVNode("input", mergeProps({
					ref_key: "inputRef",
					ref: inputRef,
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
					"aria-label": __props.label ?? "Enter search query",
					autocapitalize: "off",
					autocomplete: "off",
					autocorrect: "off",
					class: "flex-1 appearance-none rounded border-none bg-transparent outline-none",
					placeholder: "Search...",
					spellcheck: "false",
					type: "search"
				}, unref(otherAttrs)), null, 16, _hoisted_1), [[vModelText, model.value]]),
				__props.loader && __props.loader.isActive ? (openBlock(), createBlock(unref(ScalarLoading_default), {
					key: 0,
					class: "mr-3 self-center",
					loader: __props.loader,
					size: "md"
				}, null, 8, ["loader"])) : model.value ? (openBlock(), createBlock(unref(ScalarIconButton_default), {
					key: 1,
					class: "p-px size-4",
					icon: unref(ScalarIconX),
					label: "Clear Search",
					weight: "bold",
					onClick: withModifiers(handleClear, ["stop", "prevent"])
				}, null, 8, ["icon"])) : createCommentVNode("", true)
			], 16);
		};
	}
});
//#endregion
export { ScalarSidebarSearchInput_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarSidebarSearchInput.vue.script.js.map