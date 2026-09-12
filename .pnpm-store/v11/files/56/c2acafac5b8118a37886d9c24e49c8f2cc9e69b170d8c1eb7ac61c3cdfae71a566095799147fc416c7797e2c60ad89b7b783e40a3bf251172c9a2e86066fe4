import { forEachPathItemOperation, getPathItemOperation } from '../helpers/for-each-path-item-operation.js';
import { getResolvedRef } from '../helpers/get-resolved-ref.js';
import { unpackProxyObject } from '../helpers/unpack-proxy.js';
import { getNavigationOptions } from '../navigation/get-navigation-options.js';
import { getTagEntries } from '../navigation/helpers/get-tag-entries.js';
import { updateOrderIds } from '../navigation/helpers/update-order-ids.js';
import { isOpenApiDocument } from '../schemas/type-guards.js';
/**
 * Adds a new tag to the WorkspaceDocument's `tags` array.
 *
 * If the document or its tags property does not exist, the function safely no-ops or initializes `tags` as needed.
 *
 * @param document - The target WorkspaceDocument
 * @param payload - The name of the tag to add
 */
export const createTag = (store, payload) => {
    const document = store?.workspace.documents[payload.documentName];
    if (!isOpenApiDocument(document)) {
        console.error('Document not found', { payload, store });
        return;
    }
    if (!document.tags) {
        document.tags = [];
    }
    document.tags.push({
        name: payload.name,
    });
};
/**
 * Edits a tag in the WorkspaceDocument's
 *
 * @param document - The target WorkspaceDocument
 * @param payload - holds the old tag and the new name
 */
export const editTag = (store, payload) => {
    const document = store?.workspace.documents[payload.documentName];
    if (!store || !isOpenApiDocument(document)) {
        console.error('Document not found', { payload, store });
        return;
    }
    const documentNavigation = document['x-scalar-navigation'];
    if (!documentNavigation) {
        console.error('Document navigation missing', { payload, store });
        return;
    }
    const oldName = payload.tag.name;
    const newName = payload.newName;
    if (document.tags?.length) {
        // const plainTags = unpackProxyObject(document.tags, { depth: null })
        document.tags = document.tags.map((_tag) => {
            const tag = unpackProxyObject(_tag);
            return tag.name === oldName ? { ...tag, name: newName } : tag;
        });
    }
    // Update the tag name in all child operations and webhooks
    payload.tag.children?.forEach((child) => {
        // Operation
        if (child.type === 'operation') {
            const operation = getResolvedRef(getPathItemOperation(document.paths?.[child.path], child.method));
            if (operation && 'tags' in operation) {
                const plainTags = unpackProxyObject(operation.tags, { depth: null });
                operation.tags = plainTags?.map((tag) => (tag === oldName ? newName : tag));
            }
        }
        // Webhook
        else if (child.type === 'webhook') {
            const webhook = getResolvedRef(getPathItemOperation(document.webhooks?.[child.name], child.method));
            if (webhook && 'tags' in webhook) {
                const plainTags = unpackProxyObject(webhook.tags, { depth: null });
                webhook.tags = plainTags?.map((tag) => (tag === oldName ? newName : tag));
            }
        }
    });
    // Update x-tagGroups references to the renamed tag
    if (document['x-tagGroups']) {
        const plainGroups = unpackProxyObject(document['x-tagGroups'], { depth: null });
        document['x-tagGroups'] = plainGroups.map((group) => ({
            ...group,
            tags: group.tags.map((tag) => (tag === oldName ? newName : tag)),
        }));
    }
    /**
     * We don't pass navigation options as we don't have config on the client,
     * and we don't change path or method on the references
     */
    const { generateId } = getNavigationOptions(documentNavigation.name);
    /** Grabs all sidebar entries for the tag that is being renamed */
    const tagEntriesMap = getTagEntries(documentNavigation);
    const entries = tagEntriesMap.get(oldName);
    // Updates the order ID so we don't lose the sidebar ordering when it rebuilds.
    if (entries) {
        updateOrderIds({ store, tag: { name: newName }, generateId, entries });
    }
};
/**
 * Deletes a tag from the workspace
 *
 * Example:
 * ```ts
 * deleteTag({
 *   document,
 *   name: 'tag',
 * })
 * ```
 */
export const deleteTag = (workspace, payload) => {
    const document = workspace?.workspace.documents[payload.documentName];
    if (!isOpenApiDocument(document)) {
        return;
    }
    // Clear tags from all operations that have this tag
    Object.values(document.paths ?? {}).forEach((pathItemRef) => {
        forEachPathItemOperation(pathItemRef, (_method, operationRef) => {
            const resolvedOperation = getResolvedRef(operationRef);
            if ('tags' in resolvedOperation) {
                const plainTags = unpackProxyObject(resolvedOperation.tags, { depth: 1 });
                resolvedOperation.tags = plainTags?.filter((tag) => tag !== payload.name);
            }
        });
    });
    // Remove the tag from all webhooks that have this tag
    Object.values(document.webhooks ?? {}).forEach((pathItemRef) => {
        forEachPathItemOperation(pathItemRef, (_method, operationRef) => {
            const resolvedOperation = getResolvedRef(operationRef);
            const plainTags = unpackProxyObject(resolvedOperation.tags, { depth: 1 });
            resolvedOperation.tags = plainTags?.filter((tag) => tag !== payload.name);
        });
    });
    // Remove the tag from the document tags array
    const plainDocTags = unpackProxyObject(document.tags, { depth: null });
    document.tags = plainDocTags?.filter((tag) => tag.name !== payload.name);
};
export const tagMutatorsFactory = ({ store }) => {
    return {
        createTag: (payload) => createTag(store, payload),
        editTag: (payload) => editTag(store, payload),
        deleteTag: (payload) => deleteTag(store, payload),
    };
};
