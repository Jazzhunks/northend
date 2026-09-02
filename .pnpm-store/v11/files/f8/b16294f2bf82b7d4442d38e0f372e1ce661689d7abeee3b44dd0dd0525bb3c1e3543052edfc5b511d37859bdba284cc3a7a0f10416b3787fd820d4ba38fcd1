import type { ClientPlugin } from '@scalar/oas-utils/helpers';
import type { WorkspaceEventBus } from '@scalar/workspace-store/events';
import type { RequestPayload } from '@scalar/workspace-store/request-example';
import type { ResponseInstance } from '../../../v2/blocks/operation-block/helpers/send-request.js';
import type { ClientLayout } from '../../../v2/types/layout';
type __VLS_Props = {
    /** Preprocessed response */
    response: ResponseInstance | null;
    /** Original request as a [url, RequestInit] tuple */
    requestPayload: RequestPayload | null;
    /** Client layout */
    layout: ClientLayout;
    /** Total number of performed requests */
    totalPerformedRequests: number;
    /** Application version */
    appVersion: string;
    /** Registered app plugins */
    plugins: ClientPlugin[];
    /** Workspace event bus */
    eventBus: WorkspaceEventBus;
};
declare const responseSections: readonly ["Cookies", "Headers", "Body"];
type Filter = 'All' | (typeof responseSections)[number];
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {
    responseHeaders: import("vue").ComputedRef<{
        name: string;
        value: string;
    }[]>;
    responseCookies: import("vue").ComputedRef<{
        name: string;
        value: string;
    }[]>;
    requestHeaders: import("vue").ComputedRef<{
        name: string;
        value: string;
        required: boolean;
    }[]>;
    shouldVirtualize: import("vue").ComputedRef<boolean>;
    activeFilter: import("vue").Ref<Filter, Filter>;
    filters: import("vue").ComputedRef<Filter[]>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=ResponseBlock.vue.d.ts.map