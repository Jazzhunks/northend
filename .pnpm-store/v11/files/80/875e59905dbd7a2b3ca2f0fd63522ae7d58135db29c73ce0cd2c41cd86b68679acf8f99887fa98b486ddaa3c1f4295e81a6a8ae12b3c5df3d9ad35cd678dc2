import defaultFonts from './fonts/fonts.css?inline';
import alternateTheme from './presets/alternate.css?inline';
import bluePlanetTheme from './presets/bluePlanet.css?inline';
import deepSpaceTheme from './presets/deepSpace.css?inline';
import defaultTheme from './presets/default.css?inline';
import elysiajsTheme from './presets/elysiajs.css?inline';
import fastifyTheme from './presets/fastify.css?inline';
import keplerTheme from './presets/kepler.css?inline';
import laserwaveTheme from './presets/laserwave.css?inline';
import marsTheme from './presets/mars.css?inline';
import moonTheme from './presets/moon.css?inline';
import purpleTheme from './presets/purple.css?inline';
import saturnTheme from './presets/saturn.css?inline';
import solarizedTheme from './presets/solarized.css?inline';
export { hasObtrusiveScrollbars } from './utilities/has-obtrusive-scrollbars';
export { alternateTheme, bluePlanetTheme, deepSpaceTheme, defaultTheme, elysiajsTheme, fastifyTheme, keplerTheme, marsTheme, moonTheme, purpleTheme, saturnTheme, solarizedTheme, laserwaveTheme, defaultFonts, };
/** Theme definition for Scalar platform themes. Matches user provided theme definitions. */
export type Theme = {
    uid: string;
    /** Display name of the theme */
    name: string;
    /** Description of the theme */
    description: string;
    /** CSS string for the theme */
    theme: string;
    /** Text identifier for the theme. Used for specifying in scalar.config.ts */
    slug: string;
    /** Deprecated themes will still be loadable but will be hidden from the UI for future selection */
    deprecated?: boolean;
};
/** List of available theme IDs as a type. */
export type ThemeId = (typeof themeIds)[number];
export type IntegrationThemeId = 'elysiajs' | 'fastify';
export declare const themeIds: readonly ["alternate", "default", "moon", "purple", "solarized", "bluePlanet", "deepSpace", "saturn", "kepler", "elysiajs", "fastify", "mars", "laserwave", "none"];
/**
 * User readable theme names / labels
 */
export declare const themeLabels: {
    readonly default: "Default";
    readonly alternate: "Alternate";
    readonly moon: "Moon";
    readonly purple: "Purple";
    readonly solarized: "Solarized";
    readonly elysiajs: "Elysia.js";
    readonly fastify: "Fastify";
    readonly bluePlanet: "Blue Planet";
    readonly saturn: "Saturn";
    readonly kepler: "Kepler-11e";
    readonly mars: "Mars";
    readonly deepSpace: "Deep Space";
    readonly laserwave: "Laserwave";
    readonly none: "None";
};
/**
 * Formatted list of available theme presets.
 *
 * Used across the Scalar platform as base themes. Extendable by team defined themes
 *
 * Static UIDs must be assigned and never changed when a new theme is created.
 * Slugs should be formatted as kebab-case and cannot change after initial creation.
 */
export declare const presets: {
    readonly default: {
        readonly uid: "qTQR9jSM8E-LihpyZzPOi";
        readonly name: "Default";
        readonly description: "Default Scalar theme";
        readonly theme: string;
        readonly slug: "default";
    };
    readonly alternate: {
        readonly uid: "2skUDSH4S8HYFF9yXysr-";
        readonly name: "Alternate";
        readonly description: "Alternate Scalar theme";
        readonly theme: string;
        readonly slug: "alternate";
    };
    readonly moon: {
        readonly uid: "DG9ZUNp5lJhDeX_kPX4Bl";
        readonly name: "Moon";
        readonly description: "Lunar styles";
        readonly theme: string;
        readonly slug: "moon";
    };
    readonly purple: {
        readonly uid: "pE_1ysxcZ-y2LM1GGNBUv";
        readonly name: "Purple";
        readonly description: "Purple Scalar theme";
        readonly theme: string;
        readonly slug: "purple";
    };
    readonly solarized: {
        readonly uid: "BdGVG1vf-4nYl3wJKyj8l";
        readonly name: "Solarized";
        readonly description: "Solarized Scalar theme";
        readonly theme: string;
        readonly slug: "solarized";
    };
    readonly bluePlanet: {
        readonly uid: "X12IfAvl7ue-42V2lW40S";
        readonly name: "Blue Planet";
        readonly description: "Blue Planet Scalar theme";
        readonly theme: string;
        readonly slug: "blue-planet";
    };
    readonly deepSpace: {
        readonly uid: "K8b38NWQiicq4-zXGXKdI";
        readonly name: "Deep Space";
        readonly description: "Deep Space Scalar theme";
        readonly theme: string;
        readonly slug: "deep-space";
    };
    readonly saturn: {
        readonly uid: "1jyAjmbIZQG-RUU4Ugk9o";
        readonly name: "Saturn";
        readonly description: "Saturn Scalar theme";
        readonly theme: string;
        readonly slug: "saturn";
    };
    readonly kepler: {
        readonly uid: "jZ6dnWbtqQ0Hz3s9jLPH0";
        readonly name: "Kepler-11e";
        readonly description: "Kepler-11e Scalar theme";
        readonly theme: string;
        readonly slug: "kepler-11e";
    };
    readonly mars: {
        readonly uid: "YY4LQgwiXix55-TmMz9qd";
        readonly name: "Mars";
        readonly description: "Mars Scalar theme";
        readonly theme: string;
        readonly slug: "mars";
    };
    readonly laserwave: {
        readonly uid: "c5fZEi-K-hP-xXf885dkf";
        readonly name: "Laserwave";
        readonly description: "Laserwave Scalar theme";
        readonly theme: string;
        readonly slug: "laserwave";
    };
    readonly elysiajs: {
        readonly uid: "nEVZkRmCylPkT0o9YJa7y";
        readonly name: "Elysia.js";
        readonly description: "Elysia.js theme";
        readonly theme: string;
        readonly slug: "elysiajs";
    };
    readonly fastify: {
        readonly uid: "nTZcdcM2_yHFZFxTQe9Kk";
        readonly name: "Fastify";
        readonly description: "Fastify theme";
        readonly theme: string;
        readonly slug: "fastify";
    };
};
/** List of available theme presets */
export declare const themePresets: ({
    readonly uid: "qTQR9jSM8E-LihpyZzPOi";
    readonly name: "Default";
    readonly description: "Default Scalar theme";
    readonly theme: string;
    readonly slug: "default";
} | {
    readonly uid: "2skUDSH4S8HYFF9yXysr-";
    readonly name: "Alternate";
    readonly description: "Alternate Scalar theme";
    readonly theme: string;
    readonly slug: "alternate";
} | {
    readonly uid: "DG9ZUNp5lJhDeX_kPX4Bl";
    readonly name: "Moon";
    readonly description: "Lunar styles";
    readonly theme: string;
    readonly slug: "moon";
} | {
    readonly uid: "pE_1ysxcZ-y2LM1GGNBUv";
    readonly name: "Purple";
    readonly description: "Purple Scalar theme";
    readonly theme: string;
    readonly slug: "purple";
} | {
    readonly uid: "BdGVG1vf-4nYl3wJKyj8l";
    readonly name: "Solarized";
    readonly description: "Solarized Scalar theme";
    readonly theme: string;
    readonly slug: "solarized";
} | {
    readonly uid: "X12IfAvl7ue-42V2lW40S";
    readonly name: "Blue Planet";
    readonly description: "Blue Planet Scalar theme";
    readonly theme: string;
    readonly slug: "blue-planet";
} | {
    readonly uid: "K8b38NWQiicq4-zXGXKdI";
    readonly name: "Deep Space";
    readonly description: "Deep Space Scalar theme";
    readonly theme: string;
    readonly slug: "deep-space";
} | {
    readonly uid: "1jyAjmbIZQG-RUU4Ugk9o";
    readonly name: "Saturn";
    readonly description: "Saturn Scalar theme";
    readonly theme: string;
    readonly slug: "saturn";
} | {
    readonly uid: "jZ6dnWbtqQ0Hz3s9jLPH0";
    readonly name: "Kepler-11e";
    readonly description: "Kepler-11e Scalar theme";
    readonly theme: string;
    readonly slug: "kepler-11e";
} | {
    readonly uid: "YY4LQgwiXix55-TmMz9qd";
    readonly name: "Mars";
    readonly description: "Mars Scalar theme";
    readonly theme: string;
    readonly slug: "mars";
} | {
    readonly uid: "c5fZEi-K-hP-xXf885dkf";
    readonly name: "Laserwave";
    readonly description: "Laserwave Scalar theme";
    readonly theme: string;
    readonly slug: "laserwave";
} | {
    readonly uid: "nEVZkRmCylPkT0o9YJa7y";
    readonly name: "Elysia.js";
    readonly description: "Elysia.js theme";
    readonly theme: string;
    readonly slug: "elysiajs";
} | {
    readonly uid: "nTZcdcM2_yHFZFxTQe9Kk";
    readonly name: "Fastify";
    readonly description: "Fastify theme";
    readonly theme: string;
    readonly slug: "fastify";
})[];
/** Starter custom theme styles with all variables and options */
export declare const getStarterTheme: (name: string) => Theme;
/** Get the theme and base variables for a given theme */
export declare const getThemeStyles: (themeId?: ThemeId, opts?: {
    /**
     * Whether or not to include the base variables (e.g. typography)
     *
     * @default true
     */
    variables?: boolean;
    /**
     * Whether or not to include the definitions for the default scalar fonts (e.g. Inter)
     *
     * @default true
     */
    fonts?: boolean;
    /**
     * Cascade layer to assign the theme styles to
     *
     * @default 'scalar-theme'
     */
    layer?: string | false;
}) => string;
//# sourceMappingURL=index.d.ts.map