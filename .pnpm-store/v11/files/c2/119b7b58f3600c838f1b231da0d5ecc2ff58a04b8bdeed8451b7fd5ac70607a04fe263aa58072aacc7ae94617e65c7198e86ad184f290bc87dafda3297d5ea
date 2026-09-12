import ScalarTeleport_default from "../ScalarTeleport/ScalarTeleport.vue.js";
import { useResizeWithTarget } from "./useResizeWithTarget.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, defineComponent, normalizeClass, normalizeStyle, openBlock, ref, renderSlot, unref, withCtx } from "vue";
import { getSideAxis } from "@floating-ui/utils";
import { autoUpdate, flip, offset, shift, size, useFloating } from "@floating-ui/vue";
var ScalarFloating_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarFloating",
	props: {
		placement: {},
		offset: {
			type: [
				Number,
				Object,
				Function
			],
			default: 5
		},
		resize: {
			type: Boolean,
			default: false
		},
		target: {},
		middleware: { default: () => [] },
		teleport: { type: [Boolean, String] }
	},
	setup(__props, { expose: __expose }) {
		const floatingRef = ref(null);
		const wrapperRef = ref(null);
		const targetRef = computed(() => {
			if (typeof window !== "undefined" && wrapperRef.value) {
				if (typeof __props.target === "string") {
					const t = document.getElementById(__props.target);
					if (t) return t;
					console.warn(`ScalarFloating: Target with id="${__props.target}" not found`);
				} else if (__props.target instanceof HTMLElement) return __props.target;
				const firstChild = wrapperRef.value.children?.[0];
				if (firstChild instanceof HTMLElement) return firstChild;
				return wrapperRef.value;
			}
		});
		const targetSize = useResizeWithTarget(targetRef, { enabled: computed(() => __props.resize) });
		const targetWidth = computed(() => getSideAxis(__props.placement ?? "bottom") === "y" ? targetSize.width.value : void 0);
		const targetHeight = computed(() => getSideAxis(__props.placement ?? "bottom") === "x" ? targetSize.height.value : void 0);
		const { floatingStyles, middlewareData } = useFloating(targetRef, floatingRef, {
			placement: computed(() => __props.placement ?? "bottom"),
			whileElementsMounted: autoUpdate,
			middleware: computed(() => [
				offset(__props.offset),
				flip({ padding: 48 }),
				shift({ padding: 8 }),
				size({ apply({ availableWidth, availableHeight, elements }) {
					Object.assign(elements.floating.style, {
						maxWidth: `${Math.max(0, availableWidth) - 16}px`,
						maxHeight: `${Math.max(0, availableHeight) - 16}px`
					});
				} }),
				...__props.middleware
			])
		});
		__expose({ targetRef });
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createElementVNode("div", {
				ref_key: "wrapperRef",
				ref: wrapperRef,
				class: normalizeClass({ contents: !!_ctx.$slots.default })
			}, [renderSlot(_ctx.$slots, "default")], 2), _ctx.$slots.floating ? (openBlock(), createBlock(unref(ScalarTeleport_default), {
				key: 0,
				disabled: !__props.teleport,
				to: typeof __props.teleport === "string" ? __props.teleport : void 0
			}, {
				default: withCtx(() => [createElementVNode("div", {
					ref_key: "floatingRef",
					ref: floatingRef,
					class: "relative z-context",
					style: normalizeStyle(unref(floatingStyles))
				}, [renderSlot(_ctx.$slots, "floating", {
					data: unref(middlewareData),
					height: targetHeight.value,
					width: targetWidth.value
				})], 4)]),
				_: 3
			}, 8, ["disabled", "to"])) : createCommentVNode("", true)], 64);
		};
	}
});
//#endregion
export { ScalarFloating_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarFloating.vue.script.js.map