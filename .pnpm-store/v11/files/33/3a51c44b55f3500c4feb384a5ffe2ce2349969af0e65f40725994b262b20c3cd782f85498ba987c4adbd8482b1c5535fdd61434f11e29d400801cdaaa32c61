import type { WorkspaceStore } from '../client.js';
import type { DocumentEvents } from '../events/definitions/document.js';
import type { WorkspaceDocument } from '../schemas.js';
/**
 * Updates extension fields on the document (e.g. x-pre-request, x-post-response).
 * Merges the payload into the document root.
 */
export declare const updateDocumentExtension: (document: WorkspaceDocument | null, payload: DocumentEvents["document:update:extension"]) => void;
/**
 * Updates the "watch mode" state of the given document.
 *
 * @param document WorkspaceDocument or null – The document to modify.
 * @param watchMode boolean – True enables watch mode, false disables it.
 *
 * If document is null, does nothing.
 */
export declare const updateWatchMode: (document: WorkspaceDocument | null, watchMode: boolean) => void;
/**
 * Updates the document's info object (typically, title, description, version, etc.).
 *
 * Uses a shallow merge: only properties present in payload will be overwritten or added.
 *
 * @param document WorkspaceDocument | null – The document whose info should be updated.
 * @param payload DocumentEvents['document:update:info'] – Partial info fields to update/merge.
 *
 * If document is null, does nothing.
 */
export declare const updateDocumentInfo: (document: WorkspaceDocument | null, payload: DocumentEvents["document:update:info"]) => void;
/**
 * Update the document icon and also update the corresponding sidebar entry
 *
 * Does not perform a sidebar rebuild for performance benefit
 */
export declare const updateDocumentIcon: (document: WorkspaceDocument | null, icon: string) => void;
/**
 * Creates an empty OpenAPI document and adds it to the workspace.
 *
 * - If the store is null, this is a no-op.
 * - The document name must be unique; if already present, callback is called with `false`.
 * - On success, a new OpenAPI 3.1.0 document is added with a basic path and info.
 * - Callback is called with `true` if document is created.
 *
 * @param store WorkspaceStore | null – The workspace store to add the document to.
 * @param payload DocumentEvents['document:create:empty-document'] – Contains name, icon, and callback.
 */
export declare const createEmptyDocument: (store: WorkspaceStore | null, payload: DocumentEvents["document:create:empty-document"]) => Promise<void>;
/**
 * Deletes a document from the workspace by its name.
 *
 * Safely no-ops if the store is null.
 */
export declare const deleteDocument: (store: WorkspaceStore | null, payload: DocumentEvents["document:delete:document"]) => void;
export declare const documentMutatorsFactory: ({ document, store, }: {
    document: WorkspaceDocument | null;
    store: WorkspaceStore | null;
}) => {
    updateDocumentExtension: (payload: DocumentEvents["document:update:extension"]) => void;
    updateDocumentInfo: (payload: DocumentEvents["document:update:info"]) => void;
    updateWatchMode: (payload: DocumentEvents["document:update:watch-mode"]) => void;
    updateDocumentIcon: (payload: DocumentEvents["document:update:icon"]) => void;
    createEmptyDocument: (payload: DocumentEvents["document:create:empty-document"]) => Promise<void>;
    deleteDocument: (payload: DocumentEvents["document:delete:document"]) => void;
};
//# sourceMappingURL=document.d.ts.map