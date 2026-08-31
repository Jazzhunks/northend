export declare const XScalarRegistryMetaSchema: import("@scalar/typebox").TObject<{
    /**
     * The registry meta for the document.
     */
    'x-scalar-registry-meta': import("@scalar/typebox").TOptional<import("@scalar/typebox").TObject<{
        /**
         * The namespace under which this registry meta is scoped.
         */
        namespace: import("@scalar/typebox").TString;
        /**
         * A unique slug identifier for this registry meta within the namespace.
         */
        slug: import("@scalar/typebox").TString;
        /**
         * The version of the registry meta.
         */
        version: import("@scalar/typebox").TString;
        /**
         * Last known commit hash of this document.
         *
         * Is going to be used to track if the document has been modified since it was last saved.
         */
        commitHash: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        /**
         * Registry commit hash that the cached `hasConflict` flag was computed
         * against. When the registry advertises a different hash later, the
         * cached result is stale and the conflict check has to be re-run.
         */
        conflictCheckedAgainstHash: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
        /**
         * Cached outcome of the last conflict check, valid only while
         * `conflictCheckedAgainstHash` matches the registry's current hash for
         * this version.
         */
        hasConflict: import("@scalar/typebox").TOptional<import("@scalar/typebox").TBoolean>;
    }>>;
}>;
export type XScalarRegistryMeta = {
    /**
     * The registry meta for the document.
     */
    'x-scalar-registry-meta'?: {
        /**
         * The namespace under which this registry meta is scoped.
         */
        namespace: string;
        /**
         * A unique slug identifier for this registry meta within the namespace.
         */
        slug: string;
        /**
         * The version of the registry meta.
         */
        version: string;
        /**
         * Last known commit hash of this document.
         *
         * Is going to be used to track if the document has been modified since it was last saved.
         */
        commitHash?: string;
        /**
         * Registry commit hash that the cached `hasConflict` flag was computed
         * against. The cache is invalid when this no longer matches the registry
         * hash advertised for this version.
         */
        conflictCheckedAgainstHash?: string;
        /**
         * Cached outcome of the last conflict check, valid only while
         * `conflictCheckedAgainstHash` matches the registry's current hash for
         * this version.
         */
        hasConflict?: boolean;
    };
};
export declare const XScalarRegistryMeta: import("@scalar/validation").ObjectSchema<{
    'x-scalar-registry-meta': import("@scalar/validation").OptionalSchema<import("@scalar/validation").ObjectSchema<{
        namespace: import("@scalar/validation").StringSchema;
        slug: import("@scalar/validation").StringSchema;
        version: import("@scalar/validation").StringSchema;
        commitHash: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
        conflictCheckedAgainstHash: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
        hasConflict: import("@scalar/validation").OptionalSchema<import("@scalar/validation").BooleanSchema>;
    }>>;
}>;
//# sourceMappingURL=x-scalar-registry-meta.d.ts.map