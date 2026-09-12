import ServerVariablesSelect_default from "./ServerVariablesSelect.vue.js";
import ServerVariablesTextbox_default from "./ServerVariablesTextbox.vue.js";
import { Fragment, createBlock, createCommentVNode, createElementBlock, createElementVNode, defineComponent, normalizeClass, openBlock, renderList, toDisplayString, unref, useId } from "vue";
//#region src/components/Server/ServerVariablesForm.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["for"];
var ServerVariablesForm_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ServerVariablesForm",
	props: {
		variables: {},
		values: {},
		controls: {},
		layout: { default: "client" }
	},
	emits: ["update:variable"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const id = useId();
		function setVariable(name, value) {
			emit("update:variable", name, value);
		}
		const getVariable = (name) => {
			return (__props.values?.[name] ?? __props.variables?.[name]?.default ?? "").toString();
		};
		return (_ctx, _cache) => {
			return __props.variables && Object.keys(__props.variables ?? {}).length ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(Object.keys(__props.variables), (name) => {
				return openBlock(), createElementBlock("div", {
					key: name,
					class: normalizeClass(["group/label flex h-8 w-full", __props.layout === "reference" && "items-center border-x border-b last:rounded-b-lg"])
				}, [createElementVNode("label", {
					class: "flex items-center py-2 pl-3 group-has-[input]/label:mr-0 after:content-[':']",
					for: `${unref(id)}-${name}`
				}, toDisplayString(name), 9, _hoisted_1), __props.variables?.[name]?.enum?.length ? (openBlock(), createBlock(ServerVariablesSelect_default, {
					key: 0,
					id: `${unref(id)}-${name}`,
					controls: __props.controls,
					enum: __props.variables[name]?.enum?.map((v) => `${v}`) ?? [],
					value: getVariable(name),
					onChange: (s) => setVariable(name, s)
				}, null, 8, [
					"id",
					"controls",
					"enum",
					"value",
					"onChange"
				])) : (openBlock(), createBlock(ServerVariablesTextbox_default, {
					key: 1,
					id: `${unref(id)}-${name}`,
					controls: __props.controls,
					value: getVariable(name),
					onChange: (s) => setVariable(name, s)
				}, null, 8, [
					"id",
					"controls",
					"value",
					"onChange"
				]))], 2);
			}), 128)) : createCommentVNode("", true);
		};
	}
});
//#endregion
export { ServerVariablesForm_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ServerVariablesForm.vue.script.js.map