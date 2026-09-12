import type { ToolUIPart, UIMessagePart } from 'ai';
import { type Tools } from '../state/state.js';
type RequestToolPart = ToolUIPart & {
    type: 'tool-execute-request';
    state: 'input-available';
    input: Tools['execute-request']['input'];
};
export declare function requestPartRequiresApproval(part: UIMessagePart<any, Tools>): part is RequestToolPart;
export declare function useRequestApprovals(): {
    approvalRequiredParts: import("vue").ComputedRef<({
        type: `tool-${string}`;
    } & {
        toolCallId: string;
        title?: string;
        providerExecuted?: boolean;
    } & {
        state: "input-available";
        input: unknown;
        output?: never;
        errorText?: never;
        callProviderMetadata?: import("ai").ProviderMetadata;
        approval?: never;
    } & {
        type: "tool-execute-request";
        state: "input-available";
        input: Tools["execute-request"]["input"];
    })[]>;
    respondToRequestApprovals: (approved: boolean) => Promise<void>;
};
export {};
//# sourceMappingURL=use-chat-approvals.d.ts.map