import ScalarMenuProduct_default from "./ScalarMenuProduct.vue.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createCommentVNode, createElementBlock, createTextVNode, createVNode, defineComponent, guardReactiveProps, normalizeProps, openBlock, unref, withCtx } from "vue";
import { ScalarIconArrowUpRight, ScalarIconBook, ScalarIconHouse, ScalarIconNotepad } from "@scalar/icons";
var ScalarMenuProducts_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarMenuProducts",
	props: {
		selected: {},
		showDocs: { type: Boolean },
		hrefs: {}
	},
	emits: ["open"],
	setup(__props) {
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", normalizeProps(guardReactiveProps(unref(cx)("flex flex-col"))), [
				createVNode(ScalarMenuProduct_default, {
					href: __props.hrefs?.dashboard ?? "https://dashboard.scalar.com",
					icon: unref(ScalarIconHouse),
					selected: __props.selected === "dashboard",
					onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("open", $event, "dashboard"))
				}, {
					default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode(" Dashboard ", -1)])]),
					_: 1
				}, 8, [
					"href",
					"icon",
					"selected"
				]),
				__props.showDocs || __props.selected === "docs" ? (openBlock(), createBlock(ScalarMenuProduct_default, {
					key: 0,
					href: __props.hrefs?.docs ?? "https://docs.scalar.com",
					icon: unref(ScalarIconBook),
					selected: __props.selected === "docs",
					onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("open", $event, "docs"))
				}, {
					default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode(" Docs ", -1)])]),
					_: 1
				}, 8, [
					"href",
					"icon",
					"selected"
				])) : createCommentVNode("", true),
				createVNode(ScalarMenuProduct_default, {
					href: __props.hrefs?.editor ?? "https://editor.scalar.com",
					icon: unref(ScalarIconNotepad),
					selected: __props.selected === "editor",
					onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("open", $event, "editor"))
				}, {
					default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode(" Editor ", -1)])]),
					_: 1
				}, 8, [
					"href",
					"icon",
					"selected"
				]),
				createVNode(ScalarMenuProduct_default, {
					href: __props.hrefs?.client ?? "https://client.scalar.com",
					icon: unref(ScalarIconArrowUpRight),
					selected: __props.selected === "client",
					onClick: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("open", $event, "client"))
				}, {
					default: withCtx(() => [..._cache[7] || (_cache[7] = [createTextVNode(" Client ", -1)])]),
					_: 1
				}, 8, [
					"href",
					"icon",
					"selected"
				])
			], 16);
		};
	}
});
//#endregion
export { ScalarMenuProducts_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarMenuProducts.vue.script.js.map