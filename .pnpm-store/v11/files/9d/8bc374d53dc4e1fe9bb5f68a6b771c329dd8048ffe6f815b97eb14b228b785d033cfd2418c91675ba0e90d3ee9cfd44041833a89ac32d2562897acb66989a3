import { getResolvedRef } from '../helpers/get-resolved-ref.js';
import { resolveOperationChannel } from './resolve-operation-channel.js';
import { resolveOperationWithTraits } from './resolve-operation-with-traits.js';
/**
 * Lists AsyncAPI operations that target a given channel (for reference in the channel connection UI).
 */
export const getChannelOperations = (document, channelName) => {
    const operations = document.operations ?? {};
    return Object.entries(operations)
        .map(([operationName, operationRef]) => {
        const operation = resolveOperationWithTraits(getResolvedRef(operationRef));
        const resolved = resolveOperationChannel(document, operation);
        if (resolved?.channelName !== channelName) {
            return undefined;
        }
        const action = operation.action === 'send' ? 'send' : 'receive';
        return { operationName, operation, action };
    })
        .filter((entry) => entry != null);
};
