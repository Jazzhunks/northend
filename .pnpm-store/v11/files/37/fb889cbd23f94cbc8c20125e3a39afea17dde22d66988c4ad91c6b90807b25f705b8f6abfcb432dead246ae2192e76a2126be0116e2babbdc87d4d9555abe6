import { safeParseJson } from "../helpers.js";
import { useState } from "../state/state.js";
import { computed } from "vue";
import { coerce, number, object, optional, string, validate } from "@scalar/validation";
//#region src/hooks/use-chat-error.ts
var chatErrorSchema = object({
	message: string(),
	code: string(),
	status: optional(number())
});
function useChatError() {
	const { chat } = useState();
	return computed(() => {
		if (!chat.error) return;
		const errorJson = safeParseJson(chat.error.message);
		if (!errorJson || !validate(chatErrorSchema, errorJson)) return {
			message: chat.error.message,
			code: "UNKNOWN_ERROR"
		};
		return coerce(chatErrorSchema, errorJson);
	});
}
//#endregion
export { useChatError };

//# sourceMappingURL=use-chat-error.js.map