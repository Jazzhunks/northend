import { computed, createCommentVNode, createElementBlock, createTextVNode, createVNode, defineComponent, openBlock, unref } from "vue";
import { ScalarIconArrowUpRight } from "@scalar/icons";
import { makeUrlAbsolute } from "@scalar/helpers/url/make-url-absolute";
//#region src/v2/blocks/operation-block/components/OpenApiClientButton.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["href"];
var OpenApiClientButton_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "OpenApiClientButton",
	props: {
		buttonSource: {},
		source: { default: "api-reference" },
		isDevelopment: { type: Boolean },
		integration: {},
		url: {},
		operationPath: {},
		operationMethod: {}
	},
	setup(__props) {
		/** Link to import an OpenAPI document */
		const href = computed(() => {
			/**
			* The URL we want to pass to client.scalar.com for the import.
			* Might be an OpenAPI document URL, but could also just be the URL of the API reference.
			*/
			const urlToImportFrom = __props.url ?? (typeof window !== "undefined" ? window.location.href : void 0);
			if (!urlToImportFrom) return;
			const absoluteUrl = makeUrlAbsolute(urlToImportFrom);
			if (!absoluteUrl?.length) return;
			const link = new URL(__props.isDevelopment ? "http://localhost:5065" : "https://client.scalar.com");
			link.searchParams.set("url", absoluteUrl);
			if (__props.operationPath?.length && __props.operationMethod?.length) {
				link.searchParams.set("operation_path", __props.operationPath);
				link.searchParams.set("operation_method", __props.operationMethod.toLowerCase());
			}
			if (__props.integration !== null) link.searchParams.set("integration", __props.integration ?? "vue");
			link.searchParams.set("utm_source", "api-reference");
			link.searchParams.set("utm_medium", "button");
			link.searchParams.set("utm_campaign", __props.buttonSource);
			if (__props.source === "gitbook") {
				link.searchParams.set("utm_source", "gitbook");
				const darkLogo = document.querySelector("img.dark\\:block[alt='Logo']");
				const lightLogo = document.querySelector("img.dark\\:hidden[alt='Logo']");
				if (darkLogo && darkLogo instanceof HTMLImageElement) link.searchParams.set("dark_logo", encodeURIComponent(darkLogo.src));
				if (lightLogo && lightLogo instanceof HTMLImageElement) link.searchParams.set("light_logo", encodeURIComponent(lightLogo.src));
			}
			return link.toString();
		});
		return (_ctx, _cache) => {
			return href.value ? (openBlock(), createElementBlock("a", {
				key: 0,
				class: "open-api-client-button",
				href: href.value,
				target: "_blank"
			}, [createVNode(unref(ScalarIconArrowUpRight), {
				class: "size-3",
				weight: "regular"
			}), _cache[0] || (_cache[0] = createTextVNode(" Open API Client ", -1))], 8, _hoisted_1)) : createCommentVNode("", true);
		};
	}
});
//#endregion
export { OpenApiClientButton_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=OpenApiClientButton.vue.script.js.map