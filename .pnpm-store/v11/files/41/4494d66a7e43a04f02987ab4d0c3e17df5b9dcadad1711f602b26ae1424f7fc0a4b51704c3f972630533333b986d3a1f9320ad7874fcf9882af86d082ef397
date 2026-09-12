import type { OpenApiDocument } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
import type { FuseResult } from 'fuse.js';
import { type MaybeRefOrGetter } from 'vue';
import type { FuseData } from '../types';
/**
 * Fuzzy search scoped to a single OpenAPI document.
 *
 * Mirrors the behaviour of the reference search modal (`@scalar/api-reference`)
 * but stays local to api-client so the two packages do not have a circular
 * dependency. The index is rebuilt whenever the source document changes.
 *
 * When the query is empty we surface the first `MAX_SEARCH_RESULTS` entries of
 * the index as a zero-state list, matching the reference UX.
 */
export declare function useDocumentSearch(document: MaybeRefOrGetter<OpenApiDocument | undefined>): {
    results: import("vue").ComputedRef<FuseResult<FuseData>[]>;
    query: import("vue").Ref<string, string>;
};
//# sourceMappingURL=use-document-search.d.ts.map