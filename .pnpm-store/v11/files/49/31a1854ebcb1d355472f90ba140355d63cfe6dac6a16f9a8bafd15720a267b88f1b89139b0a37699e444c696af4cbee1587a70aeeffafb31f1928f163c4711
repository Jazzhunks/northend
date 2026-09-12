import type { EnvironmentEvents } from '../events/definitions/environment.js';
import type { Workspace, WorkspaceDocument } from '../schemas.js';
import { type XScalarEnvVar, type XScalarEnvironment } from '../schemas/extensions/document/x-scalar-environments.js';
type Event<T extends keyof EnvironmentEvents> = Omit<EnvironmentEvents[T], 'collectionType'>;
/**
 * Adds OR updates an environment to the document or workspace.
 *
 * @param document - current document if available
 * @param workspace - current workspace if available
 * @param environmentName - Name of the environment to add
 * @param payload - The environment configuration to add
 * @param oldEnvironmentName - Only needed when renaming the environment
 * @returns the parsed environment that was added or updated or undefined if the collection is not found
 */
export declare const upsertEnvironment: (workspace: Workspace | null, collection: WorkspaceDocument | Workspace | null, { environmentName, payload, oldEnvironmentName }: Event<"environment:upsert:environment">) => XScalarEnvironment | undefined;
/**
 * Deletes an environment from the given collection and handles active environment state.
 *
 * @param workspace - The workspace object, or null if unavailable.
 * @param collection - The workspace document or workspace object, or null if unavailable.
 * @param environmentName - The name of the environment to delete.
 */
export declare const deleteEnvironment: (workspace: Workspace | null, collection: WorkspaceDocument | Workspace | null, { environmentName }: Event<"environment:delete:environment">) => void;
/**
 * Adds OR updates an environment variable to the document or workspace.
 *
 * @param collection - Workspace OR document
 * @param environmentName - Name of the environment to add the variable to
 * @param variableName - Name of the variable to add
 * @param value - Value of the variable to add
 * @returns the parsed variable that was added or updated or undefined if the collection is not found
 */
export declare const upsertEnvironmentVariable: (collection: WorkspaceDocument | Workspace | null, { environmentName, variable, index }: Event<"environment:upsert:environment-variable">) => XScalarEnvVar | undefined;
export declare const deleteEnvironmentVariable: (collection: WorkspaceDocument | Workspace | null, { environmentName, index }: Event<"environment:delete:environment-variable">) => void;
export declare const environmentMutatorsFactory: ({ workspace, collection, }: {
    workspace: Workspace | null;
    collection: WorkspaceDocument | Workspace | null;
}) => {
    upsertEnvironment: (payload: Event<"environment:upsert:environment">) => XScalarEnvironment | undefined;
    deleteEnvironment: (payload: Event<"environment:delete:environment">) => void;
    upsertEnvironmentVariable: (payload: Event<"environment:upsert:environment-variable">) => XScalarEnvVar | undefined;
    deleteEnvironmentVariable: (payload: Event<"environment:delete:environment-variable">) => void;
};
export {};
//# sourceMappingURL=environment.d.ts.map