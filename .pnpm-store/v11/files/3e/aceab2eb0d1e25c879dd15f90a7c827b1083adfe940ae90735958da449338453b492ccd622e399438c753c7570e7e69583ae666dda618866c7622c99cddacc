import { authMutatorsFactory } from '../mutators/auth.js';
import { cookieMutatorsFactory } from '../mutators/cookie.js';
import { documentMutatorsFactory } from '../mutators/document.js';
import { environmentMutatorsFactory } from '../mutators/environment.js';
import { getDocument } from '../mutators/helpers.js';
import { operationMutatorsFactory } from '../mutators/operation/index.js';
import { serverMutatorsFactory } from '../mutators/server.js';
import { tabsMutatorsFactory } from '../mutators/tabs.js';
import { tagMutatorsFactory } from '../mutators/tag.js';
import { workspaceMutatorsFactory } from '../mutators/workspace.js';
/**
 * Generates a set of mutators for managing OpenAPI document and workspace state.
 *
 * @param store - The workspace store containing all documents and workspace-level data
 * @returns An object with mutators for the workspace, the active document, and any named document
 */
export function generateClientMutators(store) {
    /**
     * Returns mutators for a specific document by name.
     *
     * @param documentName - The name of the document to get mutators for
     * @returns An object containing mutators for requests, request examples, security schemes, environments, and cookies
     */
    const documentMutators = (document) => {
        return {
            auth: authMutatorsFactory({ store, document }),
            cookie: cookieMutatorsFactory({ collection: document }),
            document: documentMutatorsFactory({ document, store }),
            operation: operationMutatorsFactory({ document, store }),
            server: serverMutatorsFactory({ document }),
            tag: tagMutatorsFactory({ store }),
            environment: environmentMutatorsFactory({ workspace: store?.workspace ?? null, collection: document }),
        };
    };
    /**
     * Returns mutators for the workspace-level configuration.
     *
     * @returns An object containing mutators for environments and cookies at the workspace level
     */
    const workspaceMutators = () => {
        return {
            cookie: cookieMutatorsFactory({ collection: store?.workspace ?? null }),
            tabs: tabsMutatorsFactory({ workspace: store?.workspace ?? null }),
            workspace: workspaceMutatorsFactory({ workspace: store?.workspace ?? null }),
            environment: environmentMutatorsFactory({
                workspace: store?.workspace ?? null,
                collection: store?.workspace ?? null,
            }),
        };
    };
    return {
        /**
         * Returns mutators for the workspace-level configuration.
         */
        workspace: () => workspaceMutators(),
        /**
         * Returns mutators for the currently active document.
         * Falls back to the first document if no active document is set.
         */
        active: () => documentMutators(store?.workspace.activeDocument ?? null),
        /**
         * Returns mutators for a specific document by name.
         *
         * @param name - The name of the document
         */
        doc: (name) => documentMutators(getDocument(store, name)),
    };
}
