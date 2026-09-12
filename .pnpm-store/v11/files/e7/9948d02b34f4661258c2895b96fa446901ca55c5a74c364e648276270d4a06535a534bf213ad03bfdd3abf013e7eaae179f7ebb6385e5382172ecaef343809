import { getPathItemOperation, getResolvedPathItem } from '../../helpers/for-each-path-item-operation.js';
import { getResolvedRef } from '../../helpers/get-resolved-ref.js';
import { getActiveEnvironment } from '../../request-example/context/environment.js';
import { getDefaultHeaders } from '../../request-example/context/headers.js';
import { combineParams } from '../../request-example/context/helpers/combine-params.js';
import { getActiveProxyUrl } from '../../request-example/context/proxy.js';
import { getSecurityRequirements } from '../../request-example/context/security/get-security-requirements.js';
import { getSecuritySchemes } from '../../request-example/context/security/get-security-schemes.js';
import { getSelectedSecurity } from '../../request-example/context/security/get-selected-security.js';
import { mergeSecurity } from '../../request-example/context/security/merge-security.js';
import { getSelectedServer, getServers } from '../../request-example/context/servers.js';
import { isOpenApiDocument } from '../../schemas/type-guards.js';
export const getRequestExampleContext = (workspaceStore, documentName, requestExampleMeta, options = {}) => {
    const { path, method, exampleName } = requestExampleMeta;
    const document = workspaceStore.workspace.documents[documentName] ?? options.fallbackDocument ?? undefined;
    if (!document) {
        return {
            ok: false,
            error: `Document ${documentName} not found`,
        };
    }
    if (!isOpenApiDocument(document)) {
        return {
            ok: false,
            error: `Document ${documentName} is not an OpenAPI document`,
        };
    }
    const pathItem = getResolvedPathItem(document.paths?.[path]);
    if (!pathItem) {
        return {
            ok: false,
            error: `Path ${path} not found`,
        };
    }
    const resolvedOperation = getResolvedRef(getPathItemOperation(document.paths?.[path], method));
    if (!resolvedOperation) {
        return {
            ok: false,
            error: `Method ${method} not found on path ${path}`,
        };
    }
    // Combine the path item and operation parameters
    const operation = {
        ...resolvedOperation,
        parameters: combineParams(pathItem.parameters, resolvedOperation.parameters ?? []),
    };
    //------------------------------------------------------------------------------------------------
    //                                 ENVIRONMENT CONTEXT
    //------------------------------------------------------------------------------------------------
    // Get environment context for the request example
    const environment = getActiveEnvironment(workspaceStore, document);
    //------------------------------------------------------------------------------------------------
    //                                 SERVER CONTEXT
    //------------------------------------------------------------------------------------------------
    // Get server context for the request example
    const serverList = getServers(options.servers ?? operation.servers ?? document.servers, {
        baseServerUrl: options.baseServerUrl,
        documentUrl: document['x-scalar-original-source-url'],
    });
    const selectedServer = getSelectedServer(document, operation, options.servers ?? null, serverList);
    //------------------------------------------------------------------------------------------------
    //                                 SECURITY CONTEXT
    //------------------------------------------------------------------------------------------------
    const documentSelectedSecurity = workspaceStore.auth.getAuthSelectedSchemas({
        type: 'document',
        documentName,
    });
    const operationSelectedSecurity = workspaceStore.auth.getAuthSelectedSchemas({
        type: 'operation',
        documentName,
        path: path ?? '',
        method: method ?? 'get',
    });
    const securitySchemes = mergeSecurity(document.components?.securitySchemes ?? {}, options.authentication?.securitySchemes ?? {}, workspaceStore.auth, documentName);
    const securityRequirements = getSecurityRequirements(document.security, operation.security);
    const selectedSecurity = getSelectedSecurity(documentSelectedSecurity, operationSelectedSecurity, securityRequirements, securitySchemes, options.authentication?.preferredSecurityScheme);
    /** The above selected requirements in scheme form */
    const selectedSecuritySchemes = getSecuritySchemes(securitySchemes, selectedSecurity.selectedSchemes[selectedSecurity.selectedIndex] ?? {});
    const serverMeta = operation.servers != null ? { type: 'operation', path: path ?? '', method: method ?? 'get' } : { type: 'document' };
    const authMeta = operationSelectedSecurity !== undefined
        ? { type: 'operation', path: path ?? '', method: method ?? 'get' }
        : { type: 'document' };
    //------------------------------------------------------------------------------------------------
    //                                 PROXY URL
    //------------------------------------------------------------------------------------------------
    // Get proxy url for the request example
    const proxyUrl = getActiveProxyUrl(workspaceStore.workspace['x-scalar-active-proxy'], options.layout ?? 'other');
    const defaultHeaders = getDefaultHeaders({
        method,
        operation,
        exampleName,
        options: { appVersion: options.appVersion ?? '0.0.0', isElectron: options.isElectron ?? false },
    });
    return {
        ok: true,
        data: {
            operation,
            environment,
            cookies: {
                workspace: workspaceStore.workspace['x-scalar-cookies'] ?? [],
                document: document['x-scalar-cookies'] ?? [],
            },
            headers: {
                default: defaultHeaders,
            },
            servers: {
                list: serverList,
                selected: selectedServer,
                meta: serverMeta,
            },
            proxy: {
                url: proxyUrl,
            },
            security: {
                schemes: securitySchemes,
                requirements: securityRequirements,
                selected: selectedSecurity,
                selectedSchemes: selectedSecuritySchemes,
                meta: authMeta,
            },
        },
    };
};
