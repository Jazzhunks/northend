import { type ModalState } from '@scalar/components/modal';
import { type ClientPlugin } from '@scalar/oas-utils/helpers';
import type { WorkspaceStore } from '@scalar/workspace-store/client';
import { type WorkspaceEventBus } from '@scalar/workspace-store/events';
import { type App, type MaybeRefOrGetter } from 'vue';
import { type RoutePayload } from '../../../../v2/features/modal/helpers/resolve-route-parameters.js';
import type { ApiClientOptions } from '../../../../v2/types/options';
type CreateApiClientOptions = {
    /** Element to mount the client modal to. */
    el: HTMLElement | null;
    /**
     * Will attempt to mount the references immediately.
     * For SSR this may need to be disabled and handled manually on the client side.
     */
    mountOnInitialize?: boolean;
    /** You can pass in an event bus if you have one already, or we will create one */
    eventBus?: WorkspaceEventBus;
    /** The workspace store must be initialized and passed in. */
    workspaceStore: WorkspaceStore;
    /** Api client plugins to include in the modal */
    plugins?: ClientPlugin[];
    /** Subset of the configuration options for the modal, if you want it to be reactive ensure its a ref */
    options?: MaybeRefOrGetter<ApiClientOptions>;
};
export type ApiClientModal = {
    app: App;
    open: (payload?: RoutePayload) => void;
    mount: (mountingEl: HTMLElement | null) => void;
    route: (payload: RoutePayload) => void;
    updateOptions: (nextOptions: ApiClientOptions, overwrite?: boolean) => void;
    modalState: ModalState;
};
/**
 * Creates the API Client Modal.
 *
 * The modal does not require a router. Instead, navigation is handled by setting
 * active entities directly through the returned `route` function.
 */
export declare const createApiClientModal: ({ el, eventBus, mountOnInitialize, plugins, workspaceStore, options, }: CreateApiClientOptions) => ApiClientModal;
export {};
//# sourceMappingURL=create-api-client-modal.d.ts.map