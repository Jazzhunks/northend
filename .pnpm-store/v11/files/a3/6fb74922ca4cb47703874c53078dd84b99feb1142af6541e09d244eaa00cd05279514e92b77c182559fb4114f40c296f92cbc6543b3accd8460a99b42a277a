import { findVariables } from '@scalar/helpers/regex/find-variables';
import { getPathItemOperation } from '../helpers/for-each-path-item-operation.js';
import { getResolvedRef } from '../helpers/get-resolved-ref.js';
import { unpackProxyObject } from '../helpers/unpack-proxy.js';
import { isAsyncApiDocument, isOpenApiDocument } from '../schemas/type-guards.js';
import { coerceValue } from '../schemas/typebox-coerce.js';
import { ServerObjectSchema } from '../schemas/v3.1/strict/openapi-document.js';
/**
 * Resolves the server target (document or operation) from meta.
 * Document-level servers live on the document; operation-level servers on the operation object.
 */
const getServerTarget = (document, meta) => {
    if (!isOpenApiDocument(document)) {
        return null;
    }
    if (meta.type === 'document') {
        return document;
    }
    return getResolvedRef(getPathItemOperation(document.paths?.[meta.path], meta.method)) ?? null;
};
/**
 * Initializes the servers for the document or operation based on meta.
 *
 * @param document - The document to initialize the servers for
 * @param meta - Target context (document or operation)
 */
export const initializeServers = (document, { meta }) => {
    const target = getServerTarget(document, meta);
    if (!target) {
        console.error('Target not found', meta);
        return undefined;
    }
    target.servers = [];
    return target.servers;
};
/**
 * Adds a new ServerObject to the document or operation based on meta.
 *
 * @param document - The document to add the server to
 * @returns the new server object or undefined if the target is not found
 */
export const addServer = (document, { url, select, meta }) => {
    const target = getServerTarget(document, meta);
    if (!target) {
        console.error('Target not found', meta);
        return undefined;
    }
    const parsed = coerceValue(ServerObjectSchema, { url });
    if (!target.servers) {
        target.servers = [];
    }
    target.servers.push(parsed);
    if (select) {
        target['x-scalar-selected-server'] = parsed.url;
    }
    return parsed;
};
/**
 * Creates a map of variable names to their character positions in a URL.
 * Used to detect renamed variables by position matching.
 */
const getVariablePositions = (url, variables) => {
    const positions = {};
    for (const varName of variables) {
        const position = url.indexOf(`{${varName}}`);
        if (position !== -1) {
            positions[varName] = position;
        }
    }
    return positions;
};
/**
 * Syncs server variables when the URL changes.
 *
 * Preserves variable configurations by:
 * 1. Keeping variables with matching names
 * 2. Renaming variables at the same position
 * 3. Creating new variables with empty defaults
 */
const syncVariablesForUrlChange = (newUrl, oldUrl, existingVariables) => {
    // Filter out undefined values from findVariables results
    const oldVariables = findVariables(oldUrl, { includePath: true, includeEnv: false }).filter((v) => v !== undefined);
    const newVariables = findVariables(newUrl, { includePath: true, includeEnv: false }).filter((v) => v !== undefined);
    const oldPositions = getVariablePositions(oldUrl, oldVariables);
    const newPositions = getVariablePositions(newUrl, newVariables);
    const usedOldVariables = new Set();
    const syncedVariables = {};
    for (const newVar of newVariables) {
        // Case 1: Variable with same name exists - preserve its config
        if (existingVariables[newVar]) {
            syncedVariables[newVar] = existingVariables[newVar];
            usedOldVariables.add(newVar);
            continue;
        }
        // Case 2: Check for variable at same position (likely a rename)
        const newVarPosition = newPositions[newVar];
        const oldVarAtPosition = oldVariables.find((oldVar) => oldPositions[oldVar] === newVarPosition && !usedOldVariables.has(oldVar));
        if (oldVarAtPosition && existingVariables[oldVarAtPosition]) {
            // Rename: transfer the old variable's config to the new name
            syncedVariables[newVar] = existingVariables[oldVarAtPosition];
            usedOldVariables.add(oldVarAtPosition);
            continue;
        }
        // Case 3: New variable - create with empty default
        syncedVariables[newVar] = { default: '' };
    }
    return syncedVariables;
};
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
export const updateServer = (document, { index, server, meta }) => {
    const target = getServerTarget(document, meta);
    if (!target) {
        return undefined;
    }
    const oldServer = unpackProxyObject(target.servers?.[index], { depth: 1 });
    if (!oldServer) {
        console.error('Server not found at index:', index);
        return undefined;
    }
    const oldUrl = oldServer.url;
    const updatedServer = coerceValue(ServerObjectSchema, { ...oldServer, ...server });
    const hasUrlChanged = oldUrl && oldUrl !== updatedServer.url;
    if (hasUrlChanged) {
        const existingVariables = updatedServer.variables ?? {};
        updatedServer.variables = syncVariablesForUrlChange(updatedServer.url, oldUrl, existingVariables);
        if (target['x-scalar-selected-server'] === oldUrl) {
            target['x-scalar-selected-server'] = updatedServer.url;
        }
    }
    if (!target.servers) {
        target.servers = [updatedServer];
    }
    else {
        target.servers[index] = updatedServer;
    }
    return updatedServer;
};
/**
 * Deletes a ServerObject at the specified index from the document or operation based on meta.
 *
 * @param document - The document to delete the server from
 * @param index - The index of the server to delete
 * @param meta - Target context (document or operation)
 */
export const deleteServer = (document, { index, meta }) => {
    const target = getServerTarget(document, meta);
    if (!target?.servers) {
        return;
    }
    const url = target.servers[index]?.url;
    target.servers.splice(index, 1);
    if (target['x-scalar-selected-server'] === url) {
        target['x-scalar-selected-server'] = target.servers[0]?.url ?? undefined;
    }
};
/**
 * Clears all servers from the document or operation based on meta.
 *
 * @param document - The document to clear the servers from
 * @param meta - Target context (document or operation)
 */
export const clearServers = (document, { meta }) => {
    const target = getServerTarget(document, meta);
    if (!target) {
        return;
    }
    // Remove the servers array
    target.servers = undefined;
    // Clear the selected server
    target['x-scalar-selected-server'] = undefined;
};
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
export const updateServerVariables = (document, { index, key, value, meta }) => {
    const target = getServerTarget(document, meta);
    const variable = target?.servers?.[index]?.variables?.[key];
    if (!variable) {
        console.error('Variable not found', key, index);
        return;
    }
    variable.default = value;
    return variable;
};
/**
 * Updates the selected server for the document or operation based on meta.
 *
 * @param document - The document to update the selected server in
 * @param url - The URL of the server to select (or '' to clear)
 * @param meta - Target context (document or operation)
 * @returns the url of the selected server or undefined if the target is not found
 */
export const updateSelectedServer = (document, { url, meta }) => {
    const target = getServerTarget(document, meta);
    if (!target) {
        return;
    }
    if (url === '') {
        target['x-scalar-selected-server'] = '';
        return '';
    }
    target['x-scalar-selected-server'] = target['x-scalar-selected-server'] === url ? '' : url;
    return target['x-scalar-selected-server'];
};
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
export const updateSelectedAsyncApiServer = (document, { name }) => {
    if (!isAsyncApiDocument(document)) {
        return undefined;
    }
    document['x-scalar-selected-server'] = name;
    return document['x-scalar-selected-server'];
};
/**
 * Updates a server variable for an AsyncAPI document, identified by server name.
 *
 * @param document - The document to update the server variables in
 * @param name - The name of the server to update
 * @param key - The key of the variable to update
 * @param value - The new value of the variable
 * @returns the updated variable or undefined if it is not found
 */
export const updateAsyncApiServerVariables = (document, { name, key, value }) => {
    if (!isAsyncApiDocument(document)) {
        return undefined;
    }
    const server = getResolvedRef(document.servers?.[name]);
    const variable = server?.variables?.[key] ? getResolvedRef(server.variables[key]) : undefined;
    if (!variable) {
        console.error('Variable not found', key, name);
        return undefined;
    }
    variable.default = value;
    return variable;
};
export const serverMutatorsFactory = ({ document }) => {
    return {
        initializeServers: (payload) => initializeServers(document, payload),
        addServer: (payload) => addServer(document, payload),
        updateServer: (payload) => updateServer(document, payload),
        deleteServer: (payload) => deleteServer(document, payload),
        clearServers: (payload) => clearServers(document, payload),
        updateServerVariables: (payload) => updateServerVariables(document, payload),
        updateSelectedServer: (payload) => updateSelectedServer(document, payload),
        updateSelectedAsyncApiServer: (payload) => updateSelectedAsyncApiServer(document, payload),
        updateAsyncApiServerVariables: (payload) => updateAsyncApiServerVariables(document, payload),
    };
};
