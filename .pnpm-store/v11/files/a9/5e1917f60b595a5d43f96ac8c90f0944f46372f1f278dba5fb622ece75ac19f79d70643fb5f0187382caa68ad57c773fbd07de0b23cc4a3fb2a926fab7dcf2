import { preventPollution } from '@scalar/helpers/object/prevent-pollution';
import { reactive } from 'vue';
import { DocumentAuthSchema, SecretsAuthUnionSchema, } from '../../entities/auth/schema.js';
import { safeAssign } from '../../helpers/general.js';
import { unpackProxyObject } from '../../helpers/unpack-proxy.js';
import { coerceValue } from '../../schemas/typebox-coerce.js';
export { AuthSchema, OpenIDConnectSchema, SecretsAuthSchema, } from './schema.js';
/**
 * Factory function to create a new AuthStore instance.
 */
export const createAuthStore = ({ hooks } = {}) => {
    // Vue reactive object to hold all authentication state
    const auth = reactive({});
    const getAuthSecrets = (documentName, schemeName) => {
        return auth[documentName]?.secrets?.[schemeName];
    };
    const setAuthSecrets = (documentName, schemeName, data) => {
        auth[documentName] ||= { secrets: {}, selected: { document: undefined, path: undefined } };
        auth[documentName].secrets[schemeName] = coerceValue(SecretsAuthUnionSchema, data);
        hooks?.onAuthChange?.(documentName);
    };
    const clearAuthSecrets = (documentName, schemeName) => {
        delete auth[documentName]?.secrets?.[schemeName];
        hooks?.onAuthChange?.(documentName);
    };
    const getAuthSelectedSchemas = (payload) => {
        if (payload.type === 'document') {
            return auth[payload.documentName]?.selected?.document;
        }
        return auth[payload.documentName]?.selected?.path?.[payload.path]?.[payload.method];
    };
    const setAuthSelectedSchemas = (payload, selectedSchemes) => {
        auth[payload.documentName] ||= {
            secrets: {},
            selected: { document: undefined, path: undefined },
        };
        // TypeScript needs a non-null assertion here since we just ensured it exists
        const documentAuth = auth[payload.documentName];
        if (payload.type === 'document') {
            documentAuth.selected.document = selectedSchemes;
        }
        else {
            // Prevent assigning dangerous keys to the path items object
            preventPollution(payload.path);
            preventPollution(payload.method);
            documentAuth.selected.path ||= {};
            documentAuth.selected.path[payload.path] ||= {};
            const pathAuth = documentAuth.selected.path[payload.path];
            pathAuth[payload.method] = selectedSchemes;
        }
        hooks?.onAuthChange?.(payload.documentName);
    };
    const clearAuthSelectedSchemas = (payload) => {
        const documentAuth = auth[payload.documentName];
        if (!documentAuth) {
            return;
        }
        if (payload.type === 'document') {
            delete documentAuth.selected.document;
            hooks?.onAuthChange?.(payload.documentName);
            return;
        }
        // Prevent altering dangerous keys to the path items object
        preventPollution(payload.method);
        preventPollution(payload.path);
        const pathAuth = documentAuth.selected.path?.[payload.path];
        if (!pathAuth) {
            return;
        }
        delete pathAuth[payload.method];
        hooks?.onAuthChange?.(payload.documentName);
    };
    const clearDocumentAuth = (documentName) => {
        delete auth[documentName];
        hooks?.onAuthChange?.(documentName);
    };
    const load = (data) => {
        safeAssign(auth, coerceValue(DocumentAuthSchema, data));
        // Trigger change events for all loaded documents
        Object.keys(data).forEach((documentName) => {
            hooks?.onAuthChange?.(documentName);
        });
    };
    const exportAuth = () => {
        return unpackProxyObject(auth);
    };
    return {
        clearAuthSelectedSchemas,
        getAuthSecrets,
        setAuthSecrets,
        clearAuthSecrets,
        getAuthSelectedSchemas,
        setAuthSelectedSchemas,
        clearDocumentAuth,
        load,
        export: exportAuth,
    };
};
