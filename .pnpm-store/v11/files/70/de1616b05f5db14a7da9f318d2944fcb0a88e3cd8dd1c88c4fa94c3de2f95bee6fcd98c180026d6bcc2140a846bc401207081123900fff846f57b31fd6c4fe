import type { AsyncApiDocument } from '@scalar/types/asyncapi/3.1';
import { type NavigationOptions } from '../../navigation/get-navigation-options.js';
import type { TraversedDocument } from '../../schemas/navigation.js';
/** AsyncAPI document plus Scalar navigation extensions written during traversal. */
type AsyncApiDocumentWithNavigationExtensions = AsyncApiDocument & {
    'x-scalar-order'?: string[];
    'x-scalar-icon'?: string;
};
/**
 * Entry point: walks an AsyncAPI document and produces the sidebar tree.
 *
 * High-level flow:
 * 1. `collectChannelBuckets` — resolve refs, group operations by channel, collect channel tags.
 * 2. For each bucket — build the channel entry at the document root with all of its operations.
 * 3. Apply channel-level tags so a channel can also appear under each of its tags.
 * 4. Sort tags and top-level entries, then persist `x-scalar-order` on the document for stable ordering.
 *
 * Operation-level tags are intentionally not used to group channels yet; only channel-level
 * tags drive tag grouping.
 */
export declare const traverseAsyncApiDocument: (documentName: string, document: AsyncApiDocumentWithNavigationExtensions, options?: NavigationOptions) => TraversedDocument;
export {};
//# sourceMappingURL=traverse-asyncapi-document.d.ts.map