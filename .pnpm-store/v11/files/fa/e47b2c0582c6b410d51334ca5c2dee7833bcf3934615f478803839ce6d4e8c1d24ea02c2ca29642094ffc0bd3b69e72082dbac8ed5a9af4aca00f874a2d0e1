import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { Fragment, computed, createCommentVNode, createElementBlock, createElementVNode, defineComponent, guardReactiveProps, normalizeClass, normalizeProps, openBlock, renderList, unref } from "vue";
var ScalarSidebarIndent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarSidebarIndent",
	props: {
		indent: { default: 0 },
		selected: {
			type: Boolean,
			default: false
		},
		disabled: { type: Boolean }
	},
	setup(__props) {
		const indents = computed(() => {
			return Array.from({ length: __props.indent }, (_, i) => i);
		});
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", normalizeProps(guardReactiveProps(unref(cx)("scalar-sidebar-indent flex justify-center", {
				"mr-[calc(20px-var(--scalar-sidebar-indent))]": __props.indent > 0,
				"scalar-sidebar-indent-selected": __props.selected
			}))), [(openBlock(true), createElementBlock(Fragment, null, renderList(indents.value, (block, index) => {
				return openBlock(), createElementBlock("div", {
					key: block,
					class: "relative w-[var(--scalar-sidebar-indent)]"
				}, [_cache[0] || (_cache[0] = createElementVNode("div", { class: "scalar-sidebar-indent-border absolute left-2 inset-y-0 w-border bg-sidebar-indent-border" }, null, -1)), index === indents.value.length - 1 ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: normalizeClass(["absolute left-2 inset-y-0 w-border", __props.disabled ? "" : __props.selected ? "bg-sidebar-indent-border-active" : "group-hover/button:bg-sidebar-indent-border-hover"])
				}, null, 2)) : createCommentVNode("", true)]);
			}), 128))], 16);
		};
	}
});
//#endregion
export { ScalarSidebarIndent_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarSidebarIndent.vue.script.js.map