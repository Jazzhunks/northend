import type { CookieEvents } from '../events/definitions/cookie.js';
import type { Workspace, WorkspaceDocument } from '../schemas.js';
import { type XScalarCookie } from '../schemas/extensions/general/x-scalar-cookies.js';
type Event<T extends keyof CookieEvents> = Omit<CookieEvents[T], 'collectionType'>;
/**
 * Adds OR updates a cookie to the document or workspace.
 *
 * @param document - current document if available
 * @param workspace - current workspace if available
 * @param payload - The cookie configuration to add or update
 * @param index - Optional index for updating an existing cookie
 * @param collectionType - Whether this is for a document or workspace
 * @returns the parsed cookie that was added or updated or undefined if the collection is not found
 */
export declare const upsertCookie: (collection: WorkspaceDocument | Workspace | null, { payload, index }: Event<"cookie:upsert:cookie">) => XScalarCookie | undefined;
/**
 * Deletes a cookie from the document or workspace by index.
 *
 * @param document - current document if available
 * @param workspace - current workspace if available
 * @param index - Index of the cookie to delete
 * @param collectionType - Whether this is for a document or workspace
 * @returns true if the cookie was deleted, false otherwise
 */
export declare const deleteCookie: (collection: WorkspaceDocument | Workspace | null, { index }: Event<"cookie:delete:cookie">) => boolean;
export declare const cookieMutatorsFactory: ({ collection }: {
    collection: WorkspaceDocument | Workspace | null;
}) => {
    upsertCookie: (payload: Event<"cookie:upsert:cookie">) => XScalarCookie | undefined;
    deleteCookie: (payload: Event<"cookie:delete:cookie">) => boolean;
};
export {};
//# sourceMappingURL=cookie.d.ts.map