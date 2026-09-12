import type { WorkspaceStore } from '../client.js';
import type { TagEvents } from '../events/definitions/tag.js';
/**
 * Adds a new tag to the WorkspaceDocument's `tags` array.
 *
 * If the document or its tags property does not exist, the function safely no-ops or initializes `tags` as needed.
 *
 * @param document - The target WorkspaceDocument
 * @param payload - The name of the tag to add
 */
export declare const createTag: (store: WorkspaceStore | null, payload: TagEvents["tag:create:tag"]) => void;
/**
 * Edits a tag in the WorkspaceDocument's
 *
 * @param document - The target WorkspaceDocument
 * @param payload - holds the old tag and the new name
 */
export declare const editTag: (store: WorkspaceStore | null, payload: TagEvents["tag:edit:tag"]) => void;
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
export declare const deleteTag: (workspace: WorkspaceStore | null, payload: TagEvents["tag:delete:tag"]) => void;
export declare const tagMutatorsFactory: ({ store }: {
    store: WorkspaceStore | null;
}) => {
    createTag: (payload: TagEvents["tag:create:tag"]) => void;
    editTag: (payload: TagEvents["tag:edit:tag"]) => void;
    deleteTag: (payload: TagEvents["tag:delete:tag"]) => void;
};
//# sourceMappingURL=tag.d.ts.map