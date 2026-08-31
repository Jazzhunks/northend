import { objectEntries } from '@scalar/helpers/object/object-entries';
import { getResolvedRef } from '../helpers/get-resolved-ref.js';
/**
 * Resolves every message defined on a channel (AsyncAPI data store for payloads).
 */
export const getAllChannelMessages = (_document, channel) => {
    if (!channel.messages) {
        return [];
    }
    return objectEntries(channel.messages)
        .map(([name, messageRef]) => {
        const message = getResolvedRef(messageRef);
        return { name, message };
    })
        .filter((entry) => entry.message != null);
};
