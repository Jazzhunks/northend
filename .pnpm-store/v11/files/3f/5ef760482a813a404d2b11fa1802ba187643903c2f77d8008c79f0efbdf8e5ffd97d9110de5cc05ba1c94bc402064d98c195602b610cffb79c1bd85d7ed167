import { Type } from '@scalar/typebox';
import { object, optional, record, string } from '@scalar/validation';
/**
 * An OpenAPI extension to set any additional body parameters for the OAuth token request
 *
 * @example
 * ```yaml
 * x-scalar-security-body: {
 *   audience: 'https://api.example.com',
 *   resource: 'user-profile'
 * }
 * ```
 */
export const XScalarSecurityBodySchema = Type.Object({
    'x-scalar-security-body': Type.Optional(Type.Record(Type.String(), Type.String())),
});
export const XScalarSecurityBody = object({
    'x-scalar-security-body': optional(record(string(), string())),
}, {
    typeName: 'XScalarSecurityBody',
    typeComment: 'Additional OAuth token request body parameters',
});
