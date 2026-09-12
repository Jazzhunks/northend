import type { ComponentsObject, OpenApiDocument, SecurityRequirementObject, SecuritySchemeObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
/** A single security scheme option used in the auth dropdown */
export type SecuritySchemeOption = {
    id: string;
    label: string;
    value: SecurityRequirementObject;
    isDeletable?: boolean;
    payload?: SecuritySchemeObject;
};
/** A group of security scheme options used in the auth dropdown */
export type SecuritySchemeGroup = {
    label: string;
    options: SecuritySchemeOption[];
};
/**
 * Format a scheme object into a display object
 *
 * We also add a hash to the id to ensure it is unique across
 * multiple requirements of the same scheme with different scopes
 */
export declare const formatScheme: ({ name, value }: {
    name: string;
    value: SecurityRequirementObject;
}) => {
    id: string;
    label: string;
    value: Partial<Record<string, string[]>>;
    isDeletable: boolean;
};
/** Formats complex security schemes */
export declare const formatComplexScheme: (scheme: NonNullable<OpenApiDocument["security"]>[number]) => {
    id: string;
    label: string;
    value: Partial<Record<string, string[]>>;
    isDeletable: boolean;
};
/**
 * Generates the options for the security scheme combobox
 *
 * Contains either a flat list, or different groups of required, available, and add new
 */
export declare const getSecuritySchemeOptions: (security: NonNullable<OpenApiDocument["security"]>, securitySchemes: NonNullable<ComponentsObject["securitySchemes"]>, 
/** We need to add the selected schemes if they do not already exist in the calculated options */
selectedSchemes: SecurityRequirementObject[], 
/** Allows adding authentication which is not in the document */
canAddNewAuth?: boolean) => SecuritySchemeOption[] | SecuritySchemeGroup[];
//# sourceMappingURL=security-scheme.d.ts.map