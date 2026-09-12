import type { ModalState } from '@scalar/components/modal';
import type { HttpMethod } from '@scalar/helpers/http/http-methods';
import type { ClientPlugin } from '@scalar/oas-utils/helpers';
import type { WorkspaceStore } from '@scalar/workspace-store/client';
import { type WorkspaceEventBus } from '@scalar/workspace-store/events';
import type { OpenApiDocument } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
import { type ComputedRef, type MaybeRefOrGetter, type Ref } from 'vue';
import { type UseModalSidebarReturn } from '../../../v2/features/modal/hooks/use-modal-sidebar.js';
import type { ApiClientOptions, ApiClientOptionsRef } from '../../../v2/types/options';
export type ModalProps = {
    /** The workspace store must be initialized and passed in */
    workspaceStore: WorkspaceStore;
    /** The document must be initialized and passed in. OpenAPI-only — the modal has no AsyncAPI path. */
    document: ComputedRef<OpenApiDocument | null>;
    /** The path must be initialized and passed in */
    path: ComputedRef<string | undefined>;
    /** The event bus for handling all events */
    eventBus: WorkspaceEventBus;
    /** The method must be initialized and passed in */
    method: ComputedRef<HttpMethod | undefined>;
    /** The example name must be initialized and passed in */
    exampleName: ComputedRef<string | undefined>;
    /** Selected anyOf/oneOf request-body variants keyed by schema path */
    requestBodyCompositionSelection: Ref<Record<string, number>>;
    /** Controls the visibility of the modal */
    modalState: ModalState;
    /** The sidebar state must be initialized and passed in */
    sidebarState: UseModalSidebarReturn;
    /** Api client plugins to include in the modal */
    plugins: ClientPlugin[];
    /** Subset of the configuration options for the modal */
    options: MaybeRefOrGetter<ApiClientOptions>;
};
/**
 * Scalar Api Client Modal
 *
 * This component is used to render the API Client Modal
 */
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<Omit<ModalProps, "options"> & {
    options: ApiClientOptionsRef;
}, {
    sidebarWidth: ComputedRef<number>;
    environment: ComputedRef<import("@scalar/workspace-store/schemas/extensions/document/x-scalar-environments").XScalarEnvironment>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<Omit<ModalProps, "options"> & {
    options: ApiClientOptionsRef;
}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
//# sourceMappingURL=Modal.vue.d.ts.map