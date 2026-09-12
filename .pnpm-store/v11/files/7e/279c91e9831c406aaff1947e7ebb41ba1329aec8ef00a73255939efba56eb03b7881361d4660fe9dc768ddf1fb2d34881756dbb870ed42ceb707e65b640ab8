import { reactive } from 'vue';
import { DocumentHistorySchema } from '../../entities/history/schema.js';
import { safeAssign } from '../../helpers/general.js';
import { unpackProxyObject } from '../../helpers/unpack-proxy.js';
import { coerceValue } from '../../schemas/typebox-coerce.js';
const HISTORY_LIMIT = 5;
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
export const createHistoryStore = ({ hooks, }) => {
    const history = reactive({});
    const getHistory = (documentName, path, method) => {
        return history[documentName]?.[path]?.[method];
    };
    const addHistory = (documentName, path, method, entry) => {
        history[documentName] ||= {};
        history[documentName][path] ||= {};
        history[documentName][path][method] ||= [];
        // We want to make sure that the history is not full
        if (history[documentName][path][method].length >= HISTORY_LIMIT) {
            // Delete the oldest entry
            // We need to unpack the history array to avoid proxy object issues
            history[documentName][path][method] = unpackProxyObject(history[documentName][path][method].filter((_, i) => i !== 0), { depth: 1 });
        }
        // Add the new entry to the history
        history[documentName][path][method].push(entry);
        // Explicitly trigger the change event once after all modifications
        hooks?.onHistoryChange?.(documentName);
    };
    const clearOperationHistory = (documentName, path, method) => {
        delete history[documentName]?.[path]?.[method];
        hooks?.onHistoryChange?.(documentName);
    };
    const clearPathHistory = (documentName, path) => {
        delete history[documentName]?.[path];
        hooks?.onHistoryChange?.(documentName);
    };
    const clearDocumentHistory = (documentName) => {
        delete history[documentName];
        hooks?.onHistoryChange?.(documentName);
    };
    const load = (data) => {
        const coercedData = coerceValue(DocumentHistorySchema, data);
        safeAssign(history, coercedData);
        // Trigger change events for all loaded documents
        Object.keys(coercedData).forEach((documentName) => {
            hooks?.onHistoryChange?.(documentName);
        });
    };
    const exportHistory = () => {
        return unpackProxyObject(history);
    };
    return {
        getHistory,
        addHistory,
        clearOperationHistory,
        clearPathHistory,
        clearDocumentHistory,
        load,
        export: exportHistory,
    };
};
