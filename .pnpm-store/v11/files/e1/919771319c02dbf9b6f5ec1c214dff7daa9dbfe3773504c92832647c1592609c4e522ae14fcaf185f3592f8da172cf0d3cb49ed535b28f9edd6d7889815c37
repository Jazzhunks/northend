import type { Workspace } from '../../schemas/workspace.js';
export type Layout = 'web' | 'other';
/**
 * Returns the default proxy URL for web layout.
 * For the 'web' layout, this ensures requests use Scalar's hosted proxy unless overridden,
 * which is important for browser environments with CORS or network restrictions.
 * For 'desktop' or 'modal' layouts, returns null to indicate no proxy by default.
 */
export declare const getDefaultProxyUrl: (layout: Layout) => "https://proxy.scalar.com" | null;
/**
 * Returns the active proxy URL for the workspace.
 *
 * Logic:
 * - If the active proxy url is not set, use the default proxy url.
 * - Otherwise, use the active proxy url.
 */
export declare const getActiveProxyUrl: (activeProxyUrl: Workspace["x-scalar-active-proxy"], layout: Layout) => string | null;
//# sourceMappingURL=proxy.d.ts.map