import { getPathItemOperation } from '../../helpers/for-each-path-item-operation.js';
import { getResolvedRef } from '../../helpers/get-resolved-ref.js';
import { isOpenApiDocument } from '../../schemas/type-guards.js';
import { getParentEntry } from './get-parent-entry.js';
/** Type guard which checks if the entry has an x-scalar-order property */
export const canHaveOrder = (entry) => entry.type === 'document' || entry.type === 'tag' || entry.type === 'operation';
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
export const getOpenapiObject = ({ store, entry, }) => {
    const documentEntry = getParentEntry('document', entry);
    if (!documentEntry) {
        return null;
    }
    const document = store.workspace.documents[documentEntry.name];
    if (!document) {
        return null;
    }
    if (entry.type === 'document') {
        return document;
    }
    // Tag and operation lookups only make sense on OpenAPI documents.
    if (!isOpenApiDocument(document)) {
        return null;
    }
    if (entry.type === 'tag') {
        // Find the tag by name in the document's tags array
        return document.tags?.find((tag) => tag.name === entry.name) ?? null;
    }
    if (entry.type === 'operation') {
        // Fetch and resolve the referenced operation object at the given path/method
        return (getResolvedRef(getPathItemOperation(document.paths?.[entry.path], entry.method)) ?? null);
    }
    // If entry type is unknown, return null
    return null;
};
