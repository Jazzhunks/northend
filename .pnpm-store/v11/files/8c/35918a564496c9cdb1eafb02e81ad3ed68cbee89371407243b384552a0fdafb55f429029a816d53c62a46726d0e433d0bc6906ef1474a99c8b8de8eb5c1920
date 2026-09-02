import RequestTable_default from "./RequestTable.vue.js";
import CollapsibleSection_default from "../../../components/layout/CollapsibleSection.vue.js";
import { computed, createBlock, createCommentVNode, createElementVNode, createTextVNode, createVNode, defineComponent, openBlock, toDisplayString, unref, withCtx, withModifiers } from "vue";
import { ScalarButton } from "@scalar/components/button";
import { ScalarTooltip } from "@scalar/components/tooltip";
//#region src/v2/blocks/request-block/components/RequestParams.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "text-c-2 request-meta-buttons flex whitespace-nowrap opacity-0 group-hover/params:opacity-100 has-[:focus-visible]:opacity-100" };
var _hoisted_2 = { class: "sr-only" };
var RequestParams_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "RequestParams",
	props: {
		rows: {},
		exampleKey: {},
		title: {},
		label: {},
		invalidParams: {},
		globalRoute: {},
		showAddRowPlaceholder: {
			type: Boolean,
			default: true
		},
		environment: {},
		eventBus: {}
	},
	emits: [
		"upsert",
		"delete",
		"deleteAll"
	],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const showTooltip = computed(() => __props.rows.length > 1);
		/** Needed for type guard */
		const handleUpserRow = (index, payload) => {
			const { value, ...rest } = payload;
			if (value instanceof File) return;
			emit("upsert", index, {
				...rest,
				value: value ?? ""
			});
		};
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(CollapsibleSection_default), {
				class: "group/params",
				itemCount: __props.rows.length
			}, {
				title: withCtx(() => [createTextVNode(toDisplayString(__props.title), 1)]),
				actions: withCtx(() => [createElementVNode("div", _hoisted_1, [showTooltip.value ? (openBlock(), createBlock(unref(ScalarTooltip), {
					key: 0,
					content: "Clear optional parameters",
					placement: "left"
				}, {
					default: withCtx(() => [createVNode(unref(ScalarButton), {
						class: "pr-0.75 pl-1 transition-none",
						size: "sm",
						variant: "ghost",
						onClick: _cache[0] || (_cache[0] = withModifiers(($event) => emit("deleteAll"), ["stop"]))
					}, {
						default: withCtx(() => [_cache[3] || (_cache[3] = createTextVNode(" Clear ", -1)), createElementVNode("span", _hoisted_2, "All " + toDisplayString(__props.title), 1)]),
						_: 1
					})]),
					_: 1
				})) : createCommentVNode("", true)])]),
				default: withCtx(() => [createVNode(RequestTable_default, {
					class: "flex-1",
					columns: [
						"32px",
						"",
						""
					],
					data: __props.rows,
					environment: __props.environment,
					exampleKey: __props.exampleKey,
					globalRoute: __props.globalRoute,
					invalidParams: __props.invalidParams,
					label: __props.label,
					showAddRowPlaceholder: __props.showAddRowPlaceholder,
					onDeleteRow: _cache[1] || (_cache[1] = (index) => emit("delete", { index })),
					onNavigate: _cache[2] || (_cache[2] = (route) => __props.eventBus.emit("ui:navigate", route)),
					onUpsertRow: handleUpserRow
				}, null, 8, [
					"data",
					"environment",
					"exampleKey",
					"globalRoute",
					"invalidParams",
					"label",
					"showAddRowPlaceholder"
				])]),
				_: 1
			}, 8, ["itemCount"]);
		};
	}
});
//#endregion
export { RequestParams_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=RequestParams.vue.script.js.map