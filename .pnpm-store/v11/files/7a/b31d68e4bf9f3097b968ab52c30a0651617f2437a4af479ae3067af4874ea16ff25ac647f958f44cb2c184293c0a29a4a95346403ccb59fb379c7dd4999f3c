import type { WorkspaceStore } from '../../client.js';
import type { WorkspaceDocument } from '../../schemas.js';
import type { TraversedDocument, TraversedEntry, TraversedOperation, TraversedTag } from '../../schemas/navigation.js';
import type { OperationObject, TagObject } from '../../schemas/v3.1/strict/openapi-document.js';
type TraversedOrderable = TraversedDocument | TraversedTag | TraversedOperation;
type GetOpenapiObject<Entry extends TraversedOrderable> = Entry extends TraversedDocument ? WorkspaceDocument : Entry extends TraversedTag ? TagObject : Entry extends TraversedOperation ? OperationObject : never;
/** Type guard which checks if the entry has an x-scalar-order property */
export declare const canHaveOrder: (entry: TraversedEntry) => entry is TraversedOrderable;
/**
 * Retrieves the corresponding OpenAPI object (document, tag, or operation) from the workspace store based on the provided entry.
 *
 * This helper abstracts the common lookup logic for working with sidebar/drag-and-drop entries and their associated OpenAPI objects.
 * Returns `null` when the lookup cannot be completed (e.g., document/tag/operation not found).
 *
 * @template Entry Either TraversedDocument, TraversedTag, or TraversedOperation.
 * @param store - The workspace store containing loaded documents.
 * @param entry - The sidebar entry (document, tag, or operation).
 * @returns The corresponding OpenAPI object (WorkspaceDocument, TagObject, or OperationObject) or `null` if not found.
 *
 * @example
 * // For a Document entry:
 * const document = getOpenapiObject({ store, entry: documentEntry })
 *
 * // For a Tag entry:
 * const tag = getOpenapiObject({ store, entry: tagEntry })
 *
 * // For an Operation entry:
 * const operation = getOpenapiObject({ store, entry: operationEntry })
 */
export declare const getOpenapiObject: <Entry extends TraversedOrderable>({ store, entry, }: {
    store: WorkspaceStore;
    entry: Entry;
}) => GetOpenapiObject<Entry> | null;
export {};
//# sourceMappingURL=get-openapi-object.d.ts.map