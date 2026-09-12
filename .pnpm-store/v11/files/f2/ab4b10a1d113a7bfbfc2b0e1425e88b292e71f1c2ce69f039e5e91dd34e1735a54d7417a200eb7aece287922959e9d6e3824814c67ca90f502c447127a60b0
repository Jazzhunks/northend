import type { HttpMethod } from '@scalar/helpers/http/http-methods';
import type { WorkspaceStore } from '../../client.js';
import type { IdGenerator, TraversedOperation, TraversedTag, TraversedWebhook, WithParent } from '../../schemas/navigation.js';
import type { TagObject } from '../../schemas/v3.1/strict/openapi-document.js';
import type { OperationObject } from '../../schemas/v3.1/strict/operation.js';
type UpdateOrderIdParams = {
    store: WorkspaceStore;
    generateId: IdGenerator;
} & ({
    /** Operation or webhook entries to update the order ID for */
    entries: (WithParent<TraversedOperation> | WithParent<TraversedWebhook>)[];
    operation: OperationObject;
    method: HttpMethod;
    path: string;
} | {
    /** Tag entries to update the order ID for */
    entries: WithParent<TraversedTag>[];
    tag: TagObject;
});
/**
 * Updates the order ID of an entry (operation or tag) in the sidebar.
 * Used when changing path, method, or tag name so we do not lose the sidebar ordering.
 *
 * Accepts either operation/webhook entries or tag entries via a discriminated union,
 * so the correct ID generation props are enforced at the call site.
 */
export declare const updateOrderIds: ({ store, generateId, ...rest }: UpdateOrderIdParams) => void;
export {};
//# sourceMappingURL=update-order-ids.d.ts.map