import type { AsyncApiChannelObject, AsyncApiOperationObject, AsyncApiParameterObject } from '@scalar/types/asyncapi/3.1';
export type ChannelParametersContext = {
    /** Resolved channel parameter definitions keyed by name. */
    definitions: Record<string, AsyncApiParameterObject>;
    /** Values substituted into the channel address path segments. */
    path: Record<string, string>;
    /** Values substituted into WebSocket handshake query parameters. */
    query: Record<string, string>;
};
/**
 * Builds default path and query parameter values from channel definitions and ws bindings.
 */
export declare const getChannelParameters: (channel: AsyncApiChannelObject, operation?: AsyncApiOperationObject | null, overrides?: Partial<Pick<ChannelParametersContext, "path" | "query">>) => ChannelParametersContext;
//# sourceMappingURL=get-channel-parameters.d.ts.map