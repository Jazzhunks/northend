import type { WorkspaceStore } from '../../client.js';
import type { HooksEvents } from '../../events/definitions/hooks.js';
import type { OperationEvents } from '../../events/definitions/operation.js';
import type { WorkspaceDocument } from '../../schemas.js';
export declare const operationMutatorsFactory: ({ document, store, }: {
    document: WorkspaceDocument | null;
    store: WorkspaceStore | null;
}) => {
    createOperation: (payload: OperationEvents["operation:create:operation"]) => string | undefined;
    updateOperationMeta: (payload: OperationEvents["operation:update:meta"]) => void;
    updateOperationPathMethod: (payload: OperationEvents["operation:update:pathMethod"]) => void;
    deleteOperation: (payload: OperationEvents["operation:delete:operation"]) => void;
    createOperationDraftExample: (payload: OperationEvents["operation:create:draft-example"]) => void;
    deleteOperationExample: (payload: OperationEvents["operation:delete:example"]) => void;
    renameOperationExample: (payload: OperationEvents["operation:rename:example"]) => void;
    updateOperationExtension: (payload: OperationEvents["operation:update:extension"]) => void;
    updateOperationExtraParameters: (payload: OperationEvents["operation:update:extra-parameters"]) => void;
    upsertOperationParameter: (payload: OperationEvents["operation:upsert:parameter"]) => void;
    deleteOperationParameter: (payload: OperationEvents["operation:delete:parameter"]) => void;
    deleteAllOperationParameters: (payload: OperationEvents["operation:delete-all:parameters"]) => void;
    updateOperationRequestBodyContentType: (payload: OperationEvents["operation:update:requestBody:contentType"]) => void;
    updateOperationRequestBodyExample: (payload: OperationEvents["operation:update:requestBody:value"]) => void;
    updateOperationRequestBodyFormValue: (payload: OperationEvents["operation:update:requestBody:formValue"]) => void;
    addResponseToHistory: (payload: HooksEvents["hooks:on:request:complete"]) => Promise<void>;
    reloadOperationHistory: (payload: OperationEvents["operation:reload:history"]) => void;
};
//# sourceMappingURL=index.d.ts.map