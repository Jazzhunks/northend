import { Type } from '@scalar/typebox';
import { compose } from '../../../schemas/compose.js';
import { XScalarCredentialsLocationSchema, } from '../../../schemas/extensions/security/x-scalar-credentials-location.js';
import { XScalarSecurityBodySchema, } from '../../../schemas/extensions/security/x-scalar-security-body.js';
import { XScalarSecurityQuerySchema, } from '../../../schemas/extensions/security/x-scalar-security-query.js';
import { XScalarAuthUrlSchema, XScalarTokenUrlSchema, } from '../../../schemas/extensions/security/x-scalar-security-secrets.js';
import { XTokenNameSchema } from '../../../schemas/extensions/security/x-tokenName.js';
import { XusePkceSchema } from '../../../schemas/extensions/security/x-use-pkce.js';
/** Common properties used across all OAuth flows */
const OAuthFlowCommonSchema = compose(Type.Object({
    /** The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS. */
    refreshUrl: Type.String(),
    /** REQUIRED. The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it. The map MAY be empty. */
    scopes: Type.Record(Type.String(), Type.String()),
}), XScalarSecurityQuerySchema, XScalarSecurityBodySchema, XTokenNameSchema, XScalarAuthUrlSchema, XScalarTokenUrlSchema);
/** Configuration for the OAuth Implicit flow */
export const OAuthFlowImplicitSchema = compose(OAuthFlowCommonSchema, Type.Object({
    /** REQUIRED. The authorization URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS. */
    authorizationUrl: Type.String(),
}));
/** Configuration for the OAuth Resource Owner Password flow */
export const OAuthFlowPasswordSchema = compose(OAuthFlowCommonSchema, Type.Object({
    /** REQUIRED. The token URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS. */
    tokenUrl: Type.String(),
}), XScalarCredentialsLocationSchema);
/** Configuration for the OAuth Client Credentials flow. Previously called application in OpenAPI 2.0. */
export const OAuthFlowClientCredentialsSchema = compose(OAuthFlowCommonSchema, Type.Object({
    /** REQUIRED. The token URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS. */
    tokenUrl: Type.String(),
}), XScalarCredentialsLocationSchema);
/** Configuration for the OAuth Authorization Code flow. Previously called accessCode in OpenAPI 2.0. */
export const OAuthFlowAuthorizationCodeSchema = compose(OAuthFlowCommonSchema, Type.Object({
    /** REQUIRED. The authorization URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS. */
    authorizationUrl: Type.String(),
    /** REQUIRED. The token URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS. */
    tokenUrl: Type.String(),
}), XusePkceSchema, XScalarCredentialsLocationSchema);
