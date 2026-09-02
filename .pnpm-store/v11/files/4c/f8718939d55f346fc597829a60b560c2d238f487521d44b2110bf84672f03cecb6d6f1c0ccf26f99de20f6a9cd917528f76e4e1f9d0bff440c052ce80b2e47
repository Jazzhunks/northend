import { type MaybeRefOrGetter } from 'vue';
/** Numbers 1 to 3 */
type OneToThree = 1 | 2 | 3;
/**
 * CSS variable names that can be extracted from theme CSS
 */
type ThemeCssVar = `--scalar-color-${OneToThree}` | `--scalar-background-${OneToThree}` | '--scalar-color-accent';
/**
 * Theme colors for light and dark modes
 */
type ThemeColors = {
    light: ThemeCssVars;
    dark: ThemeCssVars;
};
/**
 * Record of theme CSS variables to their values (partial)
 */
type ThemeCssVars = Partial<Record<ThemeCssVar, string>>;
/** Theme CSS variables */
export declare const THEME_CSS_VARS: ["--scalar-color-1", "--scalar-color-2", "--scalar-color-3", "--scalar-background-1", "--scalar-background-2", "--scalar-background-3", "--scalar-color-accent"];
/**
 * Returns the light and dark colors for a given css string
 */
export declare function useThemeSwatches(css: MaybeRefOrGetter<string>): {
    colors: import("vue").ComputedRef<ThemeColors>;
};
export {};
//# sourceMappingURL=useThemeSwatches.d.ts.map