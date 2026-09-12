import { inject, provide, useId } from "vue";
//#region src/components/ScalarTeleport/useTeleport.ts
/**
* The teleport target
*/
var TELEPORT_SYMBOL = Symbol();
/**
* Get the nearest teleport target id from `useProvideTeleport`
*
* Falls back to `body` if no teleport target id is found
*
* @see {@link useProvideTeleport}
*/
var useTeleport = () => inject(TELEPORT_SYMBOL, "body");
/**
* Provides a teleport target id using Vue's `provide`
*
* @see https://vuejs.org/guide/components/provide-inject.html#provide-inject
*/
var useProvideTeleport = (id) => {
	const targetId = id ?? `scalar-teleport-${useId()}`;
	provide(TELEPORT_SYMBOL, `#${targetId}`);
	return targetId;
};
//#endregion
export { TELEPORT_SYMBOL, useProvideTeleport, useTeleport };

//# sourceMappingURL=useTeleport.js.map