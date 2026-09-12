import ServerVariablesForm_default from "../../../components/Server/ServerVariablesForm.vue.js";
import { computed, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, mergeProps, normalizeClass, openBlock, toDisplayString, unref, useId, withModifiers } from "vue";
import { ScalarListboxCheckbox } from "@scalar/components/listbox";
import { ScalarMarkdown } from "@scalar/components/markdown";
//#region src/v2/components/server/ServerDropdownItem.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-expanded"];
var _hoisted_2 = { class: "overflow-hidden text-ellipsis whitespace-nowrap" };
var _hoisted_3 = ["id"];
var _hoisted_4 = { key: 0 };
var _hoisted_5 = { class: "description text-c-3 px-3 py-1.5" };
var ServerDropdownItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ServerDropdownItem",
	props: {
		server: {},
		serverOption: {}
	},
	emits: ["update:variable", "update:selectedServer"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const formId = useId();
		const hasVariables = () => {
			return Object.keys(__props.server?.variables ?? {}).length > 0;
		};
		const isSelectedServer = computed(() => __props.serverOption.id === __props.server?.url);
		const isExpanded = computed(() => isSelectedServer.value && hasVariables());
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", { class: normalizeClass(["group/item flex min-h-fit flex-col rounded border", { "border-transparent": !isSelectedServer.value }]) }, [createElementVNode("button", mergeProps(isExpanded.value ? { "aria-controls": unref(formId) } : {}, {
				"aria-expanded": isExpanded.value,
				class: ["flex min-h-8 cursor-pointer items-center gap-1.5 rounded px-1.5", isSelectedServer.value ? "text-c-1 bg-b-2" : "hover:bg-b-2"],
				type: "button",
				onClick: _cache[0] || (_cache[0] = ($event) => emit("update:selectedServer"))
			}), [createVNode(unref(ScalarListboxCheckbox), { selected: isSelectedServer.value }, null, 8, ["selected"]), createElementVNode("span", _hoisted_2, toDisplayString(__props.serverOption.label), 1)], 16, _hoisted_1), isExpanded.value ? (openBlock(), createElementBlock("div", {
				key: 0,
				id: unref(formId),
				class: "bg-b-2 divide divide-y rounded-b border-t *:pl-4",
				onClick: _cache[2] || (_cache[2] = withModifiers(() => {}, ["stop"]))
			}, [createVNode(ServerVariablesForm_default, {
				variables: __props.server?.variables,
				"onUpdate:variable": _cache[1] || (_cache[1] = (key, value) => emit("update:variable", key, value))
			}, null, 8, ["variables"]), __props.server?.description ? (openBlock(), createElementBlock("div", _hoisted_4, [createElementVNode("div", _hoisted_5, [createVNode(unref(ScalarMarkdown), { value: __props.server.description }, null, 8, ["value"])])])) : createCommentVNode("", true)], 8, _hoisted_3)) : createCommentVNode("", true)], 2);
		};
	}
});
//#endregion
export { ServerDropdownItem_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ServerDropdownItem.vue.script.js.map