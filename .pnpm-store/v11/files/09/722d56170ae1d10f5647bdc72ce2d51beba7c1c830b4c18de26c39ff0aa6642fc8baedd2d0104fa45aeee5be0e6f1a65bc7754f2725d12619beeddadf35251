import type { TraversedDocument, TraversedOperation, TraversedWebhook, WithParent } from '../../schemas/navigation.js';
export type OperationEntriesMap = Map<string, (WithParent<TraversedOperation> | WithParent<TraversedWebhook>)[]>;
/**
 * Builds a map of all operations and webhooks in a document, indexed by path/name and method.
 *
 * This function recursively traverses the document structure and collects all operation and webhook
 * entries. Multiple entries can share the same path|method key (for example, when operations are
 * duplicated across different tags or groups).
 *
 * ~Performance note: If this function is called frequently, consider generating this map once when
 * creating the sidebar state rather than recalculating it in mutators.~
 * Update: we are now generating it features/operation and its drilled down from there
 *
 * @param document - The traversed OpenAPI document to extract operations from
 * @returns A map where keys are `path|method` (for operations) or `name|method` (for webhooks),
 *          and values are arrays of matching entries. The pipe separator is used to create a
 *          unique composite key from the two parts.
 *
 * @example
 * const entries = getOperationEntries(document)
 * const getUsers = entries.get('/users|get') // Array of all GET /users operations
 */
export declare const getOperationEntries: (document: TraversedDocument) => OperationEntriesMap;
//# sourceMappingURL=get-operation-entries.d.ts.map