import { getTmpDocFromLocalStorage } from "./hooks/use-upload-tmp-document.js";
import { useState } from "./state/state.js";
import { useAgentKeyDocuments } from "./hooks/use-agent-key-documents.js";
import { useChatScroll } from "./hooks/use-chat-scroll.js";
import { useCuratedDocuments } from "./hooks/use-curated-documents.js";
import Layout_default from "./views/Layout.vue.js";
import Settings_default from "./views/Settings/Settings.vue.js";
import { Fragment, createElementBlock, createElementVNode, createVNode, defineComponent, onBeforeUnmount, onMounted, openBlock, ref, unref, useTemplateRef } from "vue";
import { createApiClientModal } from "@scalar/api-client/modal";
//#region src/Chat.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { ref: "clientModal" };
var Chat_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Chat",
	emits: ["uploadApi"],
	setup(__props) {
		const { chat, prompt, settingsModal, eventBus, workspaceStore, config, mode, addDocument } = useState();
		const clientModalRef = useTemplateRef("clientModal");
		const apiClient = ref(null);
		onMounted(async () => {
			const tmpDoc = getTmpDocFromLocalStorage();
			if (mode === "preview" && tmpDoc) await addDocument({
				namespace: tmpDoc.namespace,
				slug: tmpDoc.slug,
				removable: false,
				tmp: true
			});
			if (!clientModalRef.value) return;
			apiClient.value = createApiClientModal({
				el: clientModalRef.value,
				options: config,
				eventBus,
				workspaceStore
			});
		});
		onBeforeUnmount(() => {
			apiClient.value?.app.unmount();
		});
		useChatScroll();
		useAgentKeyDocuments();
		useCuratedDocuments();
		async function handleSubmit() {
			await chat.sendMessage({ text: prompt.value });
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [
				createElementVNode("div", _hoisted_1, null, 512),
				createVNode(Layout_default, {
					onSubmit: handleSubmit,
					onUploadApi: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("uploadApi"))
				}),
				createVNode(Settings_default, { modalState: unref(settingsModal) }, null, 8, ["modalState"])
			], 64);
		};
	}
});
//#endregion
export { Chat_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=Chat.vue.script.js.map