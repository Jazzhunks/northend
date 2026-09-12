import type { HttpMethod } from '@scalar/helpers/http/http-methods';
import type { ClientPlugin } from '@scalar/oas-utils/helpers';
import type { WorkspaceStore } from '@scalar/workspace-store/client';
import type { WorkspaceEventBus } from '@scalar/workspace-store/events';
import type { XScalarEnvironment } from '@scalar/workspace-store/schemas/extensions/document/x-scalar-environments';
import type { OpenApiDocument } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
import { type MaybeRefOrGetter } from 'vue';
import type { ClientLayout } from '../../../v2/types/layout';
import type { ApiClientOptions } from '../../../v2/types/options';
/**
 * Operation example page
 *
 * Displays an operation with a specific example selected
 *  - View example request data
 *  - Modify example request data
 *  - Send example request
 */
declare const _default: typeof __VLS_export;
export default _default;
export type OperationProps = {
    /** The slug of the currently selected document in the workspace */
    documentSlug: string;
    /** The currently active document — OpenAPI-only, the operation page has no AsyncAPI path */
    document: OpenApiDocument | null;
    /** The workspace event bus */
    eventBus: WorkspaceEventBus;
    /** The layout of the client */
    layout: ClientLayout;
    /** The API path currently selected (e.g. "/users/{id}") */
    path?: string;
    /** The HTTP method for the currently selected API path (e.g. GET, POST) */
    method?: HttpMethod;
    /** The name of the currently selected example (for examples within an endpoint) */
    exampleName?: string;
    /** The currently active environment */
    environment: XScalarEnvironment;
    /** The workspace store */
    workspaceStore: WorkspaceStore;
    /** Client plugins */
    plugins: ClientPlugin[];
    /** App or modal options forwarded to operation/auth blocks */
    options?: MaybeRefOrGetter<ApiClientOptions>;
};
declare const __VLS_export: import("vue").DefineComponent<OperationProps & {
    /** Selected anyOf/oneOf request-body variants keyed by schema path */
    requestBodyCompositionSelection?: Record<string, number>;
}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<OperationProps & {
    /** Selected anyOf/oneOf request-body variants keyed by schema path */
    requestBodyCompositionSelection?: Record<string, number>;
}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
//# sourceMappingURL=Operation.vue.d.ts.map