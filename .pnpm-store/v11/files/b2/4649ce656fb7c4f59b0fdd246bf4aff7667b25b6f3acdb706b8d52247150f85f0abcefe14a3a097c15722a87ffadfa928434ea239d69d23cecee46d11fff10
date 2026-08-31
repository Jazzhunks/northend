import { Type } from '@scalar/typebox';
import { compose } from '../../schemas/compose.js';
import { XScalarCredentialsLocationSchema } from '../../schemas/extensions/security/x-scalar-credentials-location.js';
import { XScalarSecretClientIdSchema, XScalarSecretClientSecretSchema, XScalarSecretHTTPSchema, XScalarSecretRefreshTokenSchema, XScalarSecretRedirectUriSchema, XScalarSecretTokenSchema, } from '../../schemas/extensions/security/x-scalar-security-secrets.js';
import { OAuthFlowAuthorizationCodeSchema, OAuthFlowClientCredentialsSchema, OAuthFlowImplicitSchema, OAuthFlowPasswordSchema, } from '../../schemas/v3.1/strict/oauth-flow.js';
import { SecurityRequirementObjectSchema } from '../../schemas/v3.1/strict/openapi-document.js';
const SecretsApiKeySchema = compose(Type.Object({
    type: Type.Literal('apiKey'),
}), XScalarSecretTokenSchema);
const SecretsHttpSchema = compose(Type.Object({
    type: Type.Literal('http'),
}), XScalarSecretTokenSchema, XScalarSecretHTTPSchema);
const SecretsOAuthFlowCommonSchema = compose(XScalarSecretClientIdSchema, XScalarSecretTokenSchema, XScalarSecretRefreshTokenSchema);
const SecretsOAuthFlowsSchema = Type.Object({
    implicit: Type.Optional(compose(SecretsOAuthFlowCommonSchema, XScalarSecretRedirectUriSchema)),
    password: Type.Optional(compose(SecretsOAuthFlowCommonSchema, XScalarSecretHTTPSchema, XScalarSecretClientSecretSchema, XScalarCredentialsLocationSchema)),
    clientCredentials: Type.Optional(compose(SecretsOAuthFlowCommonSchema, XScalarSecretClientSecretSchema, XScalarCredentialsLocationSchema)),
    authorizationCode: Type.Optional(compose(SecretsOAuthFlowCommonSchema, XScalarSecretClientSecretSchema, XScalarSecretRedirectUriSchema, XScalarCredentialsLocationSchema)),
});
const OAuthSchema = compose(Type.Object({
    type: Type.Literal('oauth2'),
}), SecretsOAuthFlowsSchema);
/** OpenID Connect schema contain the base flows as well since it doesn't exist in the spec */
export const OpenIDConnectSchema = Type.Object({
    type: Type.Literal('openIdConnect'),
    implicit: Type.Optional(compose(OAuthFlowImplicitSchema, SecretsOAuthFlowCommonSchema, XScalarSecretRedirectUriSchema)),
    password: Type.Optional(compose(OAuthFlowPasswordSchema, SecretsOAuthFlowCommonSchema, XScalarSecretHTTPSchema, XScalarSecretClientSecretSchema, XScalarCredentialsLocationSchema)),
    clientCredentials: Type.Optional(compose(OAuthFlowClientCredentialsSchema, SecretsOAuthFlowCommonSchema, XScalarSecretClientSecretSchema, XScalarCredentialsLocationSchema)),
    authorizationCode: Type.Optional(compose(OAuthFlowAuthorizationCodeSchema, SecretsOAuthFlowCommonSchema, XScalarSecretClientSecretSchema, XScalarSecretRedirectUriSchema, XScalarCredentialsLocationSchema)),
});
export const SecretsAuthUnionSchema = Type.Union([
    SecretsApiKeySchema,
    SecretsHttpSchema,
    OAuthSchema,
    OpenIDConnectSchema,
]);
export const SecretsAuthSchema = Type.Record(Type.String(), SecretsAuthUnionSchema);
const SelectedSecuritySchema = Type.Object({
    selectedIndex: Type.Number(),
    selectedSchemes: Type.Array(SecurityRequirementObjectSchema),
});
export const AuthSchema = Type.Object({
    secrets: SecretsAuthSchema,
    selected: Type.Object({
        document: Type.Optional(SelectedSecuritySchema),
        path: Type.Optional(Type.Record(Type.String(), Type.Record(Type.String(), Type.Optional(SelectedSecuritySchema)))),
    }),
});
export const DocumentAuthSchema = Type.Record(Type.String(), AuthSchema);
