import type { Result } from 'neverpanic';
import { type Static } from '@scalar/validation';
import type { AgentChatError } from '../../entities/error/constants.js';
export declare const EXECUTE_CLIENT_SIDE_REQUEST_TOOL_NAME: "execute-request";
export declare const executeClientSideRequestToolInputSchema: import("@scalar/validation").ObjectSchema<{
    method: import("@scalar/validation").StringSchema;
    path: import("@scalar/validation").StringSchema;
    headers: import("@scalar/validation").OptionalSchema<import("@scalar/validation").RecordSchema<import("@scalar/validation").StringSchema, import("@scalar/validation").StringSchema>>;
    body: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
    documentName: import("@scalar/validation").StringSchema;
    documentIdentifier: import("@scalar/validation").StringSchema;
}>;
export type ExecuteClientSideRequestToolInput = Static<typeof executeClientSideRequestToolInputSchema>;
export type ExecuteClientSideRequestToolOutput = Result<{
    status: number;
    responseBody?: unknown;
    headers: {};
}, AgentChatError<'FAILED_TO_PARSE_RESPONSE_BODY', {
    originalError: unknown;
}> | AgentChatError<'REQUEST_NOT_OK', {
    status: number;
    url: string;
    responseBody: unknown;
    headers: Record<string, string>;
}> | AgentChatError<'FAILED_TO_FETCH', {
    originalError: unknown;
}> | AgentChatError<'DOCUMENT_SETTINGS_COULD_NOT_BE_DETERMINED', {
    documentName: string;
    namespace: string;
    slug: string;
}> | AgentChatError<'FAILED_TO_DETERMINE_DOCUMENT', {
    namespace?: string;
    slug?: string;
    documentIdentifier: string;
}> | AgentChatError<'FAILED_TO_EXECUTE_REQUEST', unknown>>;
//# sourceMappingURL=execute-request.d.ts.map