import { handleHotkeys } from "../helpers/handle-hotkeys.js";
import { onBeforeUnmount, onMounted, toValue } from "vue";
//#region src/v2/hooks/use-global-hot-keys.ts
/**
* Global hotkey handler for the app (web + desktop)
*
* @param eventBus - workspace event bus
* @param layout - client layout
* @param disableListeners - whether to disable the listeners
*/
var useGlobalHotKeys = (eventBus, layout, disableListeners) => {
	const handleKeyDown = (ev) => {
		if (toValue(disableListeners)) return;
		handleHotkeys(ev, eventBus, layout);
	};
	onMounted(() => window.addEventListener("keydown", handleKeyDown));
	onBeforeUnmount(() => window.removeEventListener("keydown", handleKeyDown));
};
//#endregion
export { useGlobalHotKeys };

//# sourceMappingURL=use-global-hot-keys.js.map