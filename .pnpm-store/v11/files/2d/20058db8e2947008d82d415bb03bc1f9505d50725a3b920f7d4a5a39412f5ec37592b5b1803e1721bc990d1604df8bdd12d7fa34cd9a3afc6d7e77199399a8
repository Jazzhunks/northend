import ScalarIconButton_default from "../ScalarIconButton/ScalarIconButton.vue.js";
import { cva, cx } from "@scalar/use-hooks/useBindCx";
import { createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, normalizeClass, normalizeStyle, openBlock, reactive, renderSlot, toDisplayString, unref, withCtx } from "vue";
import { ScalarIconX } from "@scalar/icons";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
//#region src/components/ScalarModal/ScalarModal.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "close-button z-10 fixed right-2 top-2"
};
/**
* Scalar Modal component
*
* A dialog overlay with configurable size and variant.
* Use the {@link useModal} hook to control the open state.
*
* @example
* <ScalarModal :state="modal" title="My Modal">
*   Modal content
* </ScalarModal>
*/
var __default__ = {};
/** Hook for creating a reactive modal state */
function useModal() {
	return reactive({
		open: false,
		show() {
			this.open = true;
		},
		hide() {
			this.open = false;
		}
	});
}
var ScalarModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	...__default__,
	__name: "ScalarModal",
	props: {
		state: {},
		title: {},
		bodyClass: {},
		maxWidth: {},
		size: { default: "md" },
		variant: {}
	},
	emits: ["close"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const modal = cva({
			base: ["scalar-modal", "flex flex-col relative mb-0 rounded-lg bg-b-1 p-0 text-left leading-snug text-c-1 opacity-0 w-[calc(100vw-12px)] md:w-[calc(100vw-16px)] lg:w-[calc(100vw-32px)]"].join(" "),
			variants: {
				size: {
					xxs: "mt-[20svh] max-h-[60svh] max-w-[360px]",
					xs: "mt-[20svh] max-h-[60svh] max-w-[480px]",
					sm: "mt-[20svh] max-h-[60svh] max-w-[540px]",
					md: "mt-[20svh] max-h-[60svh] max-w-[640px]",
					lg: "m-auto max-h-[80svh] max-w-[800px]",
					xl: "m-auto max-h-[90svh] max-w-[1000px]",
					full: "full-size-styles max-h-dvh mt-0 lg:w-full"
				},
				variant: {
					form: "scalar-modal-form",
					search: "scalar-modal-search mt-[15svh] max-h-[60svh] max-w-[540px]",
					error: "scalar-modal-error"
				}
			}
		});
		const body = cva({
			base: ["scalar-modal-body", "relative flex-1 min-h-0 p-3"].join(" "),
			variants: {
				variant: {
					form: "overflow-visible",
					search: "flex flex-col !m-0 overflow-hidden p-0",
					error: "overflow-y-scroll"
				},
				size: {
					xxs: "",
					xs: "",
					sm: "",
					md: "",
					lg: "",
					xl: "m-0 p-0",
					full: " rounded-none"
				}
			}
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Dialog), {
				open: __props.state.open,
				onClose: _cache[1] || (_cache[1] = () => {
					__props.state.hide();
					emit("close");
				})
			}, {
				default: withCtx(() => [createElementVNode("div", { class: normalizeClass(unref(cx)(__props.size === "full" ? "scalar-modal-layout-full" : "scalar-modal-layout", "fixed left-0 top-0 flex items-start justify-center", "z-overlay h-dvh w-dvw", "bg-backdrop opacity-0 dark:bg-backdrop-dark", __props.size === "full" && "flex")) }, [createVNode(unref(DialogPanel), {
					class: normalizeClass(unref(modal)({
						size: __props.size,
						variant: __props.variant
					})),
					style: normalizeStyle({ maxWidth: __props.maxWidth })
				}, {
					default: withCtx(() => [__props.title ? (openBlock(), createBlock(unref(DialogTitle), {
						key: 0,
						class: "scalar-modal-header m-0 -mb-1 rounded-lg pt-3 px-3 text-left text-sm font-medium text-c-1"
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(__props.title), 1)]),
						_: 1
					})) : createCommentVNode("", true), __props.size === "full" ? (openBlock(), createElementBlock("div", {
						key: 1,
						class: normalizeClass(__props.bodyClass)
					}, [renderSlot(_ctx.$slots, "default", {}, void 0, true)], 2)) : (openBlock(), createElementBlock("div", {
						key: 2,
						class: normalizeClass(unref(cx)(unref(body)({
							size: __props.size,
							variant: __props.variant
						}), __props.bodyClass))
					}, [renderSlot(_ctx.$slots, "default", {}, void 0, true)], 2))]),
					_: 3
				}, 8, ["class", "style"]), __props.size === "full" ? (openBlock(), createElementBlock("div", _hoisted_1, [createVNode(unref(ScalarIconButton_default), {
					class: "hover:bg-b-3 focus:outline-none",
					icon: unref(ScalarIconX),
					label: "Close modal",
					onClick: _cache[0] || (_cache[0] = ($event) => __props.state.hide())
				}, null, 8, ["icon"])])) : createCommentVNode("", true)], 2)]),
				_: 3
			}, 8, ["open"]);
		};
	}
});
//#endregion
export { ScalarModal_vue_vue_type_script_setup_true_lang_default as default, useModal };

//# sourceMappingURL=ScalarModal.vue.script.js.map