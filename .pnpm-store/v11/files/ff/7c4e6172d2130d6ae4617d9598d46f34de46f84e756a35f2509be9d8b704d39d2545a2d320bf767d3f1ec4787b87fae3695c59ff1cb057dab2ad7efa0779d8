import { unpackProxyObject } from '../helpers/unpack-proxy.js';
import { xScalarEnvVarSchema, xScalarEnvironmentSchema, } from '../schemas/extensions/document/x-scalar-environments.js';
import { isAsyncApiDocument } from '../schemas/type-guards.js';
import { coerceValue } from '../schemas/typebox-coerce.js';
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
export const upsertEnvironment = (workspace, collection, { environmentName, payload, oldEnvironmentName }) => {
    /** Discriminating between document and workspace */
    if (!collection || !workspace || isAsyncApiDocument(collection)) {
        return;
    }
    if (!collection['x-scalar-environments']) {
        collection['x-scalar-environments'] = {};
    }
    // Check if this is a new environment before we create it
    const isNewEnvironment = !collection['x-scalar-environments'][oldEnvironmentName ?? environmentName];
    // Ensure we parse the payload but keep the old variables
    const parsed = coerceValue(xScalarEnvironmentSchema, {
        ...unpackProxyObject(collection['x-scalar-environments'][oldEnvironmentName ?? environmentName], { depth: 1 }),
        ...payload,
    });
    collection['x-scalar-environments'][environmentName] = parsed;
    // If we are renaming the environment, we need to delete the old one
    if (oldEnvironmentName && oldEnvironmentName !== environmentName) {
        delete collection['x-scalar-environments'][oldEnvironmentName];
        // If the old environment was active, we need to set the new environment as active
        if (workspace['x-scalar-active-environment'] === oldEnvironmentName) {
            workspace['x-scalar-active-environment'] = environmentName;
        }
    }
    // Set the newly created workspace environment as active
    if (isNewEnvironment) {
        workspace['x-scalar-active-environment'] = environmentName;
    }
    return parsed;
};
/**
 * Deletes an environment from the given collection and handles active environment state.
 *
 * @param workspace - The workspace object, or null if unavailable.
 * @param collection - The workspace document or workspace object, or null if unavailable.
 * @param environmentName - The name of the environment to delete.
 */
export const deleteEnvironment = (workspace, collection, { environmentName }) => {
    if (!collection || !workspace || isAsyncApiDocument(collection)) {
        return;
    }
    // Trigegr the change event for the active environment
    delete collection['x-scalar-environments']?.[environmentName];
};
/**
 * Adds OR updates an environment variable to the document or workspace.
 *
 * @param collection - Workspace OR document
 * @param environmentName - Name of the environment to add the variable to
 * @param variableName - Name of the variable to add
 * @param value - Value of the variable to add
 * @returns the parsed variable that was added or updated or undefined if the collection is not found
 */
export const upsertEnvironmentVariable = (collection, { environmentName, variable, index }) => {
    if (!collection || isAsyncApiDocument(collection)) {
        return;
    }
    // The environment should exist by now if we are upserting a variable
    if (!collection['x-scalar-environments']?.[environmentName]) {
        console.error('Environment not found', environmentName);
        return;
    }
    // Ensure we parse the variable for type safety
    const parsed = coerceValue(xScalarEnvVarSchema, variable);
    if (index !== undefined) {
        // Delete the row if the name is empty
        if (parsed.name === '') {
            collection['x-scalar-environments'][environmentName].variables.splice(index, 1);
            return;
        }
        // Update
        collection['x-scalar-environments'][environmentName].variables[index] = parsed;
    }
    // Add
    else {
        collection['x-scalar-environments'][environmentName].variables.push(parsed);
    }
    return parsed;
};
export const deleteEnvironmentVariable = (collection, { environmentName, index }) => {
    if (!collection || isAsyncApiDocument(collection)) {
        return;
    }
    if (!collection['x-scalar-environments']?.[environmentName]) {
        console.error('Environment not found', environmentName);
        return;
    }
    collection['x-scalar-environments'][environmentName]?.variables?.splice(index, 1);
};
export const environmentMutatorsFactory = ({ workspace, collection, }) => {
    return {
        upsertEnvironment: (payload) => upsertEnvironment(workspace, collection, payload),
        deleteEnvironment: (payload) => deleteEnvironment(workspace, collection, payload),
        upsertEnvironmentVariable: (payload) => upsertEnvironmentVariable(collection, payload),
        deleteEnvironmentVariable: (payload) => deleteEnvironmentVariable(collection, payload),
    };
};
