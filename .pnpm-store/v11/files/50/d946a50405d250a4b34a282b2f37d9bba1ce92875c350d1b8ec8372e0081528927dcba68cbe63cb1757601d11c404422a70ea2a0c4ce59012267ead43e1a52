import { type XScalarOrder } from '../../../schemas/extensions/general/x-scalar-order.js';
export type XTagGroup = {
    /**
     * The group name.
     */
    name: string;
    /**
     * List of tags to include in this group.
     */
    tags: string[];
} & XScalarOrder;
export declare const XTagGroup: import("@scalar/validation").IntersectionSchema<readonly [import("@scalar/validation").ObjectSchema<{
    name: import("@scalar/validation").StringSchema;
    tags: import("@scalar/validation").ArraySchema<import("@scalar/validation").StringSchema>;
}>, import("@scalar/validation").ObjectSchema<{
    'x-scalar-order': import("@scalar/validation").OptionalSchema<import("@scalar/validation").ArraySchema<import("@scalar/validation").StringSchema>>;
}>]>;
/**
 * x-tagGroups
 *
 * List of tags to include in this group.
 */
export declare const XTagGroupsSchema: import("@scalar/typebox").TObject<{
    'x-tagGroups': import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TIntersect<[import("@scalar/typebox").TObject<{
        /**
         * The group name.
         */
        name: import("@scalar/typebox").TString;
        /**
         * List of tags to include in this group.
         */
        tags: import("@scalar/typebox").TArray<import("@scalar/typebox").TString>;
    }>, import("@scalar/typebox").TObject<{
        'x-scalar-order': import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TString>>;
    }>]>>>;
}>;
export type XTagGroups = {
    /**
     * x-tagGroups
     *
     * List of tags to include in this group.
     */
    'x-tagGroups'?: XTagGroup[];
};
export declare const XTagGroups: import("@scalar/validation").ObjectSchema<{
    'x-tagGroups': import("@scalar/validation").OptionalSchema<import("@scalar/validation").ArraySchema<import("@scalar/validation").IntersectionSchema<readonly [import("@scalar/validation").ObjectSchema<{
        name: import("@scalar/validation").StringSchema;
        tags: import("@scalar/validation").ArraySchema<import("@scalar/validation").StringSchema>;
    }>, import("@scalar/validation").ObjectSchema<{
        'x-scalar-order': import("@scalar/validation").OptionalSchema<import("@scalar/validation").ArraySchema<import("@scalar/validation").StringSchema>>;
    }>]>>>;
}>;
//# sourceMappingURL=x-tag-groups.d.ts.map