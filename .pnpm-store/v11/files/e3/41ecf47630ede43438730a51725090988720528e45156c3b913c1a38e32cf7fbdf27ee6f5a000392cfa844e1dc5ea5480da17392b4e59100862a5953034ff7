import { canHaveOrder, getOpenapiObject } from '../../navigation/helpers/get-openapi-object.js';
import { getParentEntry } from '../../navigation/helpers/get-parent-entry.js';
import { isOpenApiDocument } from '../../schemas/type-guards.js';
/**
 * Updates the order ID of an entry (operation or tag) in the sidebar.
 * Used when changing path, method, or tag name so we do not lose the sidebar ordering.
 *
 * Accepts either operation/webhook entries or tag entries via a discriminated union,
 * so the correct ID generation props are enforced at the call site.
 */
export const updateOrderIds = ({ store, generateId, ...rest }) => {
    // Loop over the entries and replace the ID in the x-scalar-order with the new ID
    rest.entries?.forEach((entry) => {
        if (!canHaveOrder(entry.parent)) {
            return;
        }
        // Ensure we have an x-scalar-order property
        const parentOpenAPIObject = getOpenapiObject({ store, entry: entry.parent });
        if (!parentOpenAPIObject || !('x-scalar-order' in parentOpenAPIObject)) {
            return;
        }
        const order = parentOpenAPIObject['x-scalar-order'];
        const index = order?.indexOf(entry.id);
        if (!Array.isArray(order) || typeof index !== 'number' || index < 0) {
            return;
        }
        // Tag entries: generate a new tag ID using the updated tag object
        if ('tag' in rest) {
            const oldTagId = entry.id;
            const newTagId = generateId({
                type: 'tag',
                parentId: entry.parent.id,
                tag: rest.tag,
            });
            order[index] = newTagId;
            // Ensure we update the children as well, so we don't lose the sidebar ordering when it rebuilds
            if (oldTagId !== newTagId) {
                const documentEntry = getParentEntry('document', entry);
                const document = documentEntry ? store.workspace.documents[documentEntry.name] : null;
                const renamedTagObj = isOpenApiDocument(document)
                    ? document.tags?.find((t) => t.name === rest.tag.name)
                    : undefined;
                const childOrder = renamedTagObj?.['x-scalar-order'];
                if (renamedTagObj && Array.isArray(childOrder)) {
                    const oldPrefix = `${oldTagId}/`;
                    const newPrefix = `${newTagId}/`;
                    renamedTagObj['x-scalar-order'] = childOrder.map((id) => id.startsWith(oldPrefix) ? newPrefix + id.slice(oldPrefix.length) : id);
                }
            }
            return;
        }
        // Operation/webhook entries: generate a new operation ID with the updated path and method
        const parentTag = entry.parent.type === 'tag' && 'name' in parentOpenAPIObject
            ? { tag: parentOpenAPIObject, id: entry.parent.id }
            : undefined;
        order[index] = generateId({
            type: 'operation',
            path: rest.path,
            method: rest.method,
            operation: rest.operation,
            parentId: entry.parent.id,
            parentTag,
        });
    });
};
