import { isDefined } from '@scalar/helpers/array/is-defined';
/**
 * Generates the headers, cookies and query params for selected security schemes
 * In the future we can add customization for where the security is applied
 */
export const buildRequestSecurity = (
/** Currently selected security for the current operation */
selectedSecuritySchemes, 
/** Include this parameter to set the placeholder for empty tokens */
emptyTokenPlaceholder = '') => {
    const result = [];
    selectedSecuritySchemes.forEach((scheme) => {
        // Api key
        if (scheme.type === 'apiKey') {
            const name = scheme.name;
            const value = scheme['x-scalar-secret-token'] || emptyTokenPlaceholder;
            if (scheme.in === 'header') {
                return result.push({
                    in: scheme.in,
                    name,
                    value,
                });
            }
            if (scheme.in === 'query') {
                return result.push({
                    in: 'query',
                    name,
                    value,
                });
            }
            if (scheme.in === 'cookie') {
                return result.push({
                    in: 'cookie',
                    name,
                    value,
                });
            }
        }
        // HTTP
        if (scheme.type === 'http') {
            if (scheme.scheme === 'basic') {
                const username = scheme['x-scalar-secret-username'] || '';
                const password = scheme['x-scalar-secret-password'] || '';
                // When the user has cleared both fields we must not send any credentials.
                // Falling back to placeholder values here would emit `Basic username:password`,
                // which some servers accept as a valid (but bogus) credential instead of returning 401.
                if (username === '' && password === '') {
                    return null;
                }
                return result.push({
                    in: 'header',
                    name: 'Authorization',
                    // We encode the value when we build the request since we want to be able to replace the variables in the value
                    value: `${username}:${password}`,
                    format: 'basic',
                });
            }
            // Bearer auth
            const value = scheme['x-scalar-secret-token'];
            return result.push({
                in: 'header',
                name: 'Authorization',
                value: value || emptyTokenPlaceholder,
                format: 'bearer',
            });
        }
        // OAuth2
        if (scheme.type === 'oauth2') {
            const flows = Object.values(scheme?.flows ?? {});
            const token = flows.filter(isDefined).find((f) => f['x-scalar-secret-token'])?.['x-scalar-secret-token'] ?? '';
            return result.push({
                in: 'header',
                name: 'Authorization',
                value: token || emptyTokenPlaceholder,
                format: 'bearer',
            });
        }
        // OpenID Connect
        if (scheme.type === 'openIdConnect') {
            const flows = Object.values(scheme?.flows ?? {});
            const token = flows.filter(isDefined).find((f) => f['x-scalar-secret-token'])?.['x-scalar-secret-token'] ?? '';
            return result.push({
                in: 'header',
                name: 'Authorization',
                value: token || emptyTokenPlaceholder,
                format: 'bearer',
            });
        }
        return null;
    });
    return result;
};
