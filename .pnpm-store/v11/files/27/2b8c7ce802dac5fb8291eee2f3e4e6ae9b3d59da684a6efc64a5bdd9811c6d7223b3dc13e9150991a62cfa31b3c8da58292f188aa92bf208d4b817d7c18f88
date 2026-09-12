import { AgentErrorCodes } from "../entities/error/constants.js";
import { MAX_PROMPT_SIZE } from "../entities/prompt/constants.js";
import { useUploadTmpDocument } from "../hooks/use-upload-tmp-document.js";
import { useState } from "../state/state.js";
import { useRequestApprovals } from "../hooks/use-chat-approvals.js";
import ActionsDropdown_default from "../components/ActionsDropdown.vue.js";
import ApprovalSection_default from "../components/ApprovalSection.vue.js";
import { useChatError } from "../hooks/use-chat-error.js";
import ErrorMessage_default from "../components/ErrorMessage.vue.js";
import FreeMessagesInfoSection_default from "../components/FreeMessagesInfoSection.vue.js";
import PaymentSection_default from "../components/PaymentSection.vue.js";
import SearchPopover_default from "../components/SearchPopover.vue.js";
import UploadSection_default from "../components/UploadSection.vue.js";
import { useChatPendingClientToolParts } from "../hooks/use-chat-pending-client-tool-parts.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, openBlock, renderList, toDisplayString, unref, useTemplateRef, vModelText, watch, withCtx, withDirectives, withModifiers } from "vue";
import { ScalarIconArrowUp, ScalarIconCheck, ScalarIconLockSimple, ScalarIconPlus, ScalarIconX } from "@scalar/icons";
import { ScalarIconButton } from "@scalar/components/icon-button";
import { ScalarLoading } from "@scalar/components/loading";
import { ScalarTooltip } from "@scalar/components/tooltip";
//#region src/views/PromptForm.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "actionContainer" };
var _hoisted_2 = ["disabled"];
var _hoisted_3 = { class: "inputActionsContainer" };
var _hoisted_4 = { class: "inputActionsLeft" };
var _hoisted_5 = {
	class: "addAPIButton",
	type: "button"
};
var _hoisted_6 = {
	class: "addAPIButton",
	type: "button"
};
var _hoisted_7 = ["src"];
var _hoisted_8 = ["onClick"];
var _hoisted_9 = { class: "inputActionsRight" };
var _hoisted_10 = { class: "sendCheckboxContinue" };
var _hoisted_11 = {
	key: 0,
	class: "relative flex items-center gap-1.5"
};
var _hoisted_12 = {
	class: "termsAgree",
	for: "agentTermsAgree"
};
var _hoisted_13 = {
	key: 5,
	class: "addMoreContext"
};
var _hoisted_14 = { class: "ml-auto flex items-center gap-1" };
var _hoisted_15 = ["onClick"];
var _hoisted_16 = ["alt", "src"];
var PromptForm_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "PromptForm",
	emits: ["submit", "uploadApi"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const emit = __emit;
		__expose({ focusPrompt });
		const promptRef = useTemplateRef("agentPrompt");
		const state = useState();
		const inputHasContent = computed(() => state.prompt.value.trim().length > 0);
		const promptTooLarge = computed(() => state.prompt.value.trim().length > MAX_PROMPT_SIZE);
		/** Show free messages info only after at least one message has been sent and when no API key is set. */
		const showFreeMessagesInfo = computed(() => state.chat.messages.length > 1 && !state.getAgentKey?.() && chatError?.value?.code !== AgentErrorCodes.LIMIT_REACHED);
		watch(state.prompt, () => {
			if (!promptRef?.value) return;
			if (!state.prompt.value.length) {
				promptRef.value.style.height = "0px";
				return;
			}
			promptRef.value.style.height = "auto";
			promptRef.value.style.height = promptRef.value.scrollHeight + "px";
		});
		function handlePromptKeydown(e) {
			if (state.loading.value) return;
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSubmit();
				window.scrollTo(0, document.body.scrollHeight);
			}
		}
		function focusPrompt() {
			promptRef.value?.focus();
		}
		watch(() => state.chat.status, (status) => {
			if (status === "ready" || status === "error") promptRef.value?.focus();
		});
		const { approvalRequiredParts, respondToRequestApprovals } = useRequestApprovals();
		const { pendingClientToolParts } = useChatPendingClientToolParts();
		const uploadTmpDoc = useUploadTmpDocument();
		function acceptTerms() {
			state.terms.accept();
			if (state.mode === "preview" && state.getActiveDocumentJson) uploadTmpDoc.uploadTempDocument(state.getActiveDocumentJson(), true);
		}
		const isPending = computed(() => Object.values(state.pendingDocuments).some(Boolean));
		const submitDisabled = computed(() => {
			const tooLarge = promptTooLarge.value;
			const missingInput = !inputHasContent.value;
			const awaitingApproval = approvalRequiredParts.value.length > 0;
			const pendingToolParts = pendingClientToolParts.value.length > 0;
			const isPreview = state.mode === "preview";
			const termsNotAccepted = isPreview && !state.terms.accepted.value;
			const uploadingTmpDoc = isPreview && !!uploadTmpDoc.uploadState.value;
			const isLoading = isPending.value;
			return tooLarge || missingInput || awaitingApproval || pendingToolParts || termsNotAccepted || uploadingTmpDoc || isLoading;
		});
		function handleSubmit() {
			if (submitDisabled.value) return;
			emit("submit");
		}
		const chatError = useChatError();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [
				unref(uploadTmpDoc).uploadState.value || isPending.value ? (openBlock(), createBlock(UploadSection_default, {
					key: 0,
					uploadState: unref(uploadTmpDoc).uploadState.value ?? { type: "loading" }
				}, null, 8, ["uploadState"])) : createCommentVNode("", true),
				unref(chatError) ? (openBlock(), createBlock(ErrorMessage_default, {
					key: 1,
					error: unref(chatError)
				}, null, 8, ["error"])) : createCommentVNode("", true),
				unref(approvalRequiredParts).length ? (openBlock(), createBlock(ApprovalSection_default, {
					key: 2,
					onApprove: _cache[0] || (_cache[0] = ($event) => unref(respondToRequestApprovals)(true)),
					onReject: _cache[1] || (_cache[1] = ($event) => unref(respondToRequestApprovals)(false))
				})) : createCommentVNode("", true),
				unref(chatError)?.code === unref(AgentErrorCodes).LIMIT_REACHED ? (openBlock(), createBlock(PaymentSection_default, { key: 3 })) : createCommentVNode("", true),
				showFreeMessagesInfo.value ? (openBlock(), createBlock(FreeMessagesInfoSection_default, { key: 4 })) : createCommentVNode("", true),
				createElementVNode("form", {
					class: "promptForm",
					onSubmit: withModifiers(handleSubmit, ["prevent"])
				}, [
					_cache[6] || (_cache[6] = createElementVNode("label", {
						class: "agentLabel",
						for: "agentTextarea"
					}, " Type a Request To get Started ", -1)),
					withDirectives(createElementVNode("textarea", {
						id: "agentTextarea",
						ref: "agentPrompt",
						"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(state).prompt.value = $event),
						class: "prompt custom-scroll",
						disabled: unref(state).loading.value,
						name: "prompt",
						placeholder: "Ask me anything…",
						onKeydown: handlePromptKeydown
					}, null, 40, _hoisted_2), [[vModelText, unref(state).prompt.value]]),
					createElementVNode("div", _hoisted_3, [createElementVNode("div", _hoisted_4, [!unref(state).hideAddApi ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [!unref(state).isLoggedIn?.value ? (openBlock(), createBlock(SearchPopover_default, { key: 0 }, {
						default: withCtx(() => [createElementVNode("button", _hoisted_5, [createVNode(unref(ScalarIconPlus), {
							class: "size-4",
							weight: "bold"
						})])]),
						_: 1
					})) : (openBlock(), createBlock(ActionsDropdown_default, {
						key: 1,
						onUploadApi: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("uploadApi"))
					}, {
						default: withCtx(() => [createElementVNode("button", _hoisted_6, [createVNode(unref(ScalarIconPlus), {
							class: "size-4",
							weight: "bold"
						})])]),
						_: 1
					}))], 64)) : createCommentVNode("", true), (openBlock(true), createElementBlock(Fragment, null, renderList(unref(state).registryDocuments.value, (document) => {
						return openBlock(), createElementBlock("div", {
							key: document.id,
							class: "apiPill"
						}, [
							document.logoUrl ? (openBlock(), createElementBlock("img", {
								key: 0,
								class: "apiPillLogo",
								src: document.logoUrl
							}, null, 8, _hoisted_7)) : createCommentVNode("", true),
							createTextVNode(" " + toDisplayString(document.title) + " ", 1),
							document.removable ? (openBlock(), createElementBlock("button", {
								key: 1,
								class: "apiPillRemove",
								type: "button",
								onClick: ($event) => unref(state).removeDocument(document)
							}, [createVNode(unref(ScalarIconX), {
								class: "size-4",
								weight: "bold"
							})], 8, _hoisted_8)) : createCommentVNode("", true)
						]);
					}), 128))]), createElementVNode("div", _hoisted_9, [!unref(state).loading.value ? (openBlock(), createBlock(unref(ScalarTooltip), {
						key: 0,
						content: "Settings"
					}, {
						default: withCtx(() => [createVNode(unref(ScalarIconButton), {
							class: "settingsButton h-7 w-7 p-1.5",
							icon: unref(ScalarIconLockSimple),
							label: "Scalar",
							size: "md",
							weight: "bold",
							onClick: _cache[4] || (_cache[4] = ($event) => unref(state).settingsModal.show())
						}, null, 8, ["icon"])]),
						_: 1
					})) : createCommentVNode("", true), createElementVNode("div", _hoisted_10, [!unref(state).terms.accepted.value && unref(state).mode === "preview" ? (openBlock(), createElementBlock("div", _hoisted_11, [createElementVNode("input", {
						id: "agentTermsAgree",
						class: "sr-only",
						type: "checkbox",
						onChange: acceptTerms
					}, null, 32), createElementVNode("label", _hoisted_12, [createVNode(unref(ScalarIconCheck), {
						class: "termsAgreeIcon",
						weight: "bold"
					}), _cache[5] || (_cache[5] = createTextVNode(" Agree to Terms & Conditions ", -1))])])) : createCommentVNode("", true), !unref(state).loading.value ? (openBlock(), createBlock(unref(ScalarIconButton), {
						key: 1,
						class: "sendButton h-7 w-7 p-1.5",
						disabled: submitDisabled.value,
						icon: unref(ScalarIconArrowUp),
						label: "Scalar",
						size: "md",
						type: "submit",
						weight: "bold"
					}, null, 8, ["disabled", "icon"])) : (openBlock(), createBlock(unref(ScalarLoading), {
						key: 2,
						class: "loader h-7 w-7",
						loader: {
							isLoading: unref(state).loading.value,
							isValid: false,
							clear: async () => {},
							invalidate: async () => {},
							isInvalid: false,
							isActive: false,
							validate: async () => {},
							start: () => {}
						},
						size: "2xl"
					}, null, 8, ["loader"]))])])])
				], 32),
				unref(state).chat.messages.length <= 1 && !unref(state).hideAddApi ? (openBlock(), createElementBlock("div", _hoisted_13, [_cache[7] || (_cache[7] = createElementVNode("span", null, "Load additional APIs", -1)), createElementVNode("div", _hoisted_14, [(openBlock(true), createElementBlock(Fragment, null, renderList(unref(state).curatedDocuments.value, (doc) => {
					return openBlock(), createElementBlock("button", {
						key: doc.id,
						class: "addAPIContext",
						type: "button",
						onClick: ($event) => unref(state).addDocument(doc)
					}, [doc.logoUrl ? (openBlock(), createElementBlock("img", {
						key: 0,
						alt: doc.title,
						class: "size-4",
						src: doc.logoUrl
					}, null, 8, _hoisted_16)) : createCommentVNode("", true)], 8, _hoisted_15);
				}), 128))])])) : createCommentVNode("", true)
			]);
		};
	}
});
//#endregion
export { PromptForm_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=PromptForm.vue.script.js.map