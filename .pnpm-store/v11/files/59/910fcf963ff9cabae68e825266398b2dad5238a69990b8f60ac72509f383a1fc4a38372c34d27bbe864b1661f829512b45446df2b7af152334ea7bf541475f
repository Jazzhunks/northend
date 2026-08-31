import type { AuthenticationConfiguration } from '@scalar/types/api-reference';
import type { BuildChannelConnectionContext, ChannelConnectionMeta } from '../channel-example/types.js';
import type { WorkspaceStore } from '../client.js';
import type { Result } from '../request-example/types.js';
import type { WorkspaceDocument } from '../schemas/workspace.js';
/**
 * Builds context for testing a WebSocket channel (Postman-style): one connection per channel,
 * with AsyncAPI messages, servers, and parameters as the data store.
 */
export declare const getChannelConnectionContext: (workspaceStore: WorkspaceStore, documentName: string, channelConnectionMeta: ChannelConnectionMeta, options?: Partial<{
    pathParameters: Record<string, string>;
    queryParameters: Record<string, string>;
    authentication: AuthenticationConfiguration;
    fallbackDocument: WorkspaceDocument | null;
}>) => Result<BuildChannelConnectionContext>;
//# sourceMappingURL=get-channel-connection-context.d.ts.map