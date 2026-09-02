import type { Migration } from '../../persistence/indexdb.js';
/**
 * v1 — initial schema for the workspace store.
 *
 * This migration defines the database as it first shipped: a `workspace`
 * object store keyed by `[namespace, slug]` with a `teamUid` index, a `meta`
 * store keyed by `workspaceId`, and six per-document chunk stores keyed by
 * `[workspaceId, documentName]`.
 *
 * Every installation — fresh or upgraded — runs this migration. Fresh installs
 * execute the full chain starting here, then each subsequent migration
 * transforms the schema into the latest shape. Upgraded installs are already
 * past v1 and skip it.
 *
 * Intentionally uses the ORIGINAL field names (including `teamUid`); later
 * migrations are free to rename, drop, or reshape them.
 */
export declare const v1InitialMigration: Migration;
//# sourceMappingURL=v1-initial.d.ts.map