import { type Ref } from 'vue';
import { type RegistryDocument } from './state/state.js';
import { type ChatMode } from './types';
type __VLS_Props = {
    registryDocuments: RegistryDocument[];
    registryUrl: string;
    dashboardUrl: string;
    platformProxyUrl: string;
    baseUrl: string;
    mode?: ChatMode;
    getAccessToken?: () => string;
    getAgentKey?: () => string;
    getActiveDocumentJson?: () => string;
    isLoggedIn?: Ref<boolean>;
    prefilledMessage?: Ref<string>;
    hideAddApi?: boolean;
};
declare const state: {
    prompt: Ref<string>;
    chat: import("@ai-sdk/vue").Chat<import("ai").UIMessage<unknown, import("ai").UIDataTypes, import("./state/state.js").Tools>>;
    workspaceStore: import("@scalar/workspace-store/client").WorkspaceStore;
    loading: import("vue").ComputedRef<boolean>;
    settingsModal: import("@scalar/components/modal").ModalState;
    eventBus: import("@scalar/workspace-store/events").WorkspaceEventBus;
    proxyUrl: import("vue").ComputedRef<string>;
    proxyUrlRaw: Ref<string | undefined>;
    config: import("vue").ComputedRef<import("@scalar/types/api-reference").ApiReferenceConfigurationRaw>;
    registryUrl: string;
    dashboardUrl: string;
    baseUrl: string;
    platformProxyUrl: string;
    isLoggedIn?: Ref<boolean>;
    registryDocuments: Ref<import("./entities/index.js").ApiMetadata[]>;
    pendingDocuments: Record<string, boolean>;
    mode: ChatMode;
    terms: {
        accepted: Ref<boolean>;
        accept: () => void;
    };
    addDocument: (document: {
        namespace: string;
        slug: string;
        removable?: boolean;
        tmp?: boolean;
    }) => Promise<void>;
    addDocumentAsync: (document: {
        namespace: string;
        slug: string;
        removable?: boolean;
    }) => Promise<void>;
    removeDocument: (document: {
        namespace: string;
        slug: string;
    }) => void;
    getAccessToken?: () => string;
    getAgentKey?: () => string;
    api: import("./api.js").Api;
    uploadedTmpDocumentUrl: Ref<string | undefined>;
    curatedDocuments: Ref<import("./entities/index.js").ApiMetadata[]>;
    getActiveDocumentJson?: () => string;
    hideAddApi?: boolean;
};
export type ChatExposed = {
    addDocumentAsync: typeof state.addDocumentAsync;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, ChatExposed, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    uploadApi: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onUploadApi?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=App.vue.d.ts.map