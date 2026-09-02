import { HOTKEY_LABELS, MODIFIER_KEY_SYMBOLS, MODIFIER_KEY_SYMBOLS_MACOS } from "./constants.js";
import { isMacOS } from "@scalar/helpers/general/is-mac-os";
//#region src/components/ScalarHotkey/formatHotkey.ts
var forcedHotkeySymbolSet = () => {
	const raw = void 0;
	if (raw === "mac" || raw === "non-mac") return raw;
};
var useMacHotkeySymbols = () => {
	const forced = forcedHotkeySymbolSet();
	if (forced === "mac") return true;
	if (forced === "non-mac") return false;
	return isMacOS();
};
/** Typescript helper to check if a modifier is the default modifier */
function isDefault(modifier) {
	return modifier === "default";
}
/** Get the modifier key symbol for a modifier */
function getModifierKeySymbol(modifier) {
	const hotkey = isDefault(modifier) ? "Meta" : modifier;
	return useMacHotkeySymbols() ? MODIFIER_KEY_SYMBOLS_MACOS[hotkey] : MODIFIER_KEY_SYMBOLS[hotkey];
}
/** Format the hotkey symbols for a hotkey */
function formatHotkeySymbols(hotkey, modifier) {
	return [...modifier.map((mod) => getModifierKeySymbol(mod)), hotkey];
}
/** Get the hotkey label for a hotkey */
function getKeyLabel(key) {
	return key in HOTKEY_LABELS ? HOTKEY_LABELS[key] : key;
}
//#endregion
export { formatHotkeySymbols, getKeyLabel };

//# sourceMappingURL=formatHotkey.js.map