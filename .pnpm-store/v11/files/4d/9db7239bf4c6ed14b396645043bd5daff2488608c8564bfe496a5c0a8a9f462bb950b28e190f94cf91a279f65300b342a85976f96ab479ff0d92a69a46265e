import ResponseBodyInfo_default from "./ResponseBodyInfo.vue.js";
import { createBlock, createElementBlock, createElementVNode, createTextVNode, defineComponent, normalizeClass, openBlock, ref, watch, withCtx } from "vue";
//#region src/components/ResponseBody/ResponseBodyPreview.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["src"];
var _hoisted_2 = ["src", "type"];
var _hoisted_3 = ["src", "type"];
var _hoisted_4 = ["data", "type"];
var ResponseBodyPreview_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ResponseBodyPreview",
	props: {
		src: {},
		type: {},
		mode: {},
		alpha: {
			type: Boolean,
			default: false
		}
	},
	setup(__props) {
		const error = ref(false);
		watch(() => __props.src, () => {
			error.value = false;
		});
		return (_ctx, _cache) => {
			return !error.value && __props.src ? (openBlock(), createElementBlock("div", {
				key: 0,
				class: normalizeClass(["flex justify-center overflow-auto rounded-b", { "bg-preview p-2": __props.alpha }])
			}, [__props.mode === "image" ? (openBlock(), createElementBlock("img", {
				key: 0,
				class: normalizeClass(["h-full max-w-full", { rounded: __props.alpha }]),
				src: __props.src,
				onError: _cache[0] || (_cache[0] = ($event) => error.value = true)
			}, null, 42, _hoisted_1)) : __props.mode === "video" ? (openBlock(), createElementBlock("video", {
				key: 1,
				autoplay: "",
				controls: "",
				width: "100%",
				onError: _cache[1] || (_cache[1] = ($event) => error.value = true)
			}, [createElementVNode("source", {
				src: __props.src,
				type: __props.type
			}, null, 8, _hoisted_2)], 32)) : __props.mode === "audio" ? (openBlock(), createElementBlock("audio", {
				key: 2,
				class: "my-12",
				controls: "",
				onError: _cache[2] || (_cache[2] = ($event) => error.value = true)
			}, [createElementVNode("source", {
				src: __props.src,
				type: __props.type
			}, null, 8, _hoisted_3)], 32)) : (openBlock(), createElementBlock("object", {
				key: 3,
				class: "aspect-[4/3] w-full",
				data: __props.src,
				type: __props.type,
				onError: _cache[3] || (_cache[3] = ($event) => error.value = true)
			}, null, 40, _hoisted_4))], 2)) : (openBlock(), createBlock(ResponseBodyInfo_default, { key: 1 }, {
				default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("Preview unavailable", -1)])]),
				_: 1
			}));
		};
	}
});
//#endregion
export { ResponseBodyPreview_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ResponseBodyPreview.vue.script.js.map