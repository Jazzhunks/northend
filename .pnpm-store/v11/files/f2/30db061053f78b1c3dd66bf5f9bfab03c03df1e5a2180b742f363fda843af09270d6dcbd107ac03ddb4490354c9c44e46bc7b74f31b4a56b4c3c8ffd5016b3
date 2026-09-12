import type { HttpMethod as HttpMethodType } from '@scalar/helpers/http/http-methods';
import { type ClientPlugin } from '@scalar/oas-utils/helpers';
import { type AvailableClients } from '@scalar/types/snippetz';
import type { WorkspaceStore } from '@scalar/workspace-store/client';
import type { SelectedSecurity } from '@scalar/workspace-store/entities/auth';
import type { HistoryEntry } from '@scalar/workspace-store/entities/history/schema';
import type { AuthMeta, ServerMeta, WorkspaceEventBus } from '@scalar/workspace-store/events';
import { type MergedSecuritySchemes, type SecuritySchemeObjectSecret } from '@scalar/workspace-store/request-example';
import type { XScalarEnvironment } from '@scalar/workspace-store/schemas/extensions/document/x-scalar-environments';
import type { XScalarCookie } from '@scalar/workspace-store/schemas/extensions/general/x-scalar-cookies';
import type { OpenApiDocument, ServerObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
import type { OperationObject } from '@scalar/workspace-store/schemas/v3.1/strict/operation';
import type { ModalProps } from '../../../v2/features/modal/Modal.vue.js';
import type { ClientLayout } from '../../../v2/types/layout';
/**
 * OperationBlock
 *
 * Orchestrates the operation view by wiring together the Header, OperationBlock,
 * and ResponseBlock. Forwards user interactions to the workspace event bus and
 * passes through configuration such as auth, servers, plugins, and environment.
 * This component keeps the Operation page lean by centralizing event emission
 * and prop wiring between the blocks.
 *
 * Notable behavior:
 * - Uses operation['x-scalar-method'] and operation['x-scalar-path'] to provide
 *   draft overrides for the UI when present.
 */
declare const _default: typeof __VLS_export;
export default _default;
export type OperationBlockProps = {
    /** Event bus */
    eventBus: WorkspaceEventBus;
    /** Application version */
    appVersion: string;
    /** Openapi document */
    document: OpenApiDocument;
    /** Openapi document slug */
    documentSlug: string;
    /** Workspace cookies */
    workspaceCookies: XScalarCookie[];
    /** Document cookies */
    documentCookies: XScalarCookie[];
    /** Current request path */
    path: string;
    /** Current request method */
    method: HttpMethodType;
    /** HTTP clients */
    httpClients: AvailableClients;
    /** The history for the operation */
    history?: HistoryEntry[];
    /** Client layout */
    layout: ClientLayout;
    /** Currently selected server */
    server: ServerObject | null;
    /** Currently selected client */
    selectedClient: WorkspaceStore['workspace']['x-scalar-default-client'];
    /** Server list available for operation/document */
    servers: ServerObject[];
    /** Meta information for the server */
    serverMeta: ServerMeta;
    /** Hides the client button on the header */
    hideClientButton?: boolean;
    /** Client integration  */
    integration?: string | null;
    /** Openapi document url for `modal` mode to open the client app */
    documentUrl?: string;
    /** Client source */
    source?: 'gitbook' | 'api-reference';
    /** Operation object */
    operation: OperationObject;
    /** Currently selected example key for the current operation */
    exampleKey: string;
    /** Meta information for the auth update */
    authMeta: AuthMeta;
    /** Document defined security schemes */
    securitySchemes: MergedSecuritySchemes;
    /** Client plugins */
    plugins: ClientPlugin[];
    /** Environment list */
    environments?: string[];
    /** Currently selected environment */
    activeEnvironment?: string;
    /** For environment variables in the inputs */
    environment: XScalarEnvironment;
    /** The proxy URL for sending requests */
    proxyUrl: string;
    /** Currently selected security */
    selectedSecurity: SelectedSecurity;
    /** Currently selected security schemes */
    selectedSecuritySchemes: SecuritySchemeObjectSecret[];
    /** Security requirements */
    securityRequirements: OpenApiDocument['security'];
    /** Default headers */
    defaultHeaders: Record<string, string>;
    /** Selected anyOf/oneOf request-body variants keyed by schema path */
    requestBodyCompositionSelection?: Record<string, number>;
    /** Subset of config options for the modal */
    options?: ModalProps['options'];
};
declare const __VLS_export: import("vue").DefineComponent<OperationBlockProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<OperationBlockProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
//# sourceMappingURL=OperationBlock.vue.d.ts.map