import { createError } from "../entities/error/helpers.js";
import { createApi, createAuthorizationHeaders } from "../api.js";
import { createDocumentName } from "../registry/create-document-name.js";
import "../entities/tools/execute-request.js";
import { executeRequestTool } from "../client-tools/execute-request.js";
import { URLS } from "../consts/urls.js";
import { createDocumentSettings } from "../helpers.js";
import { useTermsAndConditions } from "../hooks/use-term-and-conditions.js";
import { removeTmpDocFromLocalStorage } from "../hooks/use-upload-tmp-document.js";
import { persistencePlugin } from "../plugins/persistance.js";
import { loadDocument } from "../registry/add-documents-to-store.js";
import { computed, inject, reactive, ref, watch } from "vue";
import { useToasts } from "@scalar/use-toasts";
import { Chat } from "@ai-sdk/vue";
import { useModal } from "@scalar/components/modal";
import { apiReferenceConfigurationSchema } from "@scalar/schemas/api-reference";
import { coerce } from "@scalar/validation";
import { createWorkspaceStore } from "@scalar/workspace-store/client";
import { createWorkspaceEventBus } from "@scalar/workspace-store/events";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { n } from "neverpanic";
//#region src/state/state.ts
var STATE_SYMBOL = Symbol("STATE_SYMBOL");
var { toast } = useToasts();
function createChat({ registryDocuments, workspaceStore, baseUrl, proxyUrl, getAccessToken, getAgentKey }) {
	const chat = new Chat({
		sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
		transport: new DefaultChatTransport({
			api: `${baseUrl}/vector/openapi/chat`,
			headers: () => createAuthorizationHeaders({
				getAccessToken,
				getAgentKey
			}),
			body: () => ({ registryDocuments: registryDocuments.value })
		}),
		async onToolCall({ toolCall }) {
			if (toolCall.dynamic) return;
			if (toolCall.toolName === "execute-request" && toolCall.input.method.toLowerCase() === "get") await executeRequestTool({
				documentSettings: createDocumentSettings(workspaceStore),
				input: toolCall.input,
				toolCallId: toolCall.toolCallId,
				chat,
				proxyUrl: proxyUrl.value
			});
		}
	});
	return chat;
}
function createState({ initialRegistryDocuments, registryUrl, dashboardUrl, platformProxyUrl, baseUrl, mode, isLoggedIn, getAccessToken, getAgentKey, getActiveDocumentJson, prefilledMessageRef, hideAddApi }) {
	const prompt = ref(prefilledMessageRef?.value ?? "");
	const registryDocuments = ref([]);
	const pendingDocuments = reactive({});
	const curatedDocuments = ref([]);
	const proxyUrlRaw = ref(URLS.DEFAULT_PROXY_URL);
	const proxyUrl = computed(() => proxyUrlRaw.value?.trim() || URLS.DEFAULT_PROXY_URL);
	const uploadedTmpDocumentUrl = ref();
	const terms = useTermsAndConditions();
	const eventBus = createWorkspaceEventBus();
	const workspaceStore = createWorkspaceStore({ plugins: [persistencePlugin({ persistAuth: true })] });
	const config = computed(() => coerce(apiReferenceConfigurationSchema, {
		proxyUrl: proxyUrl.value,
		persistAuth: true
	}));
	const chat = createChat({
		registryDocuments,
		workspaceStore,
		baseUrl,
		proxyUrl,
		getAccessToken,
		getAgentKey
	});
	const api = createApi({
		baseUrl,
		getAccessToken,
		getAgentKey
	});
	const loading = computed(() => chat.status === "submitted" || chat.status === "streaming" && !chat.lastMessage?.parts.some((part) => part.type === "text"));
	watch(() => chat.status, () => {
		if (chat.status === "streaming") prompt.value = "";
	});
	if (prefilledMessageRef) watch(prefilledMessageRef, async (val) => {
		if (val) {
			prompt.value = val;
			if (terms.accepted.value) await chat.sendMessage({ text: prompt.value });
		}
	});
	const settingsModal = useModal();
	async function addDocument({ namespace, slug, removable = true, tmp = false }) {
		if (registryDocuments.value.find((doc) => doc.namespace === namespace && doc.slug === slug)) return;
		const identifier = `@${namespace}/${slug}`;
		pendingDocuments[identifier] = true;
		const loadDocumentResult = await loadDocument({
			namespace,
			slug,
			workspaceStore,
			registryUrl,
			registryDocuments,
			config: config.value,
			getAccessToken,
			api,
			removable
		});
		pendingDocuments[identifier] = false;
		if (!loadDocumentResult.success) {
			/**
			* If we are unable to load a document, we just remove it
			* from tmp local storage, do not warn the user.
			*/
			if (tmp) {
				removeTmpDocFromLocalStorage();
				throw loadDocumentResult.error;
			}
			console.warn("[AGENT]: Unable to load document", loadDocumentResult.error);
			toast(`Unable to load the document @${namespace}/${slug}`, "warn");
			throw loadDocumentResult.error;
		}
	}
	/**
	* Waits for document to be available in embeddings
	* and adds to the list
	*/
	async function addDocumentAsync({ namespace, slug, removable = true }) {
		if (registryDocuments.value.find((doc) => doc.namespace === namespace && doc.slug === slug)) return;
		const identifier = `@${namespace}/${slug}`;
		pendingDocuments[identifier] = true;
		const embeddingStatusResponse = await n.fromUnsafe(() => fetch(`${baseUrl}/vector/registry/embeddings/${namespace}/${slug}`, { method: "GET" }), (originalError) => createError("FAILED_TO_GET_EMBEDDING_STATUS", originalError));
		if (embeddingStatusResponse.success && embeddingStatusResponse.data.ok) {
			const loadDocumentResult = await loadDocument({
				namespace,
				slug,
				workspaceStore,
				registryUrl,
				registryDocuments,
				config: config.value,
				getAccessToken,
				api,
				removable
			});
			if (!loadDocumentResult.success) {
				console.warn("[AGENT]: Unable to load document", loadDocumentResult.error);
				toast(`Unable to load the document @${namespace}/${slug}`, "warn");
			}
		} else {
			console.warn("[AGENT]: Document could not be embedded");
			toast(`Unable to embed the document @${namespace}/${slug}`, "warn");
		}
		pendingDocuments[identifier] = false;
	}
	function removeDocument({ namespace, slug }) {
		registryDocuments.value = registryDocuments.value.filter((doc) => !(doc.namespace === namespace && doc.slug === slug));
		workspaceStore.deleteDocument(createDocumentName(namespace, slug));
	}
	initialRegistryDocuments.forEach(({ namespace, slug }) => addDocument({
		namespace,
		slug,
		removable: false
	}));
	return {
		prompt,
		chat,
		workspaceStore,
		eventBus,
		loading,
		settingsModal,
		config,
		registryUrl,
		dashboardUrl,
		platformProxyUrl,
		baseUrl,
		registryDocuments,
		pendingDocuments,
		proxyUrl,
		proxyUrlRaw,
		mode,
		terms,
		isLoggedIn,
		addDocument,
		addDocumentAsync,
		removeDocument,
		getAccessToken,
		getAgentKey,
		api,
		uploadedTmpDocumentUrl,
		curatedDocuments,
		getActiveDocumentJson,
		hideAddApi
	};
}
function useState() {
	const state = inject(STATE_SYMBOL);
	if (!state) throw new Error("No state provided.");
	return state;
}
//#endregion
export { STATE_SYMBOL, createState, useState };

//# sourceMappingURL=state.js.map