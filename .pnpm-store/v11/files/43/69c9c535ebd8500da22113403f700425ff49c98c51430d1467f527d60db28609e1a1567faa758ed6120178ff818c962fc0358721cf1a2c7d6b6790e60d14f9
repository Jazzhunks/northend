import { isMacOS } from "@scalar/helpers/general/is-mac-os";
//#region src/v2/helpers/handle-hotkeys.ts
/** Default hotkeys available in most contexts */
var DEFAULT_HOTKEYS = {
	Enter: {
		event: "operation:send:request:hotkey",
		modifiers: ["default"]
	},
	b: {
		event: "ui:toggle:sidebar",
		modifiers: ["default"]
	},
	k: {
		event: "ui:open:command-palette",
		modifiers: ["default"]
	},
	l: {
		event: "ui:focus:address-bar",
		modifiers: ["default"]
	},
	j: {
		event: "ui:focus:search",
		modifiers: ["default"]
	},
	i: {
		event: "ui:open:settings",
		modifiers: ["default"]
	},
	s: {
		event: "ui:save:local-document",
		modifiers: ["default"]
	}
};
/** Hotkey map by layout, we can allow the user to override this later */
var HOTKEYS = {
	web: DEFAULT_HOTKEYS,
	modal: {
		...DEFAULT_HOTKEYS,
		Escape: {
			event: "ui:close:client-modal",
			modifiers: []
		},
		l: {
			event: "ui:focus:send-button",
			modifiers: ["default"]
		}
	},
	desktop: {
		...DEFAULT_HOTKEYS,
		n: {
			event: "ui:open:command-palette",
			modifiers: ["default"]
		},
		t: {
			event: "tabs:add:tab",
			modifiers: ["default"]
		},
		w: {
			event: "tabs:close:tab",
			modifiers: ["default"]
		},
		ArrowLeft: {
			event: "tabs:navigate:previous",
			modifiers: ["default", "altKey"]
		},
		ArrowRight: {
			event: "tabs:navigate:next",
			modifiers: ["default", "altKey"]
		},
		1: {
			event: "tabs:focus:tab",
			modifiers: ["default"]
		},
		2: {
			event: "tabs:focus:tab",
			modifiers: ["default"]
		},
		3: {
			event: "tabs:focus:tab",
			modifiers: ["default"]
		},
		4: {
			event: "tabs:focus:tab",
			modifiers: ["default"]
		},
		5: {
			event: "tabs:focus:tab",
			modifiers: ["default"]
		},
		6: {
			event: "tabs:focus:tab",
			modifiers: ["default"]
		},
		7: {
			event: "tabs:focus:tab",
			modifiers: ["default"]
		},
		8: {
			event: "tabs:focus:tab",
			modifiers: ["default"]
		},
		9: {
			event: "tabs:focus:tab-last",
			modifiers: ["default"]
		}
	}
};
/** Keys that should work in input fields when the modifier is pressed */
var INPUT_ALLOWED_KEYS = new Set([
	"Escape",
	"ArrowDown",
	"ArrowUp",
	"Enter"
]);
/**
* Checks if all required modifiers are pressed.
* Resolves 'default' to metaKey (macOS) or ctrlKey (Windows/Linux).
*/
var areModifiersPressed = (event, modifiers) => modifiers.length > 0 && modifiers.map((modifier) => modifier === "default" ? isMacOS() ? "metaKey" : "ctrlKey" : modifier).every((key) => event[key] === true);
/**
* Determines if the event target is an editable element where hotkeys should be blocked.
* Returns true if we should block the hotkey, false otherwise.
*/
var isEditableElement = (event, key) => {
	if (!(event.target instanceof HTMLElement)) return false;
	const target = event.target;
	if (target.tagName === "INPUT") return !INPUT_ALLOWED_KEYS.has(key);
	return target.tagName === "TEXTAREA" || target.contentEditable === "true" || target.hasAttribute("contenteditable");
};
/**
* Handles global keyboard shortcuts.
* Checks modifier keys and input context before emitting events.
*
* @param event - the keyboard event
* @param eventBus - event bus for emitting hotkey actions
* @param layout - client layout
*/
var handleHotkeys = (event, eventBus, layout) => {
	/** Special case for space */
	const key = event.key === " " ? "Space" : event.key;
	/** Get the discriminated hotkey event with payload  */
	const hotkeyEvent = HOTKEYS[layout][key];
	if (!hotkeyEvent) return;
	const payload = { event };
	if (key === "Escape") {
		eventBus.emit(hotkeyEvent.event, payload, { skipUnpackProxy: true });
		return;
	}
	if (areModifiersPressed(event, hotkeyEvent.modifiers)) {
		eventBus.emit(hotkeyEvent.event, payload, { skipUnpackProxy: true });
		return;
	}
	if (hotkeyEvent.modifiers.length > 0) return;
	if (!isEditableElement(event, key)) eventBus.emit(hotkeyEvent.event, payload, { skipUnpackProxy: true });
};
//#endregion
export { handleHotkeys };

//# sourceMappingURL=handle-hotkeys.js.map