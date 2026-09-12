import type { ApiReferenceConfiguration } from '@scalar/types/api-reference';
import type { WorkspaceStore } from '@scalar/workspace-store/client';
import type { Ref } from 'vue';
import type { Api } from '../api.js';
import type { ApiMetadata } from '../entities/registry/document.js';
export declare const loadDocument: (args_0: {
    namespace: string;
    slug: string;
    workspaceStore: WorkspaceStore;
    getAccessToken?: () => string;
    registryDocuments: Ref<ApiMetadata[]>;
    registryUrl: string;
    config: Partial<ApiReferenceConfiguration>;
    api: Api;
    removable?: boolean;
}) => Promise<{
    success: false;
    error: null;
} | {
    success: false;
    error: import("../entities/index.js").AgentChatError<"FAILED_TO_FETCH", unknown>;
} | {
    success: false;
    error: import("../entities/index.js").AgentChatError<string, string>;
    data?: undefined;
} | {
    success: true;
    data: {
        id: string;
        title: string;
        namespace: string;
        currentVersion: string;
        logoUrl: string | null;
        slug: string;
    };
}> | import("neverpanic").Result<never, import("../entities/index.js").AgentChatError<"UNABLE_TO_LOAD_DOCUMENT", unknown>>;
//# sourceMappingURL=add-documents-to-store.d.ts.map