import ScalarFloating_default from "../ScalarFloating/ScalarFloating.vue.js";
import ScalarDropdownMenu_default from "./ScalarDropdownMenu.vue.js";
import { useDropdown } from "./useDropdown.js";
import { useBindCx } from "@scalar/use-hooks/useBindCx";
import { computed, createBlock, createElementVNode, createSlots, createVNode, defineComponent, mergeModels, mergeProps, nextTick, openBlock, ref, renderSlot, unref, useId, useModel, watch, withCtx, withKeys, withModifiers } from "vue";
import { onClickOutside } from "@vueuse/core";
//#region src/components/ScalarDropdown/ScalarDropdown.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = [
	"id",
	"aria-activedescendant",
	"aria-labelledby",
	"onKeydown"
];
var ScalarDropdown_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarDropdown",
	props: /* @__PURE__ */ mergeModels({
		placement: {},
		offset: { type: [
			Number,
			Object,
			Function
		] },
		resize: { type: Boolean },
		target: {},
		middleware: {},
		teleport: { type: [Boolean, String] }
	}, {
		"open": {
			type: Boolean,
			default: false
		},
		"openModifiers": {}
	}),
	emits: ["update:open"],
	setup(__props) {
		const floatingRef = ref();
		const menuRef = ref();
		/** Whether or not the dropdown is open */
		const open = useModel(__props, "open");
		const { active } = useDropdown();
		const fallbackTargetId = useId();
		const targetId = ref(fallbackTargetId);
		const menuId = useId();
		/** Handle click events on the target */
		async function handleTargetClick() {
			open.value = !open.value;
			await nextTick();
			if (open.value) menuRef.value?.focus();
		}
		/** Handle keydown events on the target */
		async function handleTargetKeydown(event) {
			if ([
				"ArrowDown",
				"ArrowUp",
				" ",
				"Enter"
			].includes(event.key)) event.preventDefault();
			else return;
			if (!open.value) open.value = true;
			await nextTick();
			menuRef.value?.focus();
			if ([
				"ArrowDown",
				" ",
				"Enter"
			].includes(event.key)) moveActive(1);
			else if (event.key === "ArrowUp") moveActive(-1);
		}
		/** Watch the target reference for changes */
		watch(() => floatingRef.value?.targetRef, (newTarget, oldTarget) => {
			if (newTarget) {
				if (newTarget.id) targetId.value = newTarget.id;
				else {
					targetId.value = fallbackTargetId;
					newTarget.setAttribute("id", targetId.value);
				}
				newTarget.setAttribute("aria-haspopup", "menu");
				newTarget.setAttribute("aria-expanded", `${open.value}`);
				if (open.value) newTarget.setAttribute("aria-controls", menuId);
				newTarget.addEventListener("click", handleTargetClick);
				newTarget.addEventListener("keydown", handleTargetKeydown);
			}
			if (oldTarget && oldTarget !== newTarget) {
				if (oldTarget.id === fallbackTargetId) oldTarget.removeAttribute("id");
				oldTarget.removeAttribute("aria-controls");
				oldTarget.removeAttribute("aria-haspopup");
				oldTarget.removeAttribute("aria-expanded");
				oldTarget.removeEventListener("click", handleTargetClick);
				oldTarget.removeEventListener("keydown", handleTargetKeydown);
			}
		}, { immediate: true });
		/** Watch the open state for changes */
		watch(open, (o) => {
			const target = floatingRef.value?.targetRef;
			if (!target) return;
			target.setAttribute("aria-expanded", `${o}`);
			if (o) target.setAttribute("aria-controls", menuId);
			else target.removeAttribute("aria-controls");
		}, { immediate: true });
		async function handleClose() {
			floatingRef.value?.targetRef?.focus();
			open.value = false;
		}
		function handleSelected() {
			if (!active.value || !menuRef.value) return;
			const button = menuRef.value.querySelector(`#${active.value}[role="menuitem"]:not([aria-disabled="true"])`);
			if (!button) return;
			button.click();
			handleClose();
		}
		/** Move the active item in the dropdown */
		function moveActive(dir) {
			if (!open.value || !menuRef.value) return;
			const list = Array.from(menuRef.value.querySelectorAll("[role=\"menuitem\"]:not([aria-disabled=\"true\"])"));
			if (list.length === 0) return;
			const activeIdx = list.findIndex((item) => item.id === active.value);
			if (activeIdx === -1) {
				const targetItem = list[dir > 0 ? 0 : list.length - 1];
				if (targetItem?.id) active.value = targetItem.id;
				return;
			}
			const nextIdx = activeIdx + dir;
			if (nextIdx < 0 || nextIdx > list.length - 1) return;
			const nextItem = list[nextIdx];
			if (nextItem?.id) active.value = nextItem.id;
		}
		/** Close the dropdown if the user clicks outside of the menu and button */
		onClickOutside(menuRef, handleClose, { ignore: [computed(() => floatingRef.value?.targetRef)] });
		const { cx } = useBindCx();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ScalarFloating_default), mergeProps({
				ref_key: "floatingRef",
				ref: floatingRef
			}, _ctx.$props, { placement: __props.placement ?? "bottom-start" }), createSlots({
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open: open.value })]),
				_: 2
			}, [open.value ? {
				name: "floating",
				fn: withCtx(({ width }) => [createVNode(ScalarDropdownMenu_default, mergeProps({ style: { width } }, unref(cx)("max-h-[inherit] max-w-[inherit]")), {
					menu: withCtx(() => [createElementVNode("div", {
						id: unref(menuId),
						ref_key: "menuRef",
						ref: menuRef,
						"aria-activedescendant": unref(active),
						"aria-labelledby": targetId.value,
						class: "flex flex-col p-0.75 outline-none",
						role: "menu",
						tabindex: "-1",
						onClick: withModifiers(handleClose, ["stop"]),
						onKeydown: [
							_cache[0] || (_cache[0] = withKeys(withModifiers(($event) => moveActive(1), ["prevent", "stop"]), ["down"])),
							withKeys(withModifiers(handleSelected, ["prevent", "stop"]), ["enter"]),
							withKeys(withModifiers(handleClose, ["prevent", "stop"]), ["escape"]),
							withKeys(withModifiers(handleSelected, ["prevent", "stop"]), ["space"]),
							withKeys(withModifiers(handleClose, ["prevent", "stop"]), ["tab"]),
							_cache[1] || (_cache[1] = withKeys(withModifiers(($event) => moveActive(-1), ["prevent", "stop"]), ["up"]))
						]
					}, [renderSlot(_ctx.$slots, "items", { open: open.value })], 40, _hoisted_1)]),
					_: 3
				}, 16, ["style"])]),
				key: "0"
			} : void 0]), 1040, ["placement"]);
		};
	}
});
//#endregion
export { ScalarDropdown_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarDropdown.vue.script.js.map