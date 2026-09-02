import type { ClientPlugin } from '@scalar/oas-utils/helpers';
import type { ConfigDefaults } from 'posthog-js';
export type PostHogConfig = {
    /** Your PostHog project API key */
    apiKey: string;
    /** The PostHog API host URL */
    apiHost: string;
    /** The PostHog UI host URL (for session recordings, surveys, etc.) */
    uiHost?: string;
    /** PostHog defaults version identifier */
    defaults?: ConfigDefaults;
};
/**
 * PostHog analytics plugin for the API Client.
 *
 * Loading this plugin opts in to analytics. If the plugin is not loaded,
 * no tracking occurs.
 *
 * Respects the `telemetry` configuration option — when set to `false`,
 * capturing is disabled. Reacts dynamically to config changes at runtime.
 */
export declare const PostHogClientPlugin: (config: PostHogConfig) => ClientPlugin;
//# sourceMappingURL=index.d.ts.map