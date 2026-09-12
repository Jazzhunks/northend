import type { TagsMap, TraverseSpecOptions } from '../../navigation/types.js';
import type { TraversedSchema } from '../../schemas/navigation.js';
import type { OpenApiDocument } from '../../schemas/v3.1/strict/openapi-document.js';
/** Traverses the schemas in an OpenAPI document to build an array of model entries.
 *
 * This function processes each schema in components.schemas to:
 * - Filter out internal schemas (marked with x-internal) and schemas to ignore (marked with x-scalar-ignore)
 * - Create model entries with unique references and IDs
 * - Store model IDs and titles for mobile header navigation
 */
export declare const traverseSchemas: ({ document, tagsMap, generateId, documentId, }: {
    document: OpenApiDocument;
    /** Map of tagNames and their entries */
    tagsMap: TagsMap;
    generateId: TraverseSpecOptions["generateId"];
    documentId: string;
}) => TraversedSchema[];
//# sourceMappingURL=traverse-schemas.d.ts.map