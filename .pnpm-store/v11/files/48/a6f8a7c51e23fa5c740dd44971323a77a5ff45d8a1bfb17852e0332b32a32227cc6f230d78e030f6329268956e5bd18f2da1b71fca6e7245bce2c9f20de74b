import { createElementBlock, createElementVNode, defineComponent, normalizeClass, openBlock, toDisplayString, useModel } from "vue";
//#region src/v2/components/sidebar/SidebarToggle.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-pressed"];
var _hoisted_2 = { class: "sr-only" };
var _hoisted_3 = {
	class: "size-4",
	fill: "none",
	viewBox: "0 0 24 24",
	xmlns: "http://www.w3.org/2000/svg"
};
var _hoisted_4 = { "clip-path": "url(#mask)" };
var SidebarToggle_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "SidebarToggle",
	props: {
		"modelValue": {
			type: Boolean,
			required: true
		},
		"modelModifiers": {}
	},
	emits: ["update:modelValue"],
	setup(__props) {
		const isSidebarOpen = useModel(__props, "modelValue");
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("button", {
				"aria-pressed": isSidebarOpen.value,
				class: "scalar-sidebar-toggle text-c-3 hover:bg-b-2 active:text-c-1 rounded p-2",
				type: "button",
				onClick: _cache[0] || (_cache[0] = ($event) => isSidebarOpen.value = !isSidebarOpen.value)
			}, [createElementVNode("span", _hoisted_2, toDisplayString(isSidebarOpen.value ? "Hide" : "Show") + " sidebar", 1), (openBlock(), createElementBlock("svg", _hoisted_3, [
				_cache[1] || (_cache[1] = createElementVNode("defs", null, [createElementVNode("clipPath", { id: "mask" }, [createElementVNode("path", {
					"clip-rule": "evenodd",
					d: "M9 3.2H4c-1.7 0-3 1.3-3 3v11.5c0 1.7 1.3 3 3 3h5V3.2z"
				})])], -1)),
				createElementVNode("g", _hoisted_4, [createElementVNode("path", {
					class: normalizeClass(["transition-transform duration-300", isSidebarOpen.value ? "translate-x-0" : "-translate-x-1/2"]),
					d: "M1 3.2h8v17.5H1z",
					fill: "currentColor"
				}, null, 2)]),
				_cache[2] || (_cache[2] = createElementVNode("path", {
					d: "M20 20.8H4c-1.7 0-3-1.3-3-3V6.2c0-1.7 1.3-3 3-3h16c1.7 0 3 1.3 3 3v11.5c0 1.7-1.3 3-3 3zM9 3.2v17.5",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2"
				}, null, -1))
			]))], 8, _hoisted_1);
		};
	}
});
//#endregion
export { SidebarToggle_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=SidebarToggle.vue.script.js.map