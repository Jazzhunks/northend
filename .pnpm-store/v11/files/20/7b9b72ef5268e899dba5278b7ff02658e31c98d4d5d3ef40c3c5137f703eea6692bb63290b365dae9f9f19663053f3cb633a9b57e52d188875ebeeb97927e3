import type { DocumentAuth } from '../entities/auth/schema.js';
import type { DocumentHistory } from '../entities/history/schema.js';
import type { WorkspaceDocument, WorkspaceExtensions, WorkspaceMeta } from '../schemas/workspace.js';
export type InMemoryWorkspace = {
    meta: WorkspaceMeta & WorkspaceExtensions;
    documents: Record<string, WorkspaceDocument>;
    originalDocuments: Record<string, Record<string, unknown>>;
    intermediateDocuments: Record<string, Record<string, unknown>>;
    overrides: Record<string, any>;
    history: DocumentHistory;
    auth: DocumentAuth;
};
//# sourceMappingURL=inmemory-workspace.d.ts.map