import type { WorkspaceStore } from '../../client.js';
import { type XScalarEnvironment } from '../../schemas/extensions/document/x-scalar-environments.js';
import type { WorkspaceDocument } from '../../schemas/workspace.js';
/**
 * Returns the active environment context for a given workspace and document.
 *
 * - If there is no workspace, returns a default (empty) environment.
 * - If no environment is selected (no active environment), returns a default environment.
 * - Otherwise, combines variables from both the workspace and document environments,
 *   merging document environment values over workspace ones. The variables arrays from both
 *   sources are concatenated and passed through the environment schema.
 *
 * @param workspace Workspace store instance or null if unavailable
 * @param document Document data or null if unavailable
 * @returns An object with the environment name (or null) and a validated XScalarEnvironment
 */
export declare const getActiveEnvironment: (workspace: WorkspaceStore | null, document: WorkspaceDocument | null) => {
    name: string | null;
    environment: XScalarEnvironment;
};
//# sourceMappingURL=environment.d.ts.map