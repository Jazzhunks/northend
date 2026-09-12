import HttpMethod_default from "../../../../components/HttpMethod/HttpMethod.vue.js";
import ValueEmitter_default from "../../../components/layout/ValueEmitter.vue.js";
import { getStatusCodeColor } from "./httpStatusCodeColors.js";
import { Fragment, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createVNode, defineComponent, normalizeClass, normalizeStyle, openBlock, renderList, toDisplayString, unref, withCtx } from "vue";
import { ScalarIcon } from "@scalar/components/icon";
import { httpStatusCodes } from "@scalar/helpers/http/http-status-codes";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ScalarFloating, ScalarFloatingBackdrop } from "@scalar/components/floating";
import { formatMilliseconds } from "@scalar/helpers/formatters/format-milliseconds";
//#region src/v2/blocks/scalar-address-bar-block/components/AddressBarHistory.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "min-w-0" };
var _hoisted_2 = { class: "text-c-1 min-w-0 truncate" };
var AddressBarHistory_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "AddressBarHistory",
	props: {
		target: {},
		history: {}
	},
	emits: ["select:history:item", "update:open"],
	setup(__props, { emit: __emit }) {
		const emits = __emit;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Menu), { as: "div" }, {
				default: withCtx(({ open }) => [createVNode(ValueEmitter_default, {
					value: open,
					onChange: _cache[0] || (_cache[0] = (value) => emits("update:open", value)),
					onUnmount: _cache[1] || (_cache[1] = ($event) => emits("update:open", false))
				}, null, 8, ["value"]), createVNode(unref(ScalarFloating), {
					offset: 0,
					resize: "",
					target: __props.target
				}, createSlots({
					default: withCtx(() => [__props.history.length ? (openBlock(), createBlock(unref(MenuButton), {
						key: 0,
						class: "address-bar-history-button text-c-3 focus:text-c-1 relative mr-1 rounded-lg p-1.5"
					}, {
						default: withCtx(() => [createVNode(unref(ScalarIcon), {
							icon: "History",
							size: "sm",
							thickness: "2.25"
						}), _cache[2] || (_cache[2] = createElementVNode("span", { class: "sr-only" }, "Request History", -1))]),
						_: 1
					})) : createCommentVNode("", true)]),
					_: 2
				}, [open ? {
					name: "floating",
					fn: withCtx(({ width }) => [createVNode(unref(MenuItems), {
						class: "custom-scroll grid max-h-[inherit] grid-cols-[44px_1fr_repeat(3,auto)] items-center p-0.75",
						static: "",
						style: normalizeStyle({ width })
					}, {
						default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.history, (entry, index) => {
							return openBlock(), createBlock(unref(MenuItem), {
								key: index,
								as: "button",
								class: "font-code ui-active:*:bg-b-2 text-c-2 contents text-sm font-medium *:flex *:h-8 *:cursor-pointer *:items-center *:rounded-none *:px-1.5 *:first:rounded-l *:last:rounded-r",
								value: index,
								onClick: ($event) => emits("select:history:item", { index })
							}, {
								default: withCtx(() => [
									createVNode(unref(HttpMethod_default), {
										class: "text-[11px]",
										method: entry.method
									}, null, 8, ["method"]),
									createElementVNode("div", _hoisted_1, [createElementVNode("div", _hoisted_2, toDisplayString(entry.path), 1)]),
									createElementVNode("div", null, toDisplayString(unref(formatMilliseconds)(entry.duration)), 1),
									createElementVNode("div", { class: normalizeClass([unref(getStatusCodeColor)(entry.status).color]) }, toDisplayString(entry.status), 3),
									createElementVNode("div", null, toDisplayString(unref(httpStatusCodes)[entry.status]?.name), 1)
								]),
								_: 2
							}, 1032, ["value", "onClick"]);
						}), 128))]),
						_: 1
					}, 8, ["style"]), createVNode(unref(ScalarFloatingBackdrop), { class: "inset-x-px rounded-none rounded-b-lg" })]),
					key: "0"
				} : void 0]), 1032, ["target"])]),
				_: 1
			});
		};
	}
});
//#endregion
export { AddressBarHistory_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=AddressBarHistory.vue.script.js.map