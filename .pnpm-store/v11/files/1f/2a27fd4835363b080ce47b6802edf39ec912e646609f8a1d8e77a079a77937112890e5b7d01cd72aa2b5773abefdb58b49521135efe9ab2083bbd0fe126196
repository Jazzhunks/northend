import { initializeWorkspaceEventHandlers } from "../../workspace-events.js";
import { ref } from "vue";
import { isOpenApiDocument } from "@scalar/workspace-store/schemas/type-guards";
//#region src/v2/features/modal/modal-events.ts
var EMPTY_REQUEST_BODY_COMPOSITION_SELECTION = {};
function initializeModalEvents({ eventBus, isSidebarOpen, requestBodyCompositionSelection, sidebarState, modalState, store }) {
	/** Initialize workspace event handlers */
	initializeWorkspaceEventHandlers({
		eventBus,
		store: ref(store),
		hooks: {}
	});
	eventBus.on("scroll-to:nav-item", ({ id }) => sidebarState.handleSelectItem(id));
	eventBus.on("ui:toggle:sidebar", () => isSidebarOpen.value = !isSidebarOpen.value);
	eventBus.on("ui:close:client-modal", () => modalState.hide());
	eventBus.on("ui:open:client-modal", (payload) => {
		requestBodyCompositionSelection.value = payload && "requestBodyCompositionSelection" in payload && payload.requestBodyCompositionSelection ? payload.requestBodyCompositionSelection : EMPTY_REQUEST_BODY_COMPOSITION_SELECTION;
		if (!payload) {
			modalState.show();
			return;
		}
		if ("id" in payload && payload.id) {
			let targetId = payload.id;
			if ("exampleName" in payload && payload.exampleName) {
				const operationEntry = sidebarState.state.getEntryById(payload.id);
				if (operationEntry && "children" in operationEntry && operationEntry.children) {
					const exampleEntry = operationEntry.children.find((child) => child.type === "example" && child.name === payload.exampleName);
					if (exampleEntry) targetId = exampleEntry.id;
				}
			}
			sidebarState.handleSelectItem(targetId);
		} else if ("method" in payload && "path" in payload) {
			const activeDoc = store.workspace.activeDocument;
			sidebarState.handleSelectItem(sidebarState.getEntryByLocation({
				document: isOpenApiDocument(activeDoc) ? activeDoc["x-scalar-navigation"]?.id ?? "" : "",
				path: payload.path,
				method: payload.method,
				example: payload.exampleName
			})?.id ?? "");
		}
		modalState.show();
	});
}
//#endregion
export { initializeModalEvents };

//# sourceMappingURL=modal-events.js.map