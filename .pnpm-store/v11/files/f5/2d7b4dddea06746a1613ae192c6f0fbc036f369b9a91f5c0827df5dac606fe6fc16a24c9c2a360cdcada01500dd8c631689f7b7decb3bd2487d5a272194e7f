import fs from 'node:fs/promises';
import { cwd } from 'node:process';
import { parseJsonPointerSegments } from '@scalar/helpers/json/parse-json-pointer-segments';
import { getValueAtPath } from '@scalar/helpers/object/get-value-at-path';
import { fetchUrls, readFiles } from '@scalar/json-magic/bundle/plugins/node';
import { escapeJsonPointer } from '@scalar/json-magic/helpers/escape-json-pointer';
import { upgrade } from '@scalar/openapi-upgrader';
import { forEachPathItemOperation, getResolvedPathItem } from './helpers/for-each-path-item-operation.js';
import { keyOf } from './helpers/general.js';
import { getResolvedRef } from './helpers/get-resolved-ref.js';
import { createNavigation } from './navigation/index.js';
import { extensions } from './schemas/extensions.js';
import { coerceValue } from './schemas/typebox-coerce.js';
import { OpenAPIDocumentSchema, } from './schemas/v3.1/strict/openapi-document.js';
const DEFAULT_ASSETS_FOLDER = 'assets';
export const WORKSPACE_FILE_NAME = 'scalar-workspace.json';
const httpMethods = new Set(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']);
/**
 * Filters an OpenAPI PathsObject to only include standard HTTP methods.
 * Removes any vendor extensions or other non-HTTP properties.
 *
 * @param paths - The OpenAPI PathsObject to filter
 * @returns A new PathsObject containing only standard HTTP methods
 *
 * @example
 * Input: {
 *   "/users": {
 *     "get": {...},
 *     "x-custom": {...},
 *     "post": {...}
 *   }
 * }
 * Output: {
 *   "/users": {
 *     "get": {...},
 *     "post": {...}
 *   }
 * }
 */
export function filterHttpMethodsOnly(paths) {
    const result = {};
    // Todo: skip extension properties
    for (const [path, pathItemRef] of Object.entries(paths)) {
        const filteredMethods = {};
        forEachPathItemOperation(pathItemRef, (method, operation) => {
            if (httpMethods.has(method.toLowerCase())) {
                filteredMethods[method] = getResolvedRef(operation) ?? operation;
            }
        });
        if (Object.keys(filteredMethods).length > 0) {
            result[path] = filteredMethods;
        }
    }
    return result;
}
/**
 * Escapes path keys in an OpenAPI PathsObject to be JSON Pointer compatible.
 * This is necessary because OpenAPI paths can contain characters that need to be escaped
 * when used as JSON Pointer references (like '/' and '~').
 *
 * @example
 * Input: { "/users/{id}": { ... } }
 * Output: { "/users~1{id}": { ... } }
 */
export function escapePaths(paths) {
    const result = {};
    Object.keys(paths).forEach((path) => {
        if (paths[path]) {
            result[escapeJsonPointer(path)] = paths[path];
        }
    });
    return result;
}
/**
 * Externalizes components by turning them into refs.
 */
export function externalizeComponentReferences(document, meta) {
    const result = {};
    if (!document.components) {
        return result;
    }
    Object.entries(document.components).forEach(([type, component]) => {
        if (!component || typeof component !== 'object') {
            return;
        }
        result[type] = {};
        Object.keys(component).forEach((name) => {
            const ref = meta.mode === 'ssr'
                ? `${meta.baseUrl}/${meta.name}/components/${type}/${name}#`
                : `./chunks/${meta.name}/components/${type}/${name}.json#`;
            result[type][name] = { '$ref': ref, $global: true };
        });
    });
    return result;
}
/**
 * Externalizes paths operations by turning them into refs.
 */
export function externalizePathReferences(document, meta) {
    const result = {};
    if (!document.paths) {
        return result;
    }
    Object.entries(document.paths).forEach(([path, pathItemRef]) => {
        const pathItem = getResolvedPathItem(pathItemRef);
        if (!pathItem || typeof pathItem !== 'object') {
            return;
        }
        const pathItemRecord = pathItem;
        result[path] = {};
        const escapedPath = escapeJsonPointer(path);
        keyOf(pathItemRecord).forEach((type) => {
            if (httpMethods.has(type)) {
                const ref = meta.mode === 'ssr'
                    ? `${meta.baseUrl}/${meta.name}/operations/${escapedPath}/${type}#`
                    : `./chunks/${meta.name}/operations/${escapedPath}/${type}.json#`;
                result[path][type] = { '$ref': ref, $global: true };
            }
            else if (type !== '$ref') {
                // Skip the path-item `$ref` merged in by getResolvedPathItem: the referenced component is
                // externalized on its own and the operations are externalized above, so keeping it would
                // emit a hybrid entry with both a component `$ref` and inlined operation references.
                result[path][type] = pathItemRecord[type];
            }
        });
    });
    return result;
}
/**
 * Resolves a workspace document from various input sources (URL, local file, or direct document object).
 *
 * @param workspaceDocument - The document input to resolve, which can be:
 *   - A URL to fetch the document from
 *   - A local file path to read the document from
 *   - A direct document object
 * @returns A promise that resolves to an object containing:
 *   - ok: boolean indicating if the resolution was successful
 *   - data: The resolved document data
 *
 * @example
 * // Resolve from URL
 * const urlDoc = await loadDocument({ name: 'api', url: 'https://api.example.com/openapi.json' })
 *
 * // Resolve direct document
 * const directDoc = await loadDocument({
 *   name: 'inline',
 *   document: { openapi: '3.0.0', paths: {} }
 * })
 */
function loadDocument(workspaceDocument) {
    if ('url' in workspaceDocument) {
        return fetchUrls().exec(workspaceDocument.url);
    }
    if ('path' in workspaceDocument) {
        return readFiles().exec(workspaceDocument.path);
    }
    return Promise.resolve({
        ok: true,
        data: workspaceDocument.document,
        raw: JSON.stringify(workspaceDocument.document),
    });
}
/**
 * Create server state workspace store
 */
export async function createServerWorkspaceStore(workspaceProps) {
    /**
     * Base workspace document containing essential metadata and document references.
     *
     * This workspace document provides the minimal information needed for initial rendering.
     * All components and path operations are replaced with references to enable lazy loading.
     *
     * In SSR mode, references point to API endpoints.
     * In static mode, references point to filesystem chunks.
     */
    const workspace = {
        ...workspaceProps.meta,
        documents: {},
    };
    /**
     * A map of document chunks that can be loaded asynchronously by the client.
     * Each document is split into components and operations to enable lazy loading.
     * The keys are document names and values contain the components and operations
     * for that document.
     */
    const assets = {};
    /**
     * Adds a new document to the workspace.
     *
     * This function processes an OpenAPI document by:
     * 1. Converting it to OpenAPI 3.1 format if needed
     * 2. Separating it into reusable components and path operations
     * 3. Externalizing references based on the workspace mode (SSR or static)
     * 4. Adding the processed document to the workspace with its metadata
     *
     * The resulting document contains minimal information with externalized references
     * that will be resolved on-demand through the workspace's get() method.
     *
     * @param document - The OpenAPI document to process and add
     * @param meta - Document metadata containing the required name and optional settings
     */
    const addDocumentSync = (document, meta, navigationOptions) => {
        const { name, ...documentMeta } = meta;
        const documentV3 = coerceValue(OpenAPIDocumentSchema, upgrade(document, '3.1'));
        // add the assets
        assets[meta.name] = {
            components: documentV3.components,
            operations: documentV3.paths && escapePaths(filterHttpMethodsOnly(documentV3.paths)),
        };
        const options = workspaceProps.mode === 'ssr'
            ? { mode: workspaceProps.mode, name, baseUrl: workspaceProps.baseUrl }
            : { mode: workspaceProps.mode, name, directory: workspaceProps.directory ?? DEFAULT_ASSETS_FOLDER };
        const components = externalizeComponentReferences(documentV3, options);
        const paths = externalizePathReferences(documentV3, options);
        // Build the sidebar entries
        const navigation = createNavigation(name, documentV3, navigationOptions ?? workspaceProps.navigationOptions);
        // The document is now a minimal version with externalized references to components and operations.
        // These references will be resolved asynchronously when needed through the workspace's get() method.
        workspace.documents[meta.name] = {
            ...documentMeta,
            ...documentV3,
            components,
            paths,
            [extensions.document.navigation]: navigation,
        };
    };
    /**
     * Adds a new document to the workspace asynchronously.
     *
     * This function:
     * 1. Loads the document using the provided input
     * 2. Checks if the document loaded successfully
     * 3. If successful, adds the document to the workspace using addDocumentSync
     *
     * @param input - The document input containing the document source and metadata
     */
    const addDocument = async (input, navigationOptions) => {
        const document = await loadDocument(input);
        if (!document.ok) {
            console.warn(`Failed to load document "${input.name}`);
            return;
        }
        addDocumentSync(document.data, { name: input.name, ...input.meta }, navigationOptions);
    };
    // Load and process all initial documents in parallel
    await Promise.all(workspaceProps.documents.map((document) => addDocument(document)));
    return {
        generateWorkspaceChunks: async () => {
            if (workspaceProps.mode !== 'static') {
                throw 'Mode has to be set to `static` to generate filesystem workspace chunks';
            }
            // Write the workspace document
            const basePath = `${cwd()}/${workspaceProps.directory ?? DEFAULT_ASSETS_FOLDER}`;
            await fs.mkdir(basePath, { recursive: true });
            // Write the workspace contents on the file system
            await fs.writeFile(`${basePath}/${WORKSPACE_FILE_NAME}`, JSON.stringify(workspace));
            // Write the chunks
            for (const [name, { components, operations }] of Object.entries(assets)) {
                // Write the components chunks
                if (components) {
                    for (const [type, component] of Object.entries(components)) {
                        const componentPath = `${basePath}/chunks/${name}/components/${type}`;
                        await fs.mkdir(componentPath, { recursive: true });
                        for (const [key, value] of Object.entries(component)) {
                            await fs.writeFile(`${componentPath}/${key}.json`, JSON.stringify(value));
                        }
                    }
                }
                // Write the operations chunks
                if (operations) {
                    for (const [path, methods] of Object.entries(operations)) {
                        const operationPath = `${basePath}/chunks/${name}/operations/${path}`;
                        await fs.mkdir(operationPath, { recursive: true });
                        for (const [method, operation] of Object.entries(methods)) {
                            await fs.writeFile(`${operationPath}/${method}.json`, JSON.stringify(operation));
                        }
                    }
                }
            }
        },
        getWorkspace: () => {
            return workspace;
        },
        get: (pointer) => {
            const pointerPath = (() => {
                if (pointer.startsWith('#')) {
                    return pointer.slice(1);
                }
                if (pointer.startsWith('/')) {
                    return pointer;
                }
                try {
                    return new URL(pointer).pathname;
                }
                catch {
                    return pointer;
                }
            })();
            // Keep the path segments escaped cuz we store them on the filesystem as escaped sequences
            const path = parseJsonPointerSegments(pointerPath).map(escapeJsonPointer);
            return getValueAtPath(assets, path);
        },
        addDocument,
    };
}
