import type { PathMethodHistory } from '../entities/history/schema.js';
import type { InMemoryWorkspace } from '../schemas/inmemory-workspace.js';
import type { WorkspaceMeta } from '../schemas/workspace.js';
/**
 * Lookup key for fetching a workspace by its URL slugs. Both `teamSlug` and
 * `slug` are mutable metadata — they map to a stable `workspaceUid` via the
 * `teamSlug_slug` unique index. `teamSlug` defaults to `'local'` so personal
 * workspaces can omit it.
 */
type WorkspaceSlugKey = {
    teamSlug?: string;
    slug: string;
};
/**
 * Full record written to the workspace object store. `workspaceUid` is the
 * primary key and is the only identifier that survives slug renames.
 */
type WorkspaceRecord = {
    workspaceUid: string;
    teamUid: string;
    teamSlug: string;
    slug: string;
    name: string;
};
type WorkspaceStoreShape = {
    name: string;
    workspace: InMemoryWorkspace;
};
/**
 * Generates a fresh `workspaceUid` for new workspaces.
 *
 * Wraps `crypto.randomUUID` so every caller produces UIDs in a consistent
 * shape and we can swap the implementation later without rippling through
 * the codebase.
 */
export declare const generateWorkspaceUid: () => string;
/**
 * Creates the persistence layer for the workspace store using IndexedDB.
 *
 * Storage model:
 * - `workspace` is the catalog. Its primary key is `workspaceUid`, a
 *   stable UUID that does not change when the user (or the server)
 *   renames the team or workspace slug. Two indexes back the runtime:
 *     - `teamSlug_slug` (unique) for slug-based URL lookups.
 *     - `teamUid` for team-scoped queries.
 * - Every chunk table (`meta`, `documents`, ...) is keyed by
 *   `workspaceUid` so chunks survive slug renames without ever being
 *   re-keyed.
 */
export declare const createWorkspaceStorePersistence: () => Promise<{
    close: () => void;
    meta: {
        /**
         * Loads persisted workspace meta only (no document or other chunk
         * reads). Returns an empty object when no meta row exists yet.
         */
        getItem: (workspaceUid: string) => Promise<InMemoryWorkspace["meta"]>;
        /** Set meta data for a workspace. */
        setItem: (workspaceUid: string, data: WorkspaceMeta) => Promise<void>;
    };
    documents: {
        /** Set (persist) a workspace document using workspaceUid and documentName as composite key. */
        setItem: (workspaceUid: string, documentName: string, data: InMemoryWorkspace["documents"][string]) => Promise<void>;
    };
    originalDocuments: {
        /** Set an original (raw) document for a workspace/document pair. */
        setItem: (workspaceUid: string, documentName: string, data: InMemoryWorkspace["originalDocuments"][string]) => Promise<void>;
    };
    intermediateDocuments: {
        /** Set an intermediate (transformed) document for a workspace/document pair. */
        setItem: (workspaceUid: string, documentName: string, data: InMemoryWorkspace["intermediateDocuments"][string]) => Promise<void>;
    };
    overrides: {
        /** Set document overrides for a workspace/document pair. */
        setItem: (workspaceUid: string, documentName: string, data: InMemoryWorkspace["overrides"][string]) => Promise<void>;
    };
    history: {
        /** Set history for a document. */
        setItem: (workspaceUid: string, documentName: string, data: PathMethodHistory) => Promise<void>;
    };
    auth: {
        /** Set auth for a document. */
        setItem: (workspaceUid: string, documentName: string, data: InMemoryWorkspace["auth"][string]) => Promise<void>;
    };
    workspace: {
        /**
         * Retrieves a workspace by its stable UID, returning the full
         * assembled state (chunks included). Returns `undefined` when no
         * workspace matches.
         *
         * This is the primary lookup path because the UID never changes,
         * making it safe to cache and reference across slug renames.
         */
        getItem: (workspaceUid: string) => Promise<(WorkspaceStoreShape & WorkspaceRecord) | undefined>;
        /**
         * Retrieves a workspace by its mutable `[teamSlug, slug]` pair.
         *
         * Use this when the only thing you have is the URL — for example
         * when the router needs to resolve `/@<teamSlug>/<workspaceSlug>`
         * back to a workspace. For all other cases, prefer `getItem(uid)`
         * because the slugs can change at any time.
         */
        getItemBySlug: ({ teamSlug, slug, }: WorkspaceSlugKey) => Promise<(WorkspaceStoreShape & WorkspaceRecord) | undefined>;
        /**
         * Retrieves all workspace catalog records.
         *
         * Only returns the workspace shell (`workspaceUid`, `teamUid`,
         * `teamSlug`, `slug`, `name`). To get the full workspace data
         * including documents and metadata, use `getItem(workspaceUid)`.
         */
        getAll: () => Promise<WorkspaceRecord[]>;
        /**
         * Retrieves all workspaces for a given team UID. Uses the `teamUid`
         * index, so this is O(matches) rather than a full scan.
         *
         * Prefer this over `getAllByTeamSlug` because the team UID is the
         * canonical identifier and survives team-slug renames.
         */
        getAllByTeamUid: (teamUid: string) => Promise<WorkspaceRecord[]>;
        /**
         * Retrieves all workspaces for a given team slug. Uses the
         * `teamSlug_slug` compound index as a prefix scan. Useful when the
         * only thing on hand is the URL segment; otherwise prefer
         * `getAllByTeamUid`.
         */
        getAllByTeamSlug: (teamSlug: string) => Promise<WorkspaceRecord[]>;
        /**
         * Saves a workspace and all of its chunks. The caller is responsible
         * for providing a stable `workspaceUid` (typically `crypto.randomUUID()`
         * for new records, or the existing UID for updates).
         *
         * `teamSlug` and `slug` are validated by the underlying unique index;
         * attempting to persist a duplicate pair will reject the transaction.
         */
        setItem: ({ workspaceUid, teamUid, teamSlug, slug, }: {
            workspaceUid: string;
            teamUid?: string;
            teamSlug?: string;
            slug: string;
        }, value: WorkspaceStoreShape) => Promise<WorkspaceRecord>;
        /**
         * Deletes an entire workspace and every chunk that belongs to it.
         * Safe to call on a workspace that does not exist — the chunk
         * deletions are range scans that simply find nothing to delete.
         */
        deleteItem: (workspaceUid: string) => Promise<void>;
        /**
         * Deletes a single document and all related chunks (overrides,
         * history, auth, ...) for the given workspace/document pair.
         */
        deleteDocument: (workspaceUid: string, documentName: string) => Promise<void>;
        /**
         * Updates the name of an existing workspace. Returns the updated
         * record, or `undefined` when the workspace does not exist.
         */
        updateName: (workspaceUid: string, name: string) => Promise<WorkspaceRecord | undefined>;
        /**
         * Updates the mutable slug metadata for an existing workspace.
         * Returns the updated record, or `undefined` when the workspace
         * does not exist, or when another workspace already owns the target
         * `[teamSlug, slug]` pair (the `teamSlug_slug` index is unique).
         *
         * Use this when the server tells us a team slug or workspace slug
         * has changed. The `workspaceUid` stays the same, so all chunk
         * references continue to resolve.
         */
        updateSlugs: (workspaceUid: string, slugs: {
            teamSlug?: string;
            slug?: string;
        }) => Promise<WorkspaceRecord | undefined>;
        /** Checks if a workspace with the given UID exists. */
        has: (workspaceUid: string) => Promise<boolean>;
        /** Checks if a workspace with the given `[teamSlug, slug]` pair exists. */
        hasSlug: ({ teamSlug, slug }: WorkspaceSlugKey) => Promise<boolean>;
    };
    clear: () => Promise<void>;
}>;
export {};
//# sourceMappingURL=index.d.ts.map