import type { Chat } from '@ai-sdk/vue';
import type { SecuritySchemeObjectSecret } from '@scalar/workspace-store/request-example';
import type { ServerObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
import type { UIDataTypes, UIMessage } from 'ai';
import type { Tools } from '../state/state.js';
/**
 * Executes an HTTP request with the specified options, including method, path, headers, and security schemes, and returns the processed response.
 */
export declare const executeRequestTool: (args_0: {
    documentSettings: Record<string, {
        activeServer: ServerObject | null;
        securitySchemes: SecuritySchemeObjectSecret[];
    }>;
    toolCallId: string;
    chat: Chat<UIMessage<unknown, UIDataTypes, Tools>>;
    proxyUrl: string;
    input: {
        method: string;
        path: string;
        headers?: Record<string, string>;
        body?: string;
        documentName: string;
    };
}) => Promise<{
    success: true;
    data: never;
} | {
    success: false;
    error: import("../entities/index.js").AgentChatError<"FAILED_TO_PARSE_RESPONSE_BODY", {
        originalError: unknown;
    }>;
} | {
    success: false;
    error: import("../entities/index.js").AgentChatError<"REQUEST_NOT_OK", {
        status: number;
        url: string;
        responseBody: any;
        headers: {
            [k: string]: string;
        };
    }>;
    data?: undefined;
} | {
    success: true;
    data: {
        status: number;
        responseBody: any;
        headers: {
            [k: string]: string;
        };
    };
    error?: undefined;
} | {
    success: false;
    error: import("../entities/index.js").AgentChatError<"FAILED_TO_FETCH", {
        originalError: unknown;
    }>;
} | {
    success: false;
    error: import("../entities/index.js").AgentChatError<"DOCUMENT_SETTINGS_COULD_NOT_BE_DETERMINED", {
        documentName: string;
    }>;
}> | import("neverpanic").Result<never, import("../entities/index.js").AgentChatError<"FAILED_TO_EXECUTE_REQUEST", unknown>>;
//# sourceMappingURL=execute-request.d.ts.map