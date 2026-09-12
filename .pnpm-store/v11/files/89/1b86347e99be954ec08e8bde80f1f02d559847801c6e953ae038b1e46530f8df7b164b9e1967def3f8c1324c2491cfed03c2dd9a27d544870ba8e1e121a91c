import type { Migration } from '../../persistence/indexdb.js';
type WorkspaceRecordV1 = {
    name: string;
    /** Team UID at the time of save. Often missing for personal workspaces. */
    teamUid?: string;
    /** Team slug at the time of save. Doubled as the team identifier in v1. */
    namespace: string;
    /** Workspace slug at the time of save. */
    slug: string;
};
type WorkspaceRecordV2 = {
    workspaceUid: string;
    teamUid: string;
    teamSlug: string;
    slug: string;
    name: string;
};
/**
 * Picks a slug that does not collide with anything in `taken`.
 * Falls back to `<slug>-2`, `<slug>-3`, ... when the desired slug is already used.
 *
 * Collapsing every legacy workspace into the local team can produce
 * `[local, <slug>]` collisions whenever a team workspace shared a slug
 * with an existing local workspace (or with another team workspace). The
 * unique `[teamSlug, slug]` index would otherwise reject the upgrade, so
 * this helper resolves collisions deterministically.
 */
export declare const pickUniqueSlug: (desired: string, taken: ReadonlySet<string>) => string;
/**
 * Computes the new shape for every workspace.
 *
 * Every record is collapsed into the local team: `teamUid` and `teamSlug`
 * are both forced to `'local'`. Slug uniqueness is enforced by reserving
 * the legacy local-team slugs first (they keep their slug verbatim), then
 * placing every team workspace on top with a `-2`, `-3`, ... suffix when
 * the desired slug is already taken.
 *
 * A fresh `workspaceUid` is generated for every record so the new
 * identifier is stable across future slug renames.
 */
export declare const planWorkspaceMigration: (workspaces: readonly WorkspaceRecordV1[]) => Array<{
    before: {
        namespace: string;
        slug: string;
    };
    after: WorkspaceRecordV2;
}>;
export declare const v2TeamToLocalMigration: Migration;
export {};
//# sourceMappingURL=v2-team-to-local.d.ts.map