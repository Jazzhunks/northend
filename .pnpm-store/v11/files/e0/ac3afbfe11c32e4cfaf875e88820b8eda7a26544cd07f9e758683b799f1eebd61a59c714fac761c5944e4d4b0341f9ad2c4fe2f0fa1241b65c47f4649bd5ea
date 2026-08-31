import { createWorkspaceStorePersistence } from '@scalar/workspace-store/persistence';
import type { InMemoryWorkspace } from '@scalar/workspace-store/schemas/inmemory-workspace';
import type { v_2_5_0 } from '../migrations/v-2.5.0/types.generated.js';
/**
 * Migrates localStorage data to IndexedDB workspace structure.
 *
 * Called early in app initialization (app-state.ts) before workspace data loads.
 * Idempotent and non-destructive - runs when legacy data exists but IndexedDB is empty.
 *
 * Flow:
 * 1. Check if migration needed (has legacy data + IndexedDB is empty)
 * 2. Run existing migrations to get latest data structure
 * 3. Transform to new workspace format
 * 4. Save to IndexedDB
 *
 * Old data is preserved for rollback. Typically completes in < 1 second.
 */
export declare const migrateLocalStorageToIndexDb: () => Promise<void>;
/**
 * Checks if migration is needed by verifying IndexedDB state and presence of legacy data.
 *
 * Migration is needed when:
 * 1. Legacy data exists in localStorage (workspace, collection, or request keys)
 * 2. AND IndexedDB has no workspaces yet
 *
 * This approach is more reliable than using a flag because:
 * - If IndexedDB is cleared, migration will run again automatically
 * - No risk of flag getting out of sync with actual data state
 * - Handles edge cases like partial migrations or database corruption
 */
export declare const shouldMigrateToIndexDb: (workspacePersistence: Awaited<ReturnType<typeof createWorkspaceStorePersistence>>["workspace"]) => Promise<boolean>;
/**
 * Transforms legacy localStorage data into IndexedDB workspace structure.
 *
 * Transformations:
 * - Collections → Documents (collections were OpenAPI specs)
 * - Environments → x-scalar-environments in meta
 * - Cookies → x-scalar-cookies in meta
 * - Workspace properties → meta extensions (activeEnvironmentId, proxyUrl, themeId)
 *
 * Creates a default workspace if none exist. Falls back to collection uid if info.title is missing.
 */
export declare const transformLegacyDataToWorkspace: (legacyData: {
    arrays: v_2_5_0["DataArray"];
    records: v_2_5_0["DataRecord"];
}) => Promise<{
    slug: string;
    name: string;
    workspace: InMemoryWorkspace;
}[]>;
//# sourceMappingURL=migrate-to-indexdb.d.ts.map