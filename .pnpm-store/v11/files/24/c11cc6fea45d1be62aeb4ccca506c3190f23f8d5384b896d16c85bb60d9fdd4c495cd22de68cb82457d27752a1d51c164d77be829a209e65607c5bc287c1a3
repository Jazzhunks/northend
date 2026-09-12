import type { HarRequest } from '@scalar/snippetz';
import type { OperationObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
type HarToOperationProps = {
    /** HAR request to convert */
    harRequest: HarRequest;
    /** Name of the example to populate (e.g., 'default', 'example1') */
    exampleKey: string;
    /** Optional base operation to merge with */
    baseOperation?: OperationObject;
    /** Optional path variables to merge with */
    pathVariables?: Record<string, string>;
};
/**
 * Converts a HAR request back to an OpenAPI Operation object with populated examples.
 *
 * This function is the reverse of operationToHar - it takes a HAR request and
 * converts it back into an OpenAPI operation structure, populating the example
 * values based on the HAR request data.
 *
 * The conversion handles:
 * - URL parsing to extract path and query parameters
 * - Header extraction and mapping to operation parameters
 * - Query string parsing and mapping to parameters
 * - Cookie extraction and mapping to cookie parameters
 * - Request body extraction and mapping to requestBody with examples
 * - Content-Type detection and media type assignment
 *
 * Note: This function focuses on populating examples and does not reconstruct
 * schema definitions. If you need full schema generation, consider combining
 * this with a schema inference tool.
 *
 * @see https://w3c.github.io/web-performance/specs/HAR/Overview.html
 * @see https://spec.openapis.org/oas/v3.1.0#operation-object
 */
export declare const harToOperation: ({ harRequest, exampleKey, baseOperation, pathVariables, }: HarToOperationProps) => OperationObject;
export {};
//# sourceMappingURL=har-to-operation.d.ts.map