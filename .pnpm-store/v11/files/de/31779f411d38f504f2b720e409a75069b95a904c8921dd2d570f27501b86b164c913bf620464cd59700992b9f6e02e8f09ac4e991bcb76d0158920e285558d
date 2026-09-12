export declare const XCodeSamplesSchema: import("@scalar/typebox").TObject<{
    'x-codeSamples': import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
        lang: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        label: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        source: import("@scalar/typebox").TString;
    }>>>;
    'x-code-samples': import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
        lang: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        label: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        source: import("@scalar/typebox").TString;
    }>>>;
    'x-custom-examples': import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
        lang: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        label: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        source: import("@scalar/typebox").TString;
    }>>>;
    'x-readme': import("@scalar/typebox").TOptional<import("@scalar/typebox").TObject<{
        'code-samples': import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
            language: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
            code: import("@scalar/typebox").TString;
            name: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
            install: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
            correspondingExample: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        }>>>;
        'samples-languages': import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TString>>;
    }>>;
    'x-stainless-snippets': import("@scalar/typebox").TOptional<import("@scalar/typebox").TRecord<import("@scalar/typebox").TString, import("@scalar/typebox").TString>>;
    'x-stainless-examples': import("@scalar/typebox").TOptional<import("@scalar/typebox").TUnion<[import("@scalar/typebox").TObject<{
        title: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        request: import("@scalar/typebox").TOptional<import("@scalar/typebox").TRecord<import("@scalar/typebox").TString, import("@scalar/typebox").TString>>;
        response: import("@scalar/typebox").TOptional<import("@scalar/typebox").TUnknown>;
    }>, import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
        title: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        request: import("@scalar/typebox").TOptional<import("@scalar/typebox").TRecord<import("@scalar/typebox").TString, import("@scalar/typebox").TString>>;
        response: import("@scalar/typebox").TOptional<import("@scalar/typebox").TUnknown>;
    }>>]>>;
    'x-scalar-examples': import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
        lang: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        label: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        source: import("@scalar/typebox").TString;
    }>>>;
}>;
export type XCodeSample = {
    lang?: string;
    label?: string;
    source: string;
};
/** A single ReadMe custom code sample. */
export type XReadmeCodeSample = {
    language?: string;
    code: string;
    name?: string;
    install?: string;
    correspondingExample?: string;
};
/** Per-language request snippets with an optional title and response. */
export type XLanguageExample = {
    title?: string;
    request?: Record<string, string>;
    response?: unknown;
};
export declare const XCodeSample: import("@scalar/validation").ObjectSchema<{
    lang: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
    label: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
    source: import("@scalar/validation").StringSchema;
}>;
export type XCodeSamples = {
    'x-codeSamples'?: XCodeSample[];
    'x-code-samples'?: XCodeSample[];
    'x-custom-examples'?: XCodeSample[];
    'x-readme'?: {
        'code-samples'?: XReadmeCodeSample[];
        'samples-languages'?: string[];
    };
    'x-stainless-snippets'?: Record<string, string>;
    'x-stainless-examples'?: XLanguageExample | XLanguageExample[];
    'x-scalar-examples'?: XCodeSample[];
};
export declare const XCodeSamples: import("@scalar/validation").ObjectSchema<{
    'x-codeSamples': import("@scalar/validation").OptionalSchema<import("@scalar/validation").ArraySchema<import("@scalar/validation").ObjectSchema<{
        lang: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
        label: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
        source: import("@scalar/validation").StringSchema;
    }>>>;
    'x-code-samples': import("@scalar/validation").OptionalSchema<import("@scalar/validation").ArraySchema<import("@scalar/validation").ObjectSchema<{
        lang: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
        label: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
        source: import("@scalar/validation").StringSchema;
    }>>>;
    'x-custom-examples': import("@scalar/validation").OptionalSchema<import("@scalar/validation").ArraySchema<import("@scalar/validation").ObjectSchema<{
        lang: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
        label: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
        source: import("@scalar/validation").StringSchema;
    }>>>;
    'x-readme': import("@scalar/validation").OptionalSchema<import("@scalar/validation").ObjectSchema<{
        'code-samples': import("@scalar/validation").OptionalSchema<import("@scalar/validation").ArraySchema<import("@scalar/validation").ObjectSchema<{
            language: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
            code: import("@scalar/validation").StringSchema;
            name: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
            install: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
            correspondingExample: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
        }>>>;
        'samples-languages': import("@scalar/validation").OptionalSchema<import("@scalar/validation").ArraySchema<import("@scalar/validation").StringSchema>>;
    }>>;
    'x-stainless-snippets': import("@scalar/validation").OptionalSchema<import("@scalar/validation").RecordSchema<import("@scalar/validation").StringSchema, import("@scalar/validation").StringSchema>>;
    'x-stainless-examples': import("@scalar/validation").OptionalSchema<import("@scalar/validation").UnionSchema<readonly [import("@scalar/validation").ObjectSchema<{
        title: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
        request: import("@scalar/validation").OptionalSchema<import("@scalar/validation").RecordSchema<import("@scalar/validation").StringSchema, import("@scalar/validation").StringSchema>>;
        response: import("@scalar/validation").OptionalSchema<import("@scalar/validation").UnknownSchema>;
    }>, import("@scalar/validation").ArraySchema<import("@scalar/validation").ObjectSchema<{
        title: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
        request: import("@scalar/validation").OptionalSchema<import("@scalar/validation").RecordSchema<import("@scalar/validation").StringSchema, import("@scalar/validation").StringSchema>>;
        response: import("@scalar/validation").OptionalSchema<import("@scalar/validation").UnknownSchema>;
    }>>]>>;
    'x-scalar-examples': import("@scalar/validation").OptionalSchema<import("@scalar/validation").ArraySchema<import("@scalar/validation").ObjectSchema<{
        lang: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
        label: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
        source: import("@scalar/validation").StringSchema;
    }>>>;
}>;
//# sourceMappingURL=x-code-samples.d.ts.map