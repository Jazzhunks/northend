import { getNameFromRef } from '../helpers/get-name-from-ref.js';
import { getResolvedRef } from '../helpers/get-resolved-ref.js';
const getChannelNameFromRef = (ref) => getNameFromRef(ref, ['channels']);
const findChannelName = (document, channel) => {
    if (!document.channels) {
        return undefined;
    }
    for (const [channelName, channelNode] of Object.entries(document.channels)) {
        const resolved = getResolvedRef(channelNode);
        if (resolved === channel) {
            return channelName;
        }
    }
    return undefined;
};
/**
 * Resolves an operation's channel reference to a channel name, object, and display address.
 */
export const resolveOperationChannel = (document, operation) => {
    const channelNode = operation.channel;
    if (!channelNode) {
        return undefined;
    }
    const channelNameFromRef = '$ref' in channelNode ? getChannelNameFromRef(channelNode.$ref) : undefined;
    if (channelNameFromRef && document.channels?.[channelNameFromRef]) {
        const channel = getResolvedRef(document.channels[channelNameFromRef]);
        const channelAddress = typeof channel.address === 'string' && channel.address.length > 0 ? channel.address : channelNameFromRef;
        return { channelName: channelNameFromRef, channel, channelAddress };
    }
    const channel = getResolvedRef(channelNode);
    const channelName = channelNameFromRef ??
        findChannelName(document, channel) ??
        (typeof channel.address === 'string' && channel.address.length > 0 ? channel.address : undefined);
    if (!channelName) {
        return undefined;
    }
    const channelAddress = typeof channel.address === 'string' && channel.address.length > 0 ? channel.address : channelName;
    return { channelName, channel, channelAddress };
};
