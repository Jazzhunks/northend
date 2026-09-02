import { updateOperationRequestBodyContentType, updateOperationRequestBodyExample, updateOperationRequestBodyFormValue, } from '../../mutators/operation/body.js';
import { updateOperationExtension } from '../../mutators/operation/extensions.js';
import { addResponseToHistory, reloadOperationHistory } from '../../mutators/operation/history.js';
import { createOperation, createOperationDraftExample, deleteOperation, deleteOperationExample, renameOperationExample, updateOperationMeta, updateOperationPathMethod, } from '../../mutators/operation/operation.js';
import { deleteAllOperationParameters, deleteOperationParameter, updateOperationExtraParameters, upsertOperationParameter, } from '../../mutators/operation/parameters.js';
export const operationMutatorsFactory = ({ document, store, }) => {
    return {
        createOperation: (payload) => createOperation(store, payload),
        updateOperationMeta: (payload) => updateOperationMeta(store, document, payload),
        updateOperationPathMethod: (payload) => updateOperationPathMethod(document, store, payload),
        deleteOperation: (payload) => deleteOperation(store, payload),
        createOperationDraftExample: (payload) => createOperationDraftExample(store, payload),
        deleteOperationExample: (payload) => deleteOperationExample(store, payload),
        renameOperationExample: (payload) => renameOperationExample(store, payload),
        updateOperationExtension: (payload) => updateOperationExtension(document, payload),
        updateOperationExtraParameters: (payload) => updateOperationExtraParameters(document, payload),
        upsertOperationParameter: (payload) => upsertOperationParameter(document, payload),
        deleteOperationParameter: (payload) => deleteOperationParameter(document, payload),
        deleteAllOperationParameters: (payload) => deleteAllOperationParameters(document, payload),
        updateOperationRequestBodyContentType: (payload) => updateOperationRequestBodyContentType(document, payload),
        updateOperationRequestBodyExample: (payload) => updateOperationRequestBodyExample(document, payload),
        updateOperationRequestBodyFormValue: (payload) => updateOperationRequestBodyFormValue(document, payload),
        addResponseToHistory: (payload) => addResponseToHistory(store, document, payload),
        reloadOperationHistory: (payload) => reloadOperationHistory(store, document, payload),
    };
};
