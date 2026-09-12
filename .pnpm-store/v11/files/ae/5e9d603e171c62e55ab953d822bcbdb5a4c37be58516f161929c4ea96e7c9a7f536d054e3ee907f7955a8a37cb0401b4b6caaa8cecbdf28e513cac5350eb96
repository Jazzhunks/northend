export declare function createAuthorizationHeaders({ getAccessToken, getAgentKey, }: {
    getAccessToken?: () => string;
    getAgentKey?: () => string;
}): {
    'x-scalar-agent-key'?: string | undefined;
    Authorization?: string | undefined;
};
/** Minimal set of API requests needed for agent chat */
export declare function createApi({ baseUrl, getAccessToken, getAgentKey, }: {
    baseUrl: string;
    getAccessToken?: () => string;
    getAgentKey?: () => string;
}): {
    search: (query: string) => Promise<{
        success: false;
        error: import("./entities/index.js").AgentChatError<"FAILED_TO_FETCH", unknown>;
    } | import("neverpanic").Result<never, null> | {
        success: false;
        error: import("./entities/index.js").AgentChatError<string, string>;
        data?: undefined;
    } | {
        success: true;
        data: {
            results: {
                id: string;
                title: string;
                namespace: string;
                currentVersion: string;
                logoUrl: string | null;
                slug: string;
            }[];
        };
        error?: undefined;
    }>;
    getDocument: (params: {
        namespace: string;
        slug: string;
    }) => Promise<{
        success: false;
        error: import("./entities/index.js").AgentChatError<"FAILED_TO_FETCH", unknown>;
    } | import("neverpanic").Result<never, null> | {
        success: false;
        error: import("./entities/index.js").AgentChatError<string, string>;
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
        error?: undefined;
    }>;
    getKeyDocuments: () => Promise<{
        success: false;
        error: import("./entities/index.js").AgentChatError<"FAILED_TO_FETCH", unknown>;
    } | import("neverpanic").Result<never, null> | {
        success: false;
        error: import("./entities/index.js").AgentChatError<string, string>;
        data?: undefined;
    } | {
        success: true;
        data: {
            documents: {
                id: string;
                title: string;
                namespace: string;
                currentVersion: string;
                logoUrl: string | null;
                slug: string;
            }[];
        };
        error?: undefined;
    }>;
    getCuratedDocuments: () => Promise<{
        success: false;
        error: import("./entities/index.js").AgentChatError<"FAILED_TO_FETCH", unknown>;
    } | import("neverpanic").Result<never, null> | {
        success: false;
        error: import("./entities/index.js").AgentChatError<string, string>;
        data?: undefined;
    } | {
        success: true;
        data: {
            results: {
                id: string;
                title: string;
                namespace: string;
                currentVersion: string;
                logoUrl: string | null;
                slug: string;
            }[];
        };
        error?: undefined;
    }>;
};
export type Api = ReturnType<typeof createApi>;
//# sourceMappingURL=api.d.ts.map