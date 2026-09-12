import { computed, toValue } from "vue";
//#region src/components/ScalarThemeSwatches/useThemeSwatches.ts
/** Theme CSS variables */
var THEME_CSS_VARS = [
	"--scalar-color-1",
	"--scalar-color-2",
	"--scalar-color-3",
	"--scalar-background-1",
	"--scalar-background-2",
	"--scalar-background-3",
	"--scalar-color-accent"
];
/**
* Parses a given css string for a css variable regexp
*/
function getVars(cssVarPattern, css) {
	const matches = [...css.matchAll(new RegExp(`(${cssVarPattern}): ([^;]+);`, "gm"))];
	if (matches.length === 0) return {};
	return Object.fromEntries(matches.map((match) => [match[1], match[2]]));
}
/**
* Parses a given css string for the variables we want
*/
function parseRules(css) {
	if (!css) return {};
	return {
		...getVars("--scalar-color-[1-3]", css),
		...getVars("--scalar-background-[1-3]", css),
		...getVars("--scalar-color-accent", css)
	};
}
/**
* Returns the light and dark colors for a given css string
*/
function useThemeSwatches(css) {
	return { colors: computed(() => ({
		light: parseRules(toValue(css).match(/\.light-mode[^{]*{[^}]*}/m)?.[0]),
		dark: parseRules(toValue(css).match(/\.dark-mode[^{]*{[^}]*}/m)?.[0])
	})) };
}
//#endregion
export { THEME_CSS_VARS, useThemeSwatches };

//# sourceMappingURL=useThemeSwatches.js.map