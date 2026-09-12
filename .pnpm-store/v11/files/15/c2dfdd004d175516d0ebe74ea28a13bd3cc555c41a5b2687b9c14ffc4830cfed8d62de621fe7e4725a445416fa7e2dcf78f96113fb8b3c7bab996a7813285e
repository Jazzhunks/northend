import { AVAILABLE_CLIENTS, GROUPED_CLIENTS } from "@scalar/types/snippetz";
import { objectKeys } from "@scalar/helpers/object/object-keys";
//#region src/v2/features/modal/helpers/map-hidden-clients-config.ts
/**
* Map the old hiddenClients config to the new httpClients config.
* Filters out clients based on the configuration and returns the remaining clients.
*/
var mapHiddenClientsConfig = (hiddenClients) => {
	if (hiddenClients === true) return [];
	if (!hiddenClients || Array.isArray(hiddenClients) && hiddenClients.length === 0) return AVAILABLE_CLIENTS;
	const visibleClientsSet = new Set(AVAILABLE_CLIENTS);
	if (Array.isArray(hiddenClients)) for (const item of hiddenClients) {
		const group = GROUPED_CLIENTS[item];
		if (group) for (const client of group) visibleClientsSet.delete(`${item}/${client}`);
		else if (item.includes("/")) visibleClientsSet.delete(item);
		else for (const language of objectKeys(GROUPED_CLIENTS)) visibleClientsSet.delete(`${language}/${item}`);
	}
	else if (typeof hiddenClients === "object") {
		for (const [targetId, clients] of Object.entries(hiddenClients)) if (clients === true) {
			const group = GROUPED_CLIENTS[targetId];
			if (group) for (const client of group) visibleClientsSet.delete(`${targetId}/${client}`);
		} else if (Array.isArray(clients)) for (const client of clients) {
			visibleClientsSet.delete(client);
			visibleClientsSet.delete(`${targetId}/${client}`);
		}
	}
	return Array.from(visibleClientsSet);
};
//#endregion
export { mapHiddenClientsConfig };

//# sourceMappingURL=map-hidden-clients-config.js.map