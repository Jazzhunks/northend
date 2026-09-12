import type { HttpMethod } from '@scalar/helpers/http/http-methods';
import type { ServerMeta, WorkspaceEventBus } from '@scalar/workspace-store/events';
import type { XScalarEnvironment } from '@scalar/workspace-store/schemas/extensions/document/x-scalar-environments';
import type { ServerObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
import { type History } from '../../../../v2/blocks/scalar-address-bar-block/index.js';
import type { ClientLayout } from '../../../../v2/types/layout';
/**
  Operation block header: address bar, environment selector, and modal controls.

  Renders the top bar for the API client operation view: URL/method (AddressBar),
  optional environment selector, optional "Open API Client" button in modal layout,
  and close button for modal. Layout and visibility depend on `layout` and `source` props.
 */
export type HeaderProps = {
    /** Current request path */
    path: string;
    /** Current request method */
    method: HttpMethod;
    /** Client layout */
    layout: ClientLayout;
    /** Hides the client button on the header */
    hideClientButton?: boolean;
    /** Client integration  */
    integration?: string | null;
    /** Openapi document slug */
    documentSlug: string;
    /** Currently selected example key for the current operation */
    exampleKey: string;
    /** Openapi document url for `modal` mode to open the client app */
    documentUrl?: string;
    /** Client source */
    source?: 'gitbook' | 'api-reference';
    /** Currently selected server */
    server: ServerObject | null;
    /** Server list available for operation/document */
    servers: ServerObject[];
    /** List of request history */
    history: History[];
    /** Event bus */
    eventBus: WorkspaceEventBus;
    /** Environment list */
    environments?: string[];
    /** Currently selected environment */
    activeEnvironment?: string;
    /** Environment variables */
    environment: XScalarEnvironment;
    /** Meta information for the server */
    serverMeta: ServerMeta;
};
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<HeaderProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "select:history:item": (payload: {
        index: number;
    }) => any;
    execute: () => any;
    "add:environment": () => any;
    "navigate:settings": () => any;
}, string, import("vue").PublicProps, Readonly<HeaderProps> & Readonly<{
    "onSelect:history:item"?: ((payload: {
        index: number;
    }) => any) | undefined;
    onExecute?: (() => any) | undefined;
    "onAdd:environment"?: (() => any) | undefined;
    "onNavigate:settings"?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
//# sourceMappingURL=Header.vue.d.ts.map