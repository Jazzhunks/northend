import { computed, createBlock, createElementBlock, createElementVNode, defineComponent, normalizeClass, openBlock, toDisplayString, unref, withCtx } from "vue";
import { ScalarListbox } from "@scalar/components/listbox";
import { REQUEST_METHODS, getHttpMethodInfo } from "@scalar/helpers/http/http-info";
import { objectEntries } from "@scalar/helpers/object/object-entries";
import { cva, cx } from "@scalar/use-hooks/useBindCx";
//#region src/components/HttpMethod/HttpMethod.vue?vue&type=script&setup=true&lang.ts
var HttpMethod_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "HttpMethod",
	props: {
		isSquare: {
			type: Boolean,
			default: false
		},
		method: {},
		isEditable: {
			type: Boolean,
			default: false
		}
	},
	emits: ["change"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const method = computed(() => getHttpMethodInfo(props.method));
		const methodOptions = objectEntries(REQUEST_METHODS).map(([id]) => ({
			id,
			label: id.toUpperCase(),
			color: getHttpMethodInfo(id).colorClass
		}));
		const selectedMethod = computed({
			get: () => methodOptions.find(({ id }) => id === props.method),
			set: (opt) => opt?.id && emit("change", opt.id)
		});
		const variants = cva({
			base: "text-center font-code text-3xs justify-center items-center flex",
			variants: {
				isSquare: {
					true: "px-2.5 whitespace-nowrap font-bold border-r h-fit m-auto",
					false: "rounded-full"
				},
				isEditable: {
					true: "http-bg-gradient rounded-md border",
					false: "cursor-auto"
				}
			}
		});
		const httpLabel = computed(() => method.value.short);
		return (_ctx, _cache) => {
			return __props.isEditable ? (openBlock(), createBlock(unref(ScalarListbox), {
				key: 0,
				modelValue: selectedMethod.value,
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => selectedMethod.value = $event),
				class: "font-code scalar-client mt-1 text-sm",
				options: unref(methodOptions)
			}, {
				default: withCtx(() => [createElementVNode("div", { class: normalizeClass(["h-full", { "pointer-events-none": !__props.isEditable }]) }, [createElementVNode("button", {
					class: normalizeClass(["relative h-full", unref(cx)(unref(variants)({
						isSquare: __props.isSquare,
						isEditable: __props.isEditable
					}), method.value.colorClass)]),
					type: "button"
				}, [createElementVNode("span", null, toDisplayString(httpLabel.value), 1)], 2)], 2)]),
				_: 1
			}, 8, ["modelValue", "options"])) : (openBlock(), createElementBlock("div", {
				key: 1,
				class: normalizeClass(["relative gap-1 whitespace-nowrap", unref(cx)(unref(variants)({
					isSquare: __props.isSquare,
					isEditable: __props.isEditable
				}), method.value.colorClass)]),
				type: "button"
			}, toDisplayString(method.value.short), 3));
		};
	}
});
//#endregion
export { HttpMethod_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=HttpMethod.vue.script.js.map