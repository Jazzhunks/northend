import { getPathItemOperation } from '../../helpers/for-each-path-item-operation.js';
import { getResolvedRef } from '../../helpers/get-resolved-ref.js';
import { isOpenApiDocument } from '../../schemas/type-guards.js';
import { isContentTypeParameterObject } from '../../schemas/v3.1/strict/type-guards.js';
import { fetchRequestToHar } from './helpers/fetch-request-to-har.js';
import { fetchResponseToHar } from './helpers/fetch-response-to-har.js';
import { harToOperation } from './helpers/har-to-operation.js';
export const addResponseToHistory = async (store, document, { payload, meta }) => {
    if (!isOpenApiDocument(document)) {
        return;
    }
    const documentName = document['x-scalar-navigation']?.name;
    if (!documentName || !payload) {
        return;
    }
    const operation = getResolvedRef(getPathItemOperation(document.paths?.[meta.path], meta.method));
    if (!operation) {
        return;
    }
    const operationParameters = operation.parameters ?? [];
    // Get all the variables from the operation parameters
    const variables = operationParameters.reduce((acc, param) => {
        const resolvedParam = getResolvedRef(param);
        if (isContentTypeParameterObject(resolvedParam)) {
            return acc;
        }
        if (resolvedParam.in === 'path') {
            acc[resolvedParam.name] = getResolvedRef(resolvedParam.examples?.[meta.exampleKey])?.value ?? '';
        }
        return acc;
    }, {});
    const requestHar = await fetchRequestToHar({ requestPayload: payload.requestPayload });
    const responseHar = await fetchResponseToHar({ response: payload.response });
    store?.history.addHistory(documentName, meta.path, meta.method, {
        response: responseHar,
        request: requestHar,
        meta: {
            example: meta.exampleKey,
        },
        time: payload.duration,
        timestamp: payload.timestamp,
        requestMetadata: {
            variables,
        },
    });
};
export const reloadOperationHistory = (store, document, { meta, index, callback }) => {
    if (!isOpenApiDocument(document)) {
        console.error('Document not found', meta.path, meta.method);
        return;
    }
    const operation = getResolvedRef(getPathItemOperation(document.paths?.[meta.path], meta.method));
    if (!operation) {
        console.error('Operation not found', meta.path, meta.method);
        return;
    }
    const historyItem = store?.history.getHistory(document['x-scalar-navigation']?.name ?? '', meta.path, meta.method)?.[index];
    if (!historyItem) {
        console.error('History item not found', index);
        return;
    }
    harToOperation({
        harRequest: historyItem.request,
        exampleKey: 'draft',
        baseOperation: operation,
        pathVariables: historyItem.requestMetadata.variables,
    });
    callback('success');
};
