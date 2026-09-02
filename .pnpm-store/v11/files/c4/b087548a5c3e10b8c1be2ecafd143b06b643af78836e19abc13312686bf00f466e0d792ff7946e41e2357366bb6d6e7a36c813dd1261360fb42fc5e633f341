import { getResolvedRef } from '../helpers/get-resolved-ref.js';
/**
 * Resolves a channel by its key in `document.channels`.
 */
export const resolveChannel = (document, channelName) => {
    const channelNode = document.channels?.[channelName];
    if (!channelNode) {
        return undefined;
    }
    const channel = getResolvedRef(channelNode);
    const channelAddress = typeof channel.address === 'string' && channel.address.length > 0 ? channel.address : channelName;
    return { channelName, channel, channelAddress };
};
