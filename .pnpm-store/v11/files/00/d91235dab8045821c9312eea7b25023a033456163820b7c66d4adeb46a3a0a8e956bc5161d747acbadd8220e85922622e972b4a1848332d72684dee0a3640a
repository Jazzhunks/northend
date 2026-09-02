import { isObject } from '@scalar/helpers/object/is-object';
import { objectEntries } from '@scalar/helpers/object/object-entries';
/**
 * Maps x-scalar-secret fields to their corresponding input field names.
 * This allows us to fall back to config values when auth store secrets are not available.
 */
const SECRET_TO_INPUT_FIELD_MAP = {
    'x-scalar-secret-client-id': 'x-scalar-client-id',
    'x-scalar-secret-client-secret': 'clientSecret',
    'x-scalar-secret-password': 'password',
    'x-scalar-secret-redirect-uri': 'x-scalar-redirect-uri',
    'x-scalar-secret-token': 'token',
    'x-scalar-secret-username': 'username',
    'x-scalar-secret-auth-url': 'authorizationUrl',
    'x-scalar-secret-token-url': 'tokenUrl',
};
const mergeFlowSecrets = (properties, configSecrets, authStoreSecrets = {}, oauth2RedirectUri) => Object.fromEntries(properties.map((property) => {
    // Redirect URI is the only OAuth secret where an explicit empty value from
    // store must be preserved. Other secrets use falsy fallback behavior for backwards-compatibility
    // with config defaults when the casted auth store value is an empty string.
    const authStoreValue = typeof authStoreSecrets[property] === 'string' ? authStoreSecrets[property] : undefined;
    const configValue = typeof configSecrets[property] === 'string' ? configSecrets[property] : undefined;
    const configInputValue = typeof configSecrets[SECRET_TO_INPUT_FIELD_MAP[property]] === 'string'
        ? configSecrets[SECRET_TO_INPUT_FIELD_MAP[property]]
        : undefined;
    // oauth2RedirectUri (top-level config option) is used as a global fallback for the redirect URI,
    // applied only when neither the auth store nor per-scheme config have a value. This ensures
    // the configured redirect URI persists when switching between documents with the same OAuth config,
    // because each document starts with no stored redirect URI (authStoreValue === undefined).
    const value = property === 'x-scalar-secret-redirect-uri'
        ? (authStoreValue ?? configValue ?? configInputValue ?? oauth2RedirectUri ?? '')
        : authStoreValue || configValue || configInputValue || '';
    return [property, value];
}));
const extractRefreshTokenSecret = (authStoreSecrets = {}) => {
    const refreshToken = authStoreSecrets['x-scalar-secret-refresh-token'];
    if (typeof refreshToken === 'string') {
        return { 'x-scalar-secret-refresh-token': refreshToken };
    }
    return {};
};
const extractCredentialsLocation = (configSecrets, authStoreSecrets = {}) => {
    const credentialsLocation = authStoreSecrets['x-scalar-credentials-location'] ??
        configSecrets['x-scalar-credentials-location'];
    return credentialsLocation ? { 'x-scalar-credentials-location': credentialsLocation } : {};
};
/**
 * Extract flow secrets and selected scopes for OAuth-like flows.
 * Reused by both oauth2 and openIdConnect security schemes.
 */
const extractOAuthFlowSecrets = (flows, storeSecrets, oauth2RedirectUri) => {
    const selectedScopes = new Set();
    const extractedFlows = objectEntries(flows ?? {}).reduce((acc, [key, flow]) => {
        if (!isObject(flow)) {
            return acc;
        }
        // Store any selected scopes from the config
        const flowSelectedScopes = flow['selectedScopes'];
        if (Array.isArray(flowSelectedScopes)) {
            flowSelectedScopes.forEach((scope) => typeof scope === 'string' && selectedScopes.add(scope));
        }
        // Implicit flow
        if (key === 'implicit') {
            acc.implicit = {
                ...flow,
                ...mergeFlowSecrets([
                    'x-scalar-secret-client-id',
                    'x-scalar-secret-redirect-uri',
                    'x-scalar-secret-token',
                    'x-scalar-secret-auth-url',
                ], flow, storeSecrets?.implicit, oauth2RedirectUri),
                ...extractRefreshTokenSecret(storeSecrets?.implicit),
            };
        }
        // Password flow
        if (key === 'password') {
            acc[key] = {
                ...flow,
                ...mergeFlowSecrets([
                    'x-scalar-secret-client-id',
                    'x-scalar-secret-client-secret',
                    'x-scalar-secret-username',
                    'x-scalar-secret-password',
                    'x-scalar-secret-token',
                    'x-scalar-secret-token-url',
                ], flow, storeSecrets?.password),
                ...extractCredentialsLocation(flow, storeSecrets?.password),
                ...extractRefreshTokenSecret(storeSecrets?.password),
            };
        }
        // Client credentials flow
        if (key === 'clientCredentials') {
            acc[key] = {
                ...flow,
                ...mergeFlowSecrets([
                    'x-scalar-secret-client-id',
                    'x-scalar-secret-client-secret',
                    'x-scalar-secret-token',
                    'x-scalar-secret-token-url',
                ], flow, storeSecrets?.clientCredentials),
                ...extractCredentialsLocation(flow, storeSecrets?.clientCredentials),
                ...extractRefreshTokenSecret(storeSecrets?.clientCredentials),
            };
        }
        // Authorization code flow
        if (key === 'authorizationCode') {
            acc[key] = {
                ...flow,
                ...mergeFlowSecrets([
                    'x-scalar-secret-client-id',
                    'x-scalar-secret-client-secret',
                    'x-scalar-secret-redirect-uri',
                    'x-scalar-secret-token',
                    'x-scalar-secret-auth-url',
                    'x-scalar-secret-token-url',
                ], flow, storeSecrets?.authorizationCode, oauth2RedirectUri),
                ...extractCredentialsLocation(flow, storeSecrets?.authorizationCode),
                ...extractRefreshTokenSecret(storeSecrets?.authorizationCode),
            };
        }
        return acc;
    }, {});
    return { flows: extractedFlows, selectedScopes: Array.from(selectedScopes) };
};
/** Extract the secrets from the config and the auth store */
export const extractSecuritySchemeSecrets = (
// Include the config fields
scheme, authStore, name, documentSlug, oauth2RedirectUri) => {
    const secrets = authStore.getAuthSecrets(documentSlug, name);
    // Handle API Key security schemes
    if (scheme.type === 'apiKey') {
        const storeSecrets = secrets?.type === 'apiKey' ? secrets : undefined;
        return {
            ...scheme,
            'x-scalar-secret-token': storeSecrets?.['x-scalar-secret-token'] || scheme.value || '',
        };
    }
    // Handle HTTP Auth security schemes (e.g., Basic, Bearer)
    if (scheme.type === 'http') {
        const storeSecrets = secrets?.type === 'http' ? secrets : undefined;
        return {
            ...scheme,
            'x-scalar-secret-token': storeSecrets?.['x-scalar-secret-token'] || scheme.token || '',
            'x-scalar-secret-username': storeSecrets?.['x-scalar-secret-username'] || scheme.username || '',
            'x-scalar-secret-password': storeSecrets?.['x-scalar-secret-password'] || scheme.password || '',
        };
    }
    // Handle OAuth2 security schemes and all supported flows
    if (scheme.type === 'oauth2') {
        const storeSecrets = secrets?.type === 'oauth2' ? secrets : undefined;
        const extracted = extractOAuthFlowSecrets(scheme.flows, storeSecrets, oauth2RedirectUri);
        const configuredDefaultScopes = Array.isArray(scheme['x-default-scopes'])
            ? scheme['x-default-scopes'].filter((scope) => typeof scope === 'string')
            : [];
        const mergedDefaultScopes = Array.from(new Set([...configuredDefaultScopes, ...extracted.selectedScopes]));
        return {
            ...scheme,
            flows: extracted.flows,
            'x-default-scopes': mergedDefaultScopes,
        };
    }
    // OpenID Connect uses auth-store-only discovered flows, but we expose them in OAuth-like flow format.
    if (scheme.type === 'openIdConnect') {
        const storeSecrets = secrets?.type === 'openIdConnect' ? secrets : undefined;
        const extracted = extractOAuthFlowSecrets({
            implicit: storeSecrets?.implicit,
            password: storeSecrets?.password,
            clientCredentials: storeSecrets?.clientCredentials,
            authorizationCode: storeSecrets?.authorizationCode,
        }, storeSecrets, oauth2RedirectUri);
        return {
            ...scheme,
            ...(objectEntries(extracted.flows).length ? { flows: extracted.flows } : {}),
        };
    }
    return scheme;
};
