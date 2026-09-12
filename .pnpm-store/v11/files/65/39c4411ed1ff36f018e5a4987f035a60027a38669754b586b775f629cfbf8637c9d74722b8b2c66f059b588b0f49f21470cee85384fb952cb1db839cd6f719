import type { HttpMethod as HttpMethodType } from '@scalar/helpers/http/http-methods';
import type { ServerMeta, WorkspaceEventBus } from '@scalar/workspace-store/events';
import type { XScalarEnvironment } from '@scalar/workspace-store/schemas/extensions/document/x-scalar-environments';
import type { ServerObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
import type { ClientLayout } from '../../../../v2/types/layout';
import { type History } from './AddressBarHistory.vue.js';
/**
 * AddressBar component
 * This component is used to display the address bar for the operation block
 * It is used to display the path, method, server, and history for the operation
 */
declare const _default: typeof __VLS_export;
export default _default;
export type AddressBarProps = {
    /** Current request path */
    path: string;
    /** Current request method */
    method: HttpMethodType;
    /** Openapi document slug */
    documentSlug: string;
    /** Currently selected example key for the current operation */
    exampleKey: string;
    /** Currently selected server */
    server: ServerObject | null;
    /** Server list available for operation/document */
    servers: ServerObject[];
    /** List of request history */
    history: History[];
    /** Client layout */
    layout: ClientLayout;
    /** Event bus */
    eventBus: WorkspaceEventBus;
    /** Environment */
    environment: XScalarEnvironment;
    /** Meta information for the server */
    serverMeta: ServerMeta;
};
declare const __VLS_export: import("vue").DefineComponent<AddressBarProps, {
    methodConflict: import("vue").Ref<"head" | "delete" | "get" | "options" | "patch" | "post" | "put" | "trace" | null, "head" | "delete" | "get" | "options" | "patch" | "post" | "put" | "trace" | null>;
    pathConflict: import("vue").Ref<string | null, string | null>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "select:history:item": (payload: {
        index: number;
    }) => any;
    execute: () => any;
}, string, import("vue").PublicProps, Readonly<AddressBarProps> & Readonly<{
    "onSelect:history:item"?: ((payload: {
        index: number;
    }) => any) | undefined;
    onExecute?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
//# sourceMappingURL=AddressBar.vue.d.ts.map