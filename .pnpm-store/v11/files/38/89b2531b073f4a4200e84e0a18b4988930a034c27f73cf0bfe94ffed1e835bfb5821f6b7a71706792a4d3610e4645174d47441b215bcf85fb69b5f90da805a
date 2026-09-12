import { redirectToProxy } from '@scalar/helpers/url/redirect-to-proxy';
/**
 * Get the fetch function from the configuration
 *
 * @param config - The API reference configuration.
 * @returns The fetch function.
 */
export const getFetch = (config) => {
    if (config.fetch) {
        return config.fetch;
    }
    return ((input, init) => fetch(redirectToProxy(config.proxyUrl, input.toString()), init));
};
