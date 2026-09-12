import { type XScalarCookie } from '@scalar/workspace-store/schemas/extensions/general/x-scalar-cookies';
import type { ParameterObject, ReferenceType } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
/**
 * Converts the parameters into a set of headers, cookies and url params while
 * replacing environment variables and extracting example values. Also builds up a record of the path
 * parameters which can then be used to replace variables in the path.
 * Also handles both content based and schema based parameters.
 *
 * @param parameters - Unfiltered parameters
 * @param exampleName - The key of the current example
 * @returns A set of headers, cookies and url params
 */
export declare const buildRequestParameters: (
/** All parameters */
parameters?: ReferenceType<ParameterObject>[], 
/** The key of the current example */
exampleName?: string) => {
    cookies: XScalarCookie[];
    headers: Record<string, string>;
    pathVariables: Record<string, string>;
    allowReservedQueryParameters: Set<string>;
    urlParams: URLSearchParams;
};
//# sourceMappingURL=build-request-parameters.d.ts.map