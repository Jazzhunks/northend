import { useState } from "../state/state.js";
import { nextTick, watch } from "vue";
//#region src/hooks/use-chat-scroll.ts
function useChatScroll() {
	const state = useState();
	function getMsgContent(msg) {
		const lastPart = msg?.parts.at(-1);
		if (!lastPart) return;
		if (lastPart.type !== "text") return;
		return lastPart.text;
	}
	watch([() => state.chat.status, () => getMsgContent(state.chat.lastMessage)], async () => {
		await nextTick();
		window.scrollTo(0, document.body.scrollHeight);
	});
}
//#endregion
export { useChatScroll };

//# sourceMappingURL=use-chat-scroll.js.map