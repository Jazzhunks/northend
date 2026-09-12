import ResponseBodyInfo_default from "./ResponseBodyInfo.vue.js";
import ResponseBodyRaw_default from "./ResponseBodyRaw.vue.js";
import { computed, createBlock, createElementBlock, createElementVNode, createTextVNode, defineComponent, normalizeClass, openBlock, ref, watch, withCtx } from "vue";
//#region src/v2/blocks/response-block/components/ResponseBodyPreview.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["src"];
var _hoisted_2 = ["src", "type"];
var _hoisted_3 = ["src", "type"];
var _hoisted_4 = ["src", "sandbox"];
var ResponseBodyPreview_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ResponseBodyPreview",
	props: {
		src: {},
		type: {},
		mode: {},
		alpha: {
			type: Boolean,
			default: false
		},
		content: {}
	},
	setup(__props) {
		const jsonPreviewContent = computed(() => {
			const value = __props.content;
			if (typeof value === "string") return value;
			if (value == null) return "";
			return String(value);
		});
		/**
		* Validates the `src` against an allow-list of safe protocols before it is
		* passed to a rendering element. This blocks XSS vectors such as
		* `javascript:` and `vbscript:` URIs and also prevents accidentally embedding
		* a `data:text/html` payload that could execute script in the app origin.
		*
		* Allowed:
		*   - `blob:` (the standard case — generated client-side by `URL.createObjectURL`)
		*   - `http:` / `https:`
		*   - `data:` URIs whose MIME type is a known safe media kind
		*     (`image/*`, `video/*`, `audio/*`, `application/pdf`, `application/octet-stream`)
		*
		* Anything else (including malformed or relative URLs) collapses to an empty
		* string so the template falls back to the "Preview unavailable" message.
		*/
		const safeSrc = computed(() => {
			if (!__props.src) return "";
			if (/^data:/i.test(__props.src)) return /^data:(?:(?:image|video|audio)\/[a-z0-9.+-]+|application\/pdf|application\/octet-stream)[;,]/i.test(__props.src) ? __props.src : "";
			try {
				const parsed = new URL(__props.src);
				if (parsed.protocol === "blob:" || parsed.protocol === "http:" || parsed.protocol === "https:") return __props.src;
			} catch {}
			return "";
		});
		const error = ref(false);
		/**
		* Whether the embedded document is a PDF.
		*
		* PDFs are rendered by the browser's own PDF engine (e.g. PDFium), which runs
		* in an isolated context that cannot reach this app's origin — its DOM,
		* cookies or storage. A PDF's embedded JavaScript therefore cannot be used to
		* attack us, and a strict `sandbox=""` does not confine that engine; it only
		* prevents Chromium from loading the PDF viewer at all (it boots as a scripted
		* extension page), leaving the user with a blank frame. So PDFs are rendered
		* without the `sandbox` attribute, matching the original `<object>` behaviour.
		*
		* Everything else that reaches the iframe (notably `text/html`, the genuine
		* XSS vector) keeps the strict empty sandbox.
		*/
		const isPdf = computed(() => __props.type.trim().toLowerCase() === "application/pdf");
		watch(() => __props.src, () => error.value = false);
		return (_ctx, _cache) => {
			return __props.mode === "json" ? (openBlock(), createBlock(ResponseBodyRaw_default, {
				key: 0,
				content: jsonPreviewContent.value,
				language: "json",
				prettyPrintJson: ""
			}, null, 8, ["content"])) : !error.value && safeSrc.value ? (openBlock(), createElementBlock("div", {
				key: 1,
				class: normalizeClass(["flex justify-center overflow-auto rounded-b", { "bg-preview p-2": __props.alpha }])
			}, [__props.mode === "image" ? (openBlock(), createElementBlock("img", {
				key: 0,
				class: normalizeClass(["h-full max-w-full", { rounded: __props.alpha }]),
				src: safeSrc.value,
				referrerpolicy: "no-referrer",
				onError: _cache[0] || (_cache[0] = ($event) => error.value = true)
			}, null, 42, _hoisted_1)) : __props.mode === "video" ? (openBlock(), createElementBlock("video", {
				key: 1,
				autoplay: "",
				controls: "",
				referrerpolicy: "no-referrer",
				width: "100%",
				onError: _cache[1] || (_cache[1] = ($event) => error.value = true)
			}, [createElementVNode("source", {
				src: safeSrc.value,
				type: __props.type
			}, null, 8, _hoisted_2)], 32)) : __props.mode === "audio" ? (openBlock(), createElementBlock("audio", {
				key: 2,
				class: "my-12",
				controls: "",
				referrerpolicy: "no-referrer",
				onError: _cache[2] || (_cache[2] = ($event) => error.value = true)
			}, [createElementVNode("source", {
				src: safeSrc.value,
				type: __props.type
			}, null, 8, _hoisted_3)], 32)) : (openBlock(), createElementBlock("iframe", {
				key: 3,
				class: "aspect-[4/3] w-full border-0",
				src: safeSrc.value,
				sandbox: isPdf.value ? void 0 : "",
				referrerpolicy: "no-referrer"
			}, null, 8, _hoisted_4))], 2)) : (openBlock(), createBlock(ResponseBodyInfo_default, { key: 2 }, {
				default: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode("Preview unavailable", -1)])]),
				_: 1
			}));
		};
	}
});
//#endregion
export { ResponseBodyPreview_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ResponseBodyPreview.vue.script.js.map