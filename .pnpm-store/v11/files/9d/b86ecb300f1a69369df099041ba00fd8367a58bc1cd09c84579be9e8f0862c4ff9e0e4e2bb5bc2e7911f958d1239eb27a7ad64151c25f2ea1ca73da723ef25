import { type DocumentHistory, type HistoryEntry } from '../../entities/history/schema.js';
/**
 * Interface for the HistoryStore.
 * Provides methods to manage and retrieve request/response history for API operations within a document.
 */
export type HistoryStore = {
    /**
     * Retrieve the history entries for a specific operation (by document, path, and method).
     *
     * @param documentName - The name of the document (e.g., OpenAPI file name)
     * @param path - The path of the operation (e.g., "/pets")
     * @param method - The HTTP method (e.g., "get", "post")
     * @returns An array of HistoryEntry objects or undefined if none exist
     */
    getHistory: (documentName: string, path: string, method: string) => HistoryEntry[] | undefined;
    /**
     * Add a new entry to the history for a specific operation.
     *
     * @param documentName - The name of the document
     * @param path - The path of the operation
     * @param method - The HTTP method
     * @param entry - The HistoryEntry object to add
     */
    addHistory: (documentName: string, path: string, method: string, entry: HistoryEntry) => void;
    /**
     * Clear the history for a specific operation (removes all entries for the given document, path, and method).
     *
     * @param documentName - The name of the document
     * @param path - The path of the operation
     * @param method - The HTTP method
     */
    clearOperationHistory: (documentName: string, path: string, method: string) => void;
    /**
     * Clear all history for a specific path in a document (removes all entries for any method on the given path).
     *
     * @param documentName - The name of the document
     * @param path - The path for which to remove all history
     */
    clearPathHistory: (documentName: string, path: string) => void;
    /**
     * Clear all history for an entire document (removes all entries in the document).
     *
     * @param documentName - The name of the document
     */
    clearDocumentHistory: (documentName: string) => void;
    /**
     * Load a complete DocumentHistory object into the store (replaces existing history).
     *
     * @param data - The DocumentHistory object to load
     */
    load: (data: DocumentHistory) => void;
    /**
     * Export the current DocumentHistory from the store.
     *
     * @returns The DocumentHistory object
     */
    export: () => DocumentHistory;
};
/**
 * Creates a reactive history store for tracking request and response entries for documents and operations.
 *
 * @param hooks (Optional) - Lifecycle hooks for store events, such as onHistoryChange.
 * @returns HistoryStore - Methods for interacting with the operation history.
 *
 * ## Example
 * ```ts
 * const historyStore = createHistoryStore({
 *   hooks: {
 *     onHistoryChange: (documentName, operationName, history) => {
 *       console.log(`History changed for ${documentName}/${operationName}`, history)
 *     }
 *   }
 * })
 *
 * // Add a history entry
 * historyStore.addHistory('petstore.yaml', 'getPets', { ...entry })
 *
 * // Get history entries for an operation
 * const entries = historyStore.getHistory('petstore.yaml', 'getPets')
 * ```
 */
export declare const createHistoryStore: ({ hooks, }: {
    hooks?: {
        /**
         * Called whenever operation history changes for a document.
         * @param documentName - Name of the document (e.g., "petstore.yaml")
         * @param operationName - Name of the operation (e.g., "getPets")
         * @param history - Record of operation histories for this document
         */
        onHistoryChange?: (documentName: string) => void;
    };
}) => HistoryStore;
//# sourceMappingURL=index.d.ts.map