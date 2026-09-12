import { EXECUTE_CLIENT_SIDE_REQUEST_TOOL_NAME } from "../entities/tools/execute-request.js";
import { executeRequestTool } from "../client-tools/execute-request.js";
import { createDocumentSettings } from "../helpers.js";
import { useState } from "../state/state.js";
import { computed } from "vue";
//#region src/hooks/use-chat-approvals.ts
function requestPartRequiresApproval(part) {
	return part.type === `tool-execute-request` && part.state === "input-available" && part.input?.method?.toLowerCase() !== "get";
}
function useRequestApprovals() {
	const state = useState();
	const approvalRequiredParts = computed(() => {
		return state.chat.messages.filter((message) => message.parts.some(requestPartRequiresApproval)).flatMap((message) => message.parts).filter(requestPartRequiresApproval);
	});
	async function respondToRequestApprovals(approved) {
		const approvalPromises = approvalRequiredParts.value.map(async (toolPart) => {
			if (!approved) return await state.chat.addToolOutput({
				tool: EXECUTE_CLIENT_SIDE_REQUEST_TOOL_NAME,
				toolCallId: toolPart.toolCallId,
				state: "output-error",
				errorText: "The user denied the request."
			});
			await executeRequestTool({
				documentSettings: createDocumentSettings(state.workspaceStore),
				proxyUrl: state.proxyUrl.value,
				input: toolPart.input,
				toolCallId: toolPart.toolCallId,
				chat: state.chat
			});
		});
		await Promise.all(approvalPromises);
	}
	return {
		approvalRequiredParts,
		respondToRequestApprovals
	};
}
//#endregion
export { requestPartRequiresApproval, useRequestApprovals };

//# sourceMappingURL=use-chat-approvals.js.map