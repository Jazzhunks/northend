import { useState } from "../state/state.js";
import { computed } from "vue";
//#region src/hooks/use-chat-pending-client-tool-parts.ts
function isPendingClientToolPart(part) {
	return part.type.startsWith("tool") && part.state === "input-available";
}
function useChatPendingClientToolParts() {
	const state = useState();
	return { pendingClientToolParts: computed(() => {
		return state.chat.messages.filter((message) => message.parts.some(isPendingClientToolPart)).flatMap((message) => message.parts).filter(isPendingClientToolPart);
	}) };
}
//#endregion
export { useChatPendingClientToolParts };

//# sourceMappingURL=use-chat-pending-client-tool-parts.js.map