import ValueEmitter_default from "../layout/ValueEmitter.vue.js";
import ServerDropdownItem_default from "./ServerDropdownItem.vue.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, openBlock, renderList, toDisplayString, unref, withCtx } from "vue";
import { ScalarButton } from "@scalar/components/button";
import { ScalarIconPencilSimple, ScalarIconPlus } from "@scalar/icons";
import { ScalarPopover } from "@scalar/components/popover";
import { ScalarFloatingBackdrop } from "@scalar/components/floating";
//#region src/v2/components/server/ServerDropdown.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["onClick"];
var _hoisted_2 = { class: "flex items-center justify-center" };
var ServerDropdown_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	name: "ServerDropdown",
	props: {
		meta: {},
		servers: {},
		server: {},
		target: {},
		layout: {}
	},
	emits: [
		"update:selectedServer",
		"update:variable",
		"update:servers",
		"update:open"
	],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const requestServerOptions = computed(() => __props.servers.map((s) => ({
			id: s.url,
			label: s.url ?? "Unknown server"
		})));
		const serverUrlWithoutTrailingSlash = computed(() => {
			if (__props.server?.url?.endsWith("/")) return __props.server.url.slice(0, -1);
			return __props.server?.url || "";
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarPopover), {
				class: "max-h-[inherit] p-0 text-base",
				focus: "",
				offset: 0,
				placement: "bottom",
				resize: "",
				target: __props.target,
				teleport: `#${__props.target}`
			}, {
				popover: withCtx(({ close }) => [createElementVNode("div", {
					class: "custom-scroll flex max-h-[inherit] flex-col gap-1 p-1",
					onClick: close
				}, [(openBlock(true), createElementBlock(Fragment, null, renderList(requestServerOptions.value, (serverOption, index) => {
					return openBlock(), createBlock(ServerDropdownItem_default, {
						key: serverOption.id,
						server: __props.server,
						serverOption,
						type: "request",
						"onUpdate:selectedServer": ($event) => emit("update:selectedServer", {
							url: serverOption.id,
							meta: __props.meta
						}),
						"onUpdate:variable": (key, value) => emit("update:variable", {
							index,
							key,
							value,
							meta: __props.meta
						})
					}, null, 8, [
						"server",
						"serverOption",
						"onUpdate:selectedServer",
						"onUpdate:variable"
					]);
				}), 128)), __props.layout !== "modal" ? (openBlock(), createElementBlock("button", {
					key: 0,
					class: "text-xxs hover:bg-b-2 flex cursor-pointer items-center gap-1.5 rounded p-1.75",
					type: "button",
					onClick: _cache[0] || (_cache[0] = ($event) => emit("update:servers"))
				}, [createElementVNode("div", _hoisted_2, [createVNode(unref(ScalarIconPencilSimple), { class: "size-4" })]), _cache[5] || (_cache[5] = createElementVNode("span", null, "Update Servers", -1))])) : createCommentVNode("", true)], 8, _hoisted_1)]),
				backdrop: withCtx(({ open }) => [createVNode(ValueEmitter_default, {
					value: open,
					onChange: _cache[1] || (_cache[1] = (value) => emit("update:open", value)),
					onUnmount: _cache[2] || (_cache[2] = ($event) => emit("update:open", false))
				}, null, 8, ["value"]), createVNode(unref(ScalarFloatingBackdrop), { class: "inset-x-px rounded-none rounded-b-lg" })]),
				default: withCtx(() => [createVNode(unref(ScalarButton), {
					class: "hover:bg-b-2 font-code text-c-2 h-auto gap-0.75 rounded border px-1.5 text-base whitespace-nowrap @3xl:ml-0.75",
					variant: "ghost"
				}, {
					default: withCtx(() => [__props.server ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [_cache[3] || (_cache[3] = createElementVNode("span", { class: "sr-only" }, "Server:", -1)), createTextVNode(" " + toDisplayString(serverUrlWithoutTrailingSlash.value), 1)], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [_cache[4] || (_cache[4] = createElementVNode("span", { class: "sr-only" }, "Add Server", -1)), createVNode(unref(ScalarIconPlus), { class: "size-3" })], 64))]),
					_: 1
				})]),
				_: 1
			}, 8, ["target", "teleport"]);
		};
	}
});
//#endregion
export { ServerDropdown_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ServerDropdown.vue.script.js.map