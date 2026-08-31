import { type NavigationOptions } from '../../navigation/get-navigation-options.js';
import type { TraversedEntry } from '../../schemas/navigation.js';
import type { OpenApiDocument } from '../../schemas/v3.1/strict/openapi-document.js';
/**
 * Traverses an OpenAPI Document to generate navigation structure and metadata.
 *
 * This function processes the OpenAPI document to create:
 * - A hierarchical navigation structure for the sidebar
 * - A mapping of IDs to titles for mobile header navigation
 * - Tag-based organization of operations and webhooks
 * - Optional schema/model documentation
 */
export declare const traverseDocument: (documentName: string, document: OpenApiDocument, options?: NavigationOptions) => {
    id: string;
    type: "document";
    title: string;
    name: string;
    children: TraversedEntry[];
    icon: string | undefined;
};
//# sourceMappingURL=traverse-document.d.ts.map