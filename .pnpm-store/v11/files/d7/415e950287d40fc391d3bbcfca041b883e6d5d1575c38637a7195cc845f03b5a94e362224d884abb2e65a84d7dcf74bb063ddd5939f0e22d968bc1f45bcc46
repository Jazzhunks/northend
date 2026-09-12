import ScalarListboxCheckbox_default from "../ScalarListbox/ScalarListboxCheckbox.vue.js";
import ScalarDropdownMenu_default from "../ScalarDropdown/ScalarDropdownMenu.vue.js";
import ScalarDropdownButton_default from "../ScalarDropdown/ScalarDropdownButton.vue.js";
import ScalarMenuLink_default from "./ScalarMenuLink.vue.js";
import ScalarMenuTeamProfile_default from "./ScalarMenuTeamProfile.vue.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeProps, openBlock, renderList, unref, withCtx } from "vue";
import { ScalarIconCaretRight, ScalarIconPlus, ScalarIconUserSwitch } from "@scalar/icons";
import { DropdownMenu } from "radix-vue/namespaced";
var ScalarMenuTeamPicker_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ScalarMenuTeamPicker",
	props: {
		team: {},
		teams: {},
		allowAddTeam: {
			type: Boolean,
			default: true
		}
	},
	emits: ["update:team", "add"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		/** A model that tracks the team id */
		const model = computed({
			get: () => __props.team?.id,
			set: (v) => emit("update:team", __props.teams.find((t) => t.id === v))
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(DropdownMenu).Sub, null, {
				default: withCtx(() => [createVNode(unref(ScalarMenuLink_default), mergeProps({
					icon: unref(ScalarIconUserSwitch),
					submenu: ""
				}, _ctx.$attrs), {
					default: withCtx(() => [_cache[2] || (_cache[2] = createElementVNode("div", null, "Change team", -1)), createVNode(unref(ScalarIconCaretRight), {
						class: "ml-auto text-c-2 -mr-px size-3",
						weight: "bold"
					})]),
					_: 1
				}, 16, ["icon"]), createVNode(unref(DropdownMenu).Portal, null, {
					default: withCtx(() => [createVNode(unref(DropdownMenu).SubContent, {
						as: unref(ScalarDropdownMenu_default),
						class: "max-h-radix-popper z-context-plus",
						sideOffset: 3
					}, {
						default: withCtx(() => [createVNode(unref(DropdownMenu).RadioGroup, {
							modelValue: model.value,
							"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
							class: "contents"
						}, {
							default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.teams, (t) => {
								return openBlock(), createBlock(unref(DropdownMenu).RadioItem, {
									key: t.id,
									as: unref(ScalarDropdownButton_default),
									class: "group/item flex items-center",
									value: t.id
								}, {
									default: withCtx(() => [createVNode(ScalarMenuTeamProfile_default, {
										class: "-ml-0.75 flex-1 min-w-0",
										label: t.label,
										src: t.src
									}, null, 8, ["label", "src"]), createVNode(unref(ScalarListboxCheckbox_default), {
										class: "ml-auto",
										selected: t.id === model.value
									}, null, 8, ["selected"])]),
									_: 2
								}, 1032, ["as", "value"]);
							}), 128))]),
							_: 1
						}, 8, ["modelValue"]), __props.allowAddTeam ? (openBlock(), createBlock(unref(DropdownMenu).Item, {
							key: 0,
							as: unref(ScalarDropdownButton_default),
							class: "flex items-center",
							onClick: _cache[1] || (_cache[1] = ($event) => emit("add"))
						}, {
							default: withCtx(() => [createVNode(unref(ScalarIconPlus), {
								class: "bg-b-3 -ml-0.75 rounded p-1 size-5 text-c-3",
								weight: "bold"
							}), _cache[3] || (_cache[3] = createTextVNode(" Create new team ", -1))]),
							_: 1
						}, 8, ["as"])) : createCommentVNode("", true)]),
						_: 1
					}, 8, ["as"])]),
					_: 1
				})]),
				_: 1
			});
		};
	}
});
//#endregion
export { ScalarMenuTeamPicker_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ScalarMenuTeamPicker.vue.script.js.map