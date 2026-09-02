import { useState } from "../state/state.js";
import Chat_default from "./Chat/Chat.vue.js";
import Start_default from "./Start.vue.js";
import { createBlock, createElementBlock, defineComponent, openBlock, unref } from "vue";
//#region src/views/Layout.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "wrapper" };
var Layout_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Layout",
	emits: ["submit", "uploadApi"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const { chat } = useState();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [unref(chat).messages.length && (unref(chat).messages.length > 1 || unref(chat).status !== "submitted") ? (openBlock(), createBlock(Chat_default, {
				key: 0,
				onSubmit: _cache[0] || (_cache[0] = ($event) => emit("submit")),
				onUploadApi: _cache[1] || (_cache[1] = ($event) => emit("uploadApi"))
			})) : (openBlock(), createBlock(Start_default, {
				key: 1,
				onSubmit: _cache[2] || (_cache[2] = ($event) => emit("submit")),
				onUploadApi: _cache[3] || (_cache[3] = ($event) => emit("uploadApi"))
			}))]);
		};
	}
});
//#endregion
export { Layout_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=Layout.vue.script.js.map