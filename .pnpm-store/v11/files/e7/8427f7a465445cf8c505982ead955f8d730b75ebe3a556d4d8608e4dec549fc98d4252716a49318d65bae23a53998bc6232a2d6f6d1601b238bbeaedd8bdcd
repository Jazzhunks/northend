import type { TagsMap, TraverseSpecOptions } from '../../navigation/types.js';
import type { TraversedEntry } from '../../schemas/navigation.js';
import type { OpenApiDocument } from '../../schemas/v3.1/strict/openapi-document.js';
type Options = Pick<TraverseSpecOptions, 'tagsSorter' | 'operationsSorter' | 'generateId'>;
/**
 * Traverses the tags map to create navigation entries, handling both grouped and ungrouped tags.
 *
 * This function processes the OpenAPI document's tags to:
 * - Handle tag groups if specified via x-tagGroups
 * - Sort tags and their operations according to provided sorters
 * - Create navigation entries for each tag or tag group
 */
export declare const traverseTags: ({ document, tagsMap, documentId, options: { generateId, tagsSorter, operationsSorter }, }: {
    document: OpenApiDocument;
    /** Map of tags and their entries */
    tagsMap: TagsMap;
    documentId: string;
    options: Options;
}) => TraversedEntry[];
export {};
//# sourceMappingURL=traverse-tags.d.ts.map