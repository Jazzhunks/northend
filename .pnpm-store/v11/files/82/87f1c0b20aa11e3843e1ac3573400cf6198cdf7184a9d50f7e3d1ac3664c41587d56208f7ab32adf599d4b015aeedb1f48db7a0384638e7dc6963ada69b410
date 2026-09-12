import type { AsyncApiInfoObject } from '@scalar/types/asyncapi/3.1';
import type { TraverseSpecOptions } from '../../navigation/types.js';
import type { TraversedDescription } from '../../schemas/navigation.js';
import type { InfoObject } from '../../schemas/v3.1/strict/info.js';
/**
 * Creates a hierarchical navigation structure from markdown headings in an OpenAPI or AsyncAPI description.
 *
 * The function processes markdown headings to create a two-level navigation tree:
 * - Level 1: Main sections (based on the lowest heading level found)
 * - Level 2: Subsections (one level deeper than the main sections)
 *
 * If the description starts with content rather than a heading, an "Introduction" section
 * is automatically added as the first entry.
 *
 * @param description - The markdown description text to process
 * @param generateId - Function to generate unique IDs for headings
 * @param parentId - The ID of the parent entry
 * @param info - OpenAPI or AsyncAPI Info Object
 *
 * @returns Array of TraversedDescription entries with their hierarchy
 */
export declare const traverseDescription: ({ generateId, parentId, info, }: {
    generateId: TraverseSpecOptions["generateId"];
    parentId: string;
    info: InfoObject | AsyncApiInfoObject;
}) => TraversedDescription[];
//# sourceMappingURL=traverse-description.d.ts.map