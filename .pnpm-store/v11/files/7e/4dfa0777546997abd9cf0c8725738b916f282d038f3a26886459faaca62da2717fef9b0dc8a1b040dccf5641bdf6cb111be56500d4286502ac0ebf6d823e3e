import { Chat } from '@ai-sdk/vue';
import { type ModalState } from '@scalar/components/modal';
import type { ApiReferenceConfigurationRaw } from '@scalar/types/api-reference';
import { type WorkspaceStore } from '@scalar/workspace-store/client';
import type { WorkspaceEventBus } from '@scalar/workspace-store/events';
import { type UIDataTypes, type UIMessage } from 'ai';
import { type ComputedRef, type InjectionKey, type Ref } from 'vue';
import { type Api } from '../api.js';
import type { ApiMetadata } from '../entities/registry/document.js';
import type { ASK_FOR_AUTHENTICATION_TOOL_NAME, AskForAuthenticationInput } from '../entities/tools/ask-for-authentication.js';
import { EXECUTE_CLIENT_SIDE_REQUEST_TOOL_NAME, type ExecuteClientSideRequestToolInput, type ExecuteClientSideRequestToolOutput } from '../entities/tools/execute-request.js';
import type { GetOpenAPISpecsSummaryToolOutput, SUMMARIZE_OPENAPI_SPECS_TOOL_NAME } from '../entities/tools/get-openapi-specs-summary.js';
import type { SEARCH_OPENAPI_OPERATIONS_TOOL_NAME, SearchOpenAPIOperationsToolInput, SearchOpenAPIOperationsToolOutput } from '../entities/tools/search-openapi-operations.js';
import type { ChatMode } from '../types';
export type RegistryDocument = {
    namespace: string;
    slug: string;
};
export type Tools = {
    [SEARCH_OPENAPI_OPERATIONS_TOOL_NAME]: {
        input: SearchOpenAPIOperationsToolInput;
        output: SearchOpenAPIOperationsToolOutput;
    };
    [EXECUTE_CLIENT_SIDE_REQUEST_TOOL_NAME]: {
        input: ExecuteClientSideRequestToolInput;
        output: ExecuteClientSideRequestToolOutput;
    };
    [SUMMARIZE_OPENAPI_SPECS_TOOL_NAME]: {
        input: object;
        output: GetOpenAPISpecsSummaryToolOutput;
    };
    [ASK_FOR_AUTHENTICATION_TOOL_NAME]: {
        input: AskForAuthenticationInput;
        output: unknown;
    };
};
export declare const STATE_SYMBOL: InjectionKey<State>;
type State = {
    prompt: Ref<string>;
    chat: Chat<UIMessage<unknown, UIDataTypes, Tools>>;
    workspaceStore: WorkspaceStore;
    loading: ComputedRef<boolean>;
    settingsModal: ModalState;
    eventBus: WorkspaceEventBus;
    proxyUrl: ComputedRef<string>;
    proxyUrlRaw: Ref<string | undefined>;
    config: ComputedRef<ApiReferenceConfigurationRaw>;
    registryUrl: string;
    dashboardUrl: string;
    baseUrl: string;
    platformProxyUrl: string;
    isLoggedIn?: Ref<boolean>;
    registryDocuments: Ref<ApiMetadata[]>;
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
    api: Api;
    uploadedTmpDocumentUrl: Ref<string | undefined>;
    curatedDocuments: Ref<ApiMetadata[]>;
    getActiveDocumentJson?: () => string;
    hideAddApi?: boolean;
};
export declare function createState({ initialRegistryDocuments, registryUrl, dashboardUrl, platformProxyUrl, baseUrl, mode, isLoggedIn, getAccessToken, getAgentKey, getActiveDocumentJson, prefilledMessageRef, hideAddApi, }: {
    initialRegistryDocuments: {
        namespace: string;
        slug: string;
    }[];
    registryUrl: string;
    dashboardUrl: string;
    platformProxyUrl: string;
    baseUrl: string;
    mode: ChatMode;
    isLoggedIn?: Ref<boolean>;
    getAccessToken?: () => string;
    getAgentKey?: () => string;
    getActiveDocumentJson?: () => string;
    prefilledMessageRef?: Ref<string>;
    hideAddApi?: boolean;
}): State;
export declare function useState(): State;
export {};
//# sourceMappingURL=state.d.ts.map