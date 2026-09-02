(function() {	try {		if (typeof document != "undefined") {			var elementStyle = document.createElement("style");			elementStyle.appendChild(document.createTextNode("/**\n* We need to be explicit to avoid !important. :)\n*\n* Original: https://github.com/xiaoluoboding/vue-sonner/blob/311ecc8d9a51b619f968e20f4b44992ad8412850/packages/styles.css#L91-L103\n*/\n.scalar-toaster [data-sonner-toast][data-styled='true'] {\n  background: var(--scalar-background-1);\n  color: var(--scalar-color-1);\n  padding: 18px;\n  border: none;\n  border-radius: var(--scalar-radius-lg);\n  font-size: var(--scalar-font-size-3);\n  font-weight: var(--scalar-font-medium);\n  box-shadow: var(--scalar-shadow-2);\n}\n.scalar-toaster [data-sonner-toast] [data-icon] {\n  align-self: flex-start;\n  position: relative;\n  top: 2px;\n}\n.scalar-toaster [data-sonner-toast][data-styled='true'][data-expanded='true'] {\n  height: auto;\n}\n.scalar-toaster [data-sonner-toast][data-type='error'] {\n  background: var(--scalar-background-1);\n}\n.scalar-toaster [data-sonner-toast][data-type='error'] [data-icon] {\n  color: color-mix(in srgb, var(--scalar-color-red) 75%, var(--scalar-color-1));\n}\n.scalar-toaster [data-sonner-toast][data-type='warning'] {\n  background: var(--scalar-background-1);\n}\n.scalar-toaster [data-sonner-toast][data-type='warning'] [data-icon] {\n  color: color-mix(\n    in srgb,\n    var(--scalar-color-orange) 90%,\n    var(--scalar-color-1)\n  );\n}\n/*$vite$:1*/"));			document.head.appendChild(elementStyle);		}	} catch (e) {		console.error("vite-plugin-css-injected-by-js", e);	}})();
import { createBlock, createCommentVNode, defineComponent, onMounted, openBlock, ref, unref } from "vue";
import { Toaster, toast } from "vue-sonner";
//#region src/hooks/useToasts.ts
var state = { toast: () => null };
function initializeToasts(toastFunction) {
	state.toast = toastFunction;
}
/** Emit toasts */
function useToasts() {
	return {
		initializeToasts,
		toast: (message, level = "info", options = { timeout: 3e3 }) => {
			state.toast(message, level, options);
		}
	};
}
//#endregion
//#region src/components/ScalarToasts.vue
var ScalarToasts_default = /* @__PURE__ */ defineComponent({
	__name: "ScalarToasts",
	setup(__props) {
		const isClientMounted = ref(false);
		onMounted(() => isClientMounted.value = true);
		const toastMethods = {
			success: toast.success,
			error: toast.error,
			warn: toast.warning,
			info: toast
		};
		const { initializeToasts } = useToasts();
		initializeToasts((message, level = "info", options = {}) => {
			(toastMethods[level] || toastMethods.info)(message, {
				duration: options.timeout || 3e3,
				description: options.description
			});
		});
		return (_ctx, _cache) => {
			return isClientMounted.value ? (openBlock(), createBlock(unref(Toaster), {
				key: 0,
				class: "scalar-toaster"
			})) : createCommentVNode("", true);
		};
	}
});
//#endregion
export { ScalarToasts_default as ScalarToasts, initializeToasts, useToasts };

//# sourceMappingURL=index.js.map