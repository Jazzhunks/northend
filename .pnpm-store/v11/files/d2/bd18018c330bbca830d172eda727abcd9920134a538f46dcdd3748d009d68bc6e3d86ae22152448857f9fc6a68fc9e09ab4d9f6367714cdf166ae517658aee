export declare const xScalarEnvVarSchema: import("@scalar/typebox").TObject<{
    name: import("@scalar/typebox").TString;
    value: import("@scalar/typebox").TUnion<[import("@scalar/typebox").TObject<{
        description: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        default: import("@scalar/typebox").TString;
    }>, import("@scalar/typebox").TString]>;
}>;
export declare const XScalarEnvVar: import("@scalar/validation").ObjectSchema<{
    name: import("@scalar/validation").StringSchema;
    value: import("@scalar/validation").UnionSchema<readonly [import("@scalar/validation").ObjectSchema<{
        description: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
        default: import("@scalar/validation").StringSchema;
    }>, import("@scalar/validation").StringSchema]>;
}>;
/** A scalar environment variable */
export type XScalarEnvVar = {
    name: string;
    value: {
        description?: string;
        default: string;
    } | string;
};
export declare const xScalarEnvironmentSchema: import("@scalar/typebox").TObject<{
    description: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
    color: import("@scalar/typebox").TString;
    variables: import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
        name: import("@scalar/typebox").TString;
        value: import("@scalar/typebox").TUnion<[import("@scalar/typebox").TObject<{
            description: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
            default: import("@scalar/typebox").TString;
        }>, import("@scalar/typebox").TString]>;
    }>>;
}>;
export declare const XScalarEnvironment: import("@scalar/validation").ObjectSchema<{
    description: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
    color: import("@scalar/validation").StringSchema;
    variables: import("@scalar/validation").ArraySchema<import("@scalar/validation").ObjectSchema<{
        name: import("@scalar/validation").StringSchema;
        value: import("@scalar/validation").UnionSchema<readonly [import("@scalar/validation").ObjectSchema<{
            description: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
            default: import("@scalar/validation").StringSchema;
        }>, import("@scalar/validation").StringSchema]>;
    }>>;
}>;
/** An environment definition */
export type XScalarEnvironment = {
    /** Optional description for the environment */
    description?: string;
    /** Color for the environment */
    color: string;
    /** An array of variables */
    variables: XScalarEnvVar[];
};
export declare const xScalarEnvironmentsSchema: import("@scalar/typebox").TObject<{
    'x-scalar-environments': import("@scalar/typebox").TOptional<import("@scalar/typebox").TRecord<import("@scalar/typebox").TString, import("@scalar/typebox").TObject<{
        description: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        color: import("@scalar/typebox").TString;
        variables: import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
            name: import("@scalar/typebox").TString;
            value: import("@scalar/typebox").TUnion<[import("@scalar/typebox").TObject<{
                description: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
                default: import("@scalar/typebox").TString;
            }>, import("@scalar/typebox").TString]>;
        }>>;
    }>>>;
}>;
export declare const XScalarEnvironments: import("@scalar/validation").ObjectSchema<{
    'x-scalar-environments': import("@scalar/validation").OptionalSchema<import("@scalar/validation").RecordSchema<import("@scalar/validation").StringSchema, import("@scalar/validation").ObjectSchema<{
        description: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
        color: import("@scalar/validation").StringSchema;
        variables: import("@scalar/validation").ArraySchema<import("@scalar/validation").ObjectSchema<{
            name: import("@scalar/validation").StringSchema;
            value: import("@scalar/validation").UnionSchema<readonly [import("@scalar/validation").ObjectSchema<{
                description: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
                default: import("@scalar/validation").StringSchema;
            }>, import("@scalar/validation").StringSchema]>;
        }>>;
    }>>>;
}>;
export type XScalarEnvironments = {
    /** A record of environments by name */
    'x-scalar-environments'?: Record<string, XScalarEnvironment>;
};
//# sourceMappingURL=x-scalar-environments.d.ts.map