import type { AsyncApiChannelObject } from '@scalar/types/asyncapi/3.1';
import type { SelectedSecurity } from '../entities/auth/index.js';
import type { AuthMeta } from '../events/index.js';
import type { SecuritySchemeObjectSecret } from '../request-example/builder/security/secret-types.js';
import type { MergedSecuritySchemes } from '../request-example/context/security/merge-security.js';
import type { XScalarEnvironment } from '../schemas/extensions/document/x-scalar-environments.js';
import type { SecurityRequirementObject } from '../schemas/v3.1/strict/security-requirement.js';
import type { ChannelMessageEntry } from './get-all-channel-messages.js';
import type { ChannelOperationSummary } from './get-channel-operations.js';
import type { ChannelParametersContext } from './get-channel-parameters.js';
import type { AsyncApiServerEntry } from './servers.js';
export type ChannelConnectionMeta = {
    channelName: string;
};
export type BuildChannelConnectionContext = {
    channel: AsyncApiChannelObject;
    channelName: string;
    channelAddress: string;
    /** Operations on this channel from the AsyncAPI description (reference only). */
    operations: ChannelOperationSummary[];
    messages: ChannelMessageEntry[];
    selectedMessage: ChannelMessageEntry | null;
    servers: {
        list: AsyncApiServerEntry[];
        selected: AsyncApiServerEntry | null;
    };
    connectionUrl: string;
    parameters: ChannelParametersContext;
    security: {
        schemes: MergedSecuritySchemes;
        requirements: SecurityRequirementObject[];
        selected: SelectedSecurity;
        selectedSchemes: SecuritySchemeObjectSecret[];
        meta: AuthMeta;
    };
    environment: {
        name: string | null;
        environment: XScalarEnvironment;
    };
};
//# sourceMappingURL=types.d.ts.map