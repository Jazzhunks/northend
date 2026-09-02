import { Type } from '@scalar/typebox';
import { ServerObjectSchema } from '../../schemas/v3.1/strict/openapi-document.js';
export const SettingsSchema = Type.Partial(Type.Object({
    /** Custom proxy configuration */
    proxyUrl: Type.String(),
    /** Hotkey used to open the search menu */
    searchKey: Type.String(),
    /** Array of server configurations */
    servers: Type.Array(ServerObjectSchema),
    /** Base server URL for API requests */
    baseServerUrl: Type.String(),
}));
export const defaultSettings = {
    proxyUrl: '',
    searchKey: 'k',
    servers: [],
    baseServerUrl: '',
};
