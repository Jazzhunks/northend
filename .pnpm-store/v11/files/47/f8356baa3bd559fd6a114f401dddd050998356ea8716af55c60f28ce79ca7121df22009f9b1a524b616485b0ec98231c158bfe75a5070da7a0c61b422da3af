import EnvironmentVariablesTable_default from "./EnvironmentVariablesTable.vue.js";
import { createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, normalizeClass, normalizeStyle, openBlock, toDisplayString, unref } from "vue";
import { ScalarIconNotePencil, ScalarIconTrash } from "@scalar/icons";
import { ScalarIconButton } from "@scalar/components/icon-button";
//#region src/v2/features/environments/components/Environment.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex items-center gap-1.5" };
var _hoisted_2 = { class: "flex h-6 w-6 items-center justify-center p-1" };
var _hoisted_3 = { class: "px-1 py-0.5 text-sm font-medium" };
var _hoisted_4 = {
	key: 0,
	class: "bg-c-accent text-b-1 flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
	title: "This is the active environment"
};
var _hoisted_5 = { class: "hidden flex-row items-center gap-1 group-hover:flex" };
var Environment_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Environment",
	props: {
		environment: {},
		environmentName: {},
		eventBus: {},
		isActive: {
			type: Boolean,
			default: false
		},
		collectionType: {}
	},
	emits: ["edit", "delete"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", { class: normalizeClass(["group relative rounded-lg border transition-colors", __props.isActive ? "border-c-accent bg-c-accent/5" : ""]) }, [createElementVNode("div", { class: normalizeClass(["flex justify-between rounded-t-lg px-1 py-1 text-sm", __props.isActive ? "bg-c-accent/10" : "bg-b-2"]) }, [createElementVNode("div", _hoisted_1, [
				createElementVNode("div", _hoisted_2, [createElementVNode("span", {
					class: "h-2.5 w-2.5 rounded-full",
					style: normalizeStyle({ backgroundColor: __props.environment.color })
				}, null, 4)]),
				createElementVNode("span", _hoisted_3, toDisplayString(__props.environmentName), 1),
				__props.isActive ? (openBlock(), createElementBlock("span", _hoisted_4, [..._cache[2] || (_cache[2] = [createElementVNode("span", { class: "size-1.5 rounded-full bg-current" }, null, -1), createTextVNode(" Active ", -1)])])) : createCommentVNode("", true)
			]), createElementVNode("div", _hoisted_5, [createVNode(unref(ScalarIconButton), {
				icon: unref(ScalarIconNotePencil),
				label: "Edit Environment",
				size: "sm",
				onClick: _cache[0] || (_cache[0] = ($event) => emit("edit"))
			}, null, 8, ["icon"]), createVNode(unref(ScalarIconButton), {
				icon: unref(ScalarIconTrash),
				label: "Delete Environment",
				size: "sm",
				onClick: _cache[1] || (_cache[1] = ($event) => emit("delete"))
			}, null, 8, ["icon"])])], 2), createVNode(EnvironmentVariablesTable_default, {
				collectionType: __props.collectionType,
				environment: __props.environment,
				environmentName: __props.environmentName,
				eventBus: __props.eventBus
			}, null, 8, [
				"collectionType",
				"environment",
				"environmentName",
				"eventBus"
			])], 2);
		};
	}
});
//#endregion
export { Environment_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=Environment.vue.script.js.map