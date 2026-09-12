import type { AsyncApiServerVariableObject } from '@scalar/types/asyncapi/3.1';
import type { ServerEvents } from '../events/definitions/server.js';
import { type ServerObject } from '../schemas/v3.1/strict/openapi-document.js';
import type { WorkspaceDocument } from '../schemas/workspace.js';
/**
 * Initializes the servers for the document or operation based on meta.
 *
 * @param document - The document to initialize the servers for
 * @param meta - Target context (document or operation)
 */
export declare const initializeServers: (document: WorkspaceDocument | null, { meta }: ServerEvents["server:initialize:servers"]) => ServerObject[] | undefined;
/**
 * Adds a new ServerObject to the document or operation based on meta.
 *
 * @param document - The document to add the server to
 * @returns the new server object or undefined if the target is not found
 */
export declare const addServer: (document: WorkspaceDocument | null, { url, select, meta }: ServerEvents["server:add:server"]) => ServerObject | undefined;
/**
 * Updates a ServerObject in the document or operation based on meta.
 * When the URL changes, intelligently syncs variables by preserving configurations
 * for renamed variables (detected by position) and existing variables.
 *
 * @param document - The document containing the server to update
 * @param index - The index of the server to update
 * @param server - The partial server object with fields to update
 * @param meta - Target context (document or operation)
 * @returns the updated server object or undefined if the server is not found
 */
export declare const updateServer: (document: WorkspaceDocument | null, { index, server, meta }: ServerEvents["server:update:server"]) => ServerObject | undefined;
/**
 * Deletes a ServerObject at the specified index from the document or operation based on meta.
 *
 * @param document - The document to delete the server from
 * @param index - The index of the server to delete
 * @param meta - Target context (document or operation)
 */
export declare const deleteServer: (document: WorkspaceDocument | null, { index, meta }: ServerEvents["server:delete:server"]) => void;
/**
 * Clears all servers from the document or operation based on meta.
 *
 * @param document - The document to clear the servers from
 * @param meta - Target context (document or operation)
 */
export declare const clearServers: (document: WorkspaceDocument | null, { meta }: ServerEvents["server:clear:servers"]) => void;
/**
 * Updates a server variable for the document or operation based on meta.
 *
 * @param document - The document to update the server variables in
 * @param index - The index of the server to update
 * @param key - The key of the variable to update
 * @param value - The new value of the variable
 * @param meta - Target context (document or operation)
 * @returns the updated variable or undefined if the variable is not found
 */
export declare const updateServerVariables: (document: WorkspaceDocument | null, { index, key, value, meta }: ServerEvents["server:update:variables"]) => import("../schemas/v3.1/strict/openapi-document.js").ServerVariableObject | undefined;
/**
 * Updates the selected server for the document or operation based on meta.
 *
 * @param document - The document to update the selected server in
 * @param url - The URL of the server to select (or '' to clear)
 * @param meta - Target context (document or operation)
 * @returns the url of the selected server or undefined if the target is not found
 */
export declare const updateSelectedServer: (document: WorkspaceDocument | null, { url, meta }: ServerEvents["server:update:selected"]) => string | undefined;
/**
 * Updates the selected server for an AsyncAPI document.
 *
 * AsyncAPI servers are a named map, so the selection is stored as the server
 * name in `x-scalar-selected-server`. There is always an effective server
 * (`getSelectedAsyncApiServer` falls back to the first one), so this simply sets
 * the selection rather than toggling it off.
 *
 * @param document - The document to update the selected server in
 * @param name - The name of the server to select
 * @returns the name of the selected server or undefined if the document is not AsyncAPI
 */
export declare const updateSelectedAsyncApiServer: (document: WorkspaceDocument | null, { name }: ServerEvents["asyncapi-server:update:selected"]) => string | undefined;
/**
 * Updates a server variable for an AsyncAPI document, identified by server name.
 *
 * @param document - The document to update the server variables in
 * @param name - The name of the server to update
 * @param key - The key of the variable to update
 * @param value - The new value of the variable
 * @returns the updated variable or undefined if it is not found
 */
export declare const updateAsyncApiServerVariables: (document: WorkspaceDocument | null, { name, key, value }: ServerEvents["asyncapi-server:update:variables"]) => AsyncApiServerVariableObject | undefined;
export declare const serverMutatorsFactory: ({ document }: {
    document: WorkspaceDocument | null;
}) => {
    initializeServers: (payload: ServerEvents["server:initialize:servers"]) => ServerObject[] | undefined;
    addServer: (payload: ServerEvents["server:add:server"]) => ServerObject | undefined;
    updateServer: (payload: ServerEvents["server:update:server"]) => ServerObject | undefined;
    deleteServer: (payload: ServerEvents["server:delete:server"]) => void;
    clearServers: (payload: ServerEvents["server:clear:servers"]) => void;
    updateServerVariables: (payload: ServerEvents["server:update:variables"]) => import("../schemas/v3.1/strict/openapi-document.js").ServerVariableObject | undefined;
    updateSelectedServer: (payload: ServerEvents["server:update:selected"]) => string | undefined;
    updateSelectedAsyncApiServer: (payload: ServerEvents["asyncapi-server:update:selected"]) => string | undefined;
    updateAsyncApiServerVariables: (payload: ServerEvents["asyncapi-server:update:variables"]) => AsyncApiServerVariableObject | undefined;
};
//# sourceMappingURL=server.d.ts.map