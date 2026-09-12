import type { HttpMethod } from '@scalar/helpers/http/http-methods';
import type { WorkspaceStore } from '@scalar/workspace-store/client';
import type { TraversedEntry } from '@scalar/workspace-store/schemas/navigation';
/** Payload for routing and opening the API client modal. */
export type RoutePayload = {
    path: string;
    method: HttpMethod;
    example?: string;
    documentSlug?: string;
};
/** Raw input values that may contain "default" placeholders. */
export type DefaultEntities = Record<keyof RoutePayload, string>;
/** Context for resolving route parameters from the workspace store. */
type ResolverContext = {
    store: WorkspaceStore;
    documentSlug: string | undefined;
};
/**
 * Resolves the document slug from a raw input value.
 *
 * When "default" is specified and no document exists with that slug,
 * we fall back to the active document or the first available document.
 * Modal routing is OpenAPI-only, so the fallback skips AsyncAPI documents —
 * otherwise opening the modal with default params on a workspace that has
 * an AsyncAPI active or first document would hand a slug back that
 * `getDocument` then resolves to undefined, rendering the modal with
 * `document: null` even when OpenAPI documents exist.
 */
export declare const resolveDocumentSlug: (store: WorkspaceStore, slug: string | undefined) => string | undefined;
/**
 * Resolves the path from a raw input value.
 *
 * When "default" is specified, returns the first available path in the document.
 * This is useful for initial navigation when no specific path is requested.
 */
export declare const resolvePath: (ctx: ResolverContext, path: string | undefined) => string | undefined;
/**
 * Resolves the HTTP method from a raw input value.
 *
 * When "default" is specified, returns the first valid HTTP method for the given path.
 * This ensures we select a real method rather than metadata keys like "parameters" or "summary".
 */
export declare const resolveMethod: (ctx: ResolverContext, path: string | undefined, method: string | undefined) => HttpMethod | undefined;
/**
 * Resolves the example name from a raw input value.
 *
 * When "default" is specified, returns the first available example name.
 * Falls back to "default" when no examples exist, which signals to use the default request body.
 */
export declare const resolveExampleName: (ctx: ResolverContext, operation: TraversedEntry | undefined, exampleKey: string | undefined) => string;
/**
 * Resolves all route parameters from raw input values to their actual values.
 *
 * This function handles "default" placeholders by looking up actual values from the workspace store.
 * It ensures the modal can be opened even when the caller does not know specific paths, methods, or examples.
 */
export declare const resolveRouteParameters: (store: WorkspaceStore, params: DefaultEntities) => Partial<RoutePayload>;
export {};
//# sourceMappingURL=resolve-route-parameters.d.ts.map