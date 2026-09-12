import { Type } from '@scalar/typebox';
import { object, optional, string } from '@scalar/validation';
/**
 * A scalar secret token
 *
 * We should not export this when exporting the document
 */
export const XScalarSecretTokenSchema = Type.Object({
    'x-scalar-secret-token': Type.String(),
});
export const XScalarSecretToken = object({
    'x-scalar-secret-token': string(),
}, {
    typeName: 'XScalarSecretToken',
    typeComment: 'Persisted OAuth access token (sensitive)',
});
/**
 * OAuth refresh token
 *
 * We should not export this when exporting the document
 */
export const XScalarSecretRefreshTokenSchema = Type.Object({
    'x-scalar-secret-refresh-token': Type.Optional(Type.String()),
});
export const XScalarSecretRefreshToken = object({
    'x-scalar-secret-refresh-token': optional(string()),
}, {
    typeName: 'XScalarSecretRefreshToken',
    typeComment: 'Persisted OAuth refresh token (sensitive)',
});
/**
 * OAuth auth url
 *
 * We should not export this when exporting the document
 */
export const XScalarAuthUrlSchema = Type.Object({
    'x-scalar-secret-auth-url': Type.Optional(Type.String()),
});
export const XScalarAuthUrl = object({
    'x-scalar-secret-auth-url': optional(string()),
}, {
    typeName: 'XScalarAuthUrl',
    typeComment: 'Persisted OAuth authorization URL override',
});
/**
 * OAuth token url
 *
 * We should not export this when exporting the document
 */
export const XScalarTokenUrlSchema = Type.Object({
    'x-scalar-secret-token-url': Type.Optional(Type.String()),
});
export const XScalarTokenUrl = object({
    'x-scalar-secret-token-url': optional(string()),
}, {
    typeName: 'XScalarTokenUrl',
    typeComment: 'Persisted OAuth token URL override',
});
/**
 * Username and password for HTTP authentication
 *
 * We should not export this when exporting the document
 */
export const XScalarSecretHTTPSchema = Type.Object({
    'x-scalar-secret-username': Type.String(),
    'x-scalar-secret-password': Type.String(),
});
export const XScalarSecretHTTP = object({
    'x-scalar-secret-username': string(),
    'x-scalar-secret-password': string(),
}, {
    typeName: 'XScalarSecretHTTP',
    typeComment: 'Persisted HTTP basic credentials (sensitive)',
});
/**
 * Oauth client secret
 *
 * We should not export this when exporting the document
 */
export const XScalarSecretClientSecretSchema = Type.Object({
    'x-scalar-secret-client-secret': Type.String(),
});
export const XScalarSecretClientSecret = object({
    'x-scalar-secret-client-secret': string(),
}, {
    typeName: 'XScalarSecretClientSecret',
    typeComment: 'Persisted OAuth client secret (sensitive)',
});
/**
 * Oauth client ID
 *
 * We should not export this when exporting the document
 */
export const XScalarSecretClientIdSchema = Type.Object({
    'x-scalar-secret-client-id': Type.String(),
});
export const XScalarSecretClientId = object({
    'x-scalar-secret-client-id': string(),
}, {
    typeName: 'XScalarSecretClientId',
    typeComment: 'Persisted OAuth client ID',
});
/**
 * Oauth Redirect URI
 *
 * We should not export this when exporting the document
 */
export const XScalarSecretRedirectUriSchema = Type.Object({
    'x-scalar-secret-redirect-uri': Type.String(),
});
export const XScalarSecretRedirectUri = object({
    'x-scalar-secret-redirect-uri': string(),
}, {
    typeName: 'XScalarSecretRedirectUri',
    typeComment: 'Persisted OAuth redirect URI',
});
