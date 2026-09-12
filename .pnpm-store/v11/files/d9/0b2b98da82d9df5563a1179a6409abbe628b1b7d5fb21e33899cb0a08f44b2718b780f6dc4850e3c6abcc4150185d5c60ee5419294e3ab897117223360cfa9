import { Type } from '@scalar/typebox';
import { array, object, optional, record, string, union } from '@scalar/validation';
export const xScalarEnvVarSchema = Type.Object({
    name: Type.String(),
    value: Type.Union([
        Type.Object({
            description: Type.Optional(Type.String()),
            default: Type.String({ default: '' }),
        }),
        Type.String(),
    ]),
});
export const XScalarEnvVar = object({
    name: string(),
    value: union([object({ description: optional(string()), default: string() }), string()]),
}, {
    typeName: 'XScalarEnvVar',
});
export const xScalarEnvironmentSchema = Type.Object({
    description: Type.Optional(Type.String()),
    color: Type.String({ default: '#FFFFFF' }),
    variables: Type.Array(xScalarEnvVarSchema),
});
export const XScalarEnvironment = object({
    description: optional(string()),
    color: string({
        typeComment: 'Color for the environment',
    }),
    variables: array(XScalarEnvVar, {
        typeComment: 'An array of variables',
    }),
}, {
    typeName: 'XScalarEnvironment',
    typeComment: 'A map of environments by name',
});
export const xScalarEnvironmentsSchema = Type.Object({
    'x-scalar-environments': Type.Optional(Type.Record(Type.String(), xScalarEnvironmentSchema)),
});
export const XScalarEnvironments = object({
    'x-scalar-environments': optional(record(string(), XScalarEnvironment)),
}, {
    typeName: 'XScalarEnvironments',
    typeComment: 'A record of environments by name',
});
