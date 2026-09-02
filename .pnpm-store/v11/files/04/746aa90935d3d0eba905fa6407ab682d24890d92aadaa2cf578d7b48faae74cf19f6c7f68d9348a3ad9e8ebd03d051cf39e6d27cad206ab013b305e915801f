type TabIcon = 'request' | 'document';
export type Tab = {
    path: string;
    title: string;
    icon?: TabIcon;
};
export declare const Tab: import("@scalar/validation").ObjectSchema<{
    path: import("@scalar/validation").StringSchema;
    title: import("@scalar/validation").StringSchema;
    icon: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
}>;
/**
 * Schema for workspace tab configuration.
 *
 * This extension allows storing the list of open tabs and which tab is currently active.
 * Useful for preserving user's workspace state across sessions.
 */
export declare const XScalarTabsSchema: import("@scalar/typebox").TObject<{
    /** Array of tab identifiers that are currently open in the workspace */
    'x-scalar-tabs': import("@scalar/typebox").TOptional<import("@scalar/typebox").TArray<import("@scalar/typebox").TObject<{
        path: import("@scalar/typebox").TString;
        title: import("@scalar/typebox").TString;
        icon: import("@scalar/typebox").TOptional<import("@scalar/typebox").TString>;
    }>>>;
    /** The identifier of the currently active/focused tab */
    'x-scalar-active-tab': import("@scalar/typebox").TOptional<import("@scalar/typebox").TNumber>;
}>;
/**
 * TypeScript type for workspace tab configuration.
 *
 * Used to persist which tabs are open and which one is active,
 * allowing users to restore their workspace state when returning to the application.
 */
export type XScalarTabs = {
    /** Array of tab identifiers that are currently open in the workspace */
    'x-scalar-tabs'?: Tab[];
    /** The identifier of the currently active/focused tab */
    'x-scalar-active-tab'?: number;
};
export declare const XScalarTabs: import("@scalar/validation").ObjectSchema<{
    'x-scalar-tabs': import("@scalar/validation").OptionalSchema<import("@scalar/validation").ArraySchema<import("@scalar/validation").ObjectSchema<{
        path: import("@scalar/validation").StringSchema;
        title: import("@scalar/validation").StringSchema;
        icon: import("@scalar/validation").OptionalSchema<import("@scalar/validation").StringSchema>;
    }>>>;
    'x-scalar-active-tab': import("@scalar/validation").OptionalSchema<import("@scalar/validation").NumberSchema>;
}>;
export {};
//# sourceMappingURL=x-scalar-tabs.d.ts.map