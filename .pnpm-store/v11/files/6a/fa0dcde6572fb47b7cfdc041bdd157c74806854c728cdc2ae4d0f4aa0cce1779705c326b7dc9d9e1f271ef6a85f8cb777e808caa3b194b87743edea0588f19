import type { TraversedDocument, TraversedTag, WithParent } from '../../schemas/navigation.js';
/** Maps tag names to all matching tag entries (with parent info) found in the document. */
export type TagEntriesMap = Map<string, WithParent<TraversedTag>[]>;
/**
 * Builds a map of all tag entries in a document, indexed by tag name.
 *
 * Tags with the same name can appear more than once (for example, when the same tag
 * is referenced in multiple x-tagGroups), so each key maps to an array of matches.
 *
 * This is the tag-side counterpart to `getOperationEntries`. Keep them separate so
 * callers only pay for the traversal they actually need.
 *
 * @param document - The traversed OpenAPI document to extract tags from
 * @returns A map where keys are tag names and values are arrays of matching tag entries,
 *          each decorated with a `parent` reference for walking up the tree.
 *
 * @example
 * const tags = getTagEntries(document)
 * const userTagEntries = tags.get('Users') // All tag entries named "Users"
 */
export declare const getTagEntries: (document: TraversedDocument) => TagEntriesMap;
//# sourceMappingURL=get-tag-entries.d.ts.map