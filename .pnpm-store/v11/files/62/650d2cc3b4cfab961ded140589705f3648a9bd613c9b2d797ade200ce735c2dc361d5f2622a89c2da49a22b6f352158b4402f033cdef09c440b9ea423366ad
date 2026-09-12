import type { TabEvents } from '../events/definitions/tabs.js';
import type { Workspace } from '../schemas.js';
/**
 * Updates the tabs and active tab index in the workspace.
 * This is used for bulk updates when synchronizing state.
 */
export declare const updateTabs: (workspace: Workspace | null, payload: TabEvents["tabs:update:tabs"]) => void;
/**
 * Adds a new tab by duplicating the currently active tab.
 * This preserves the user's context when opening a new tab.
 */
export declare const addTab: (workspace: Workspace | null, _payload: TabEvents["tabs:add:tab"]) => boolean;
/**
 * Closes the currently active tab.
 * Prevents closing if only one tab remains, to ensure the user always has a tab open.
 * Adjusts the active index if needed to keep it in bounds.
 */
export declare const closeTab: (workspace: Workspace | null, payload: TabEvents["tabs:close:tab"]) => boolean;
/**
 * Closes all other tabs except the one at the given index
 */
export declare const closeOtherTabs: (workspace: Workspace | null, payload: TabEvents["tabs:close:other-tabs"]) => boolean;
/**
 * Navigates to the previous tab in the list.
 * Does nothing if already at the first tab.
 */
export declare const navigatePreviousTab: (workspace: Workspace | null, _payload: TabEvents["tabs:navigate:previous"]) => boolean;
/**
 * Navigates to the next tab in the list.
 * Does nothing if already at the last tab.
 */
export declare const navigateNextTab: (workspace: Workspace | null, _payload: TabEvents["tabs:navigate:next"]) => boolean;
/**
 * Focuses a specific tab based on keyboard number input (1-9).
 * Extracts the digit from the keyboard event and focuses that tab.
 * Tab numbering starts at 1 for user convenience but uses 0-based indexing internally.
 */
export declare const focusTab: (workspace: Workspace | null, payload: TabEvents["tabs:focus:tab"]) => boolean;
/**
 * Focuses the last tab in the list.
 * This provides a quick way to jump to the end, regardless of how many tabs exist.
 */
export declare const focusLastTab: (workspace: Workspace | null, _payload: TabEvents["tabs:focus:tab-last"]) => boolean;
export declare const tabsMutatorsFactory: ({ workspace }: {
    workspace: Workspace | null;
}) => {
    updateTabs: (payload: TabEvents["tabs:update:tabs"]) => void;
    addTab: (payload: TabEvents["tabs:add:tab"]) => boolean;
    closeTab: (payload: TabEvents["tabs:close:tab"]) => boolean;
    closeOtherTabs: (payload: TabEvents["tabs:close:other-tabs"]) => boolean;
    navigatePreviousTab: (payload: TabEvents["tabs:navigate:previous"]) => boolean;
    navigateNextTab: (payload: TabEvents["tabs:navigate:next"]) => boolean;
    focusTab: (payload: TabEvents["tabs:focus:tab"]) => boolean;
    focusLastTab: (payload: TabEvents["tabs:focus:tab-last"]) => boolean;
};
//# sourceMappingURL=tabs.d.ts.map