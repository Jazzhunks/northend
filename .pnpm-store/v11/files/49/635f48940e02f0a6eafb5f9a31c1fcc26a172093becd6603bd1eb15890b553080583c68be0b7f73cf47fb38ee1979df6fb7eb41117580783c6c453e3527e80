/** Possible color modes */
type ColorMode = 'light' | 'dark' | 'system';
/** Specific dark/light mode */
type DarkLightMode = 'light' | 'dark';
/**
 * A composable hook that provides color mode (dark/light) functionality.
 */
export declare function useColorMode(opts?: {
    /** The initial color mode to use */
    initialColorMode?: ColorMode;
    /** Override the color mode */
    overrideColorMode?: ColorMode;
}): {
    /** The current color mode (writable). */
    colorMode: import("vue").WritableComputedRef<ColorMode, ColorMode>;
    /** The computed dark/light mode (writable). */
    darkLightMode: import("vue").WritableComputedRef<DarkLightMode, DarkLightMode>;
    /** Whether the current color mode is dark (writable). */
    isDarkMode: import("vue").WritableComputedRef<boolean, boolean>;
    /** Toggles the color mode between light and dark. */
    toggleColorMode: () => void;
    /** Sets the color mode to the specified value. */
    setColorMode: (value: ColorMode) => void;
    /** Gets the system mode preference. */
    getSystemModePreference: () => DarkLightMode;
};
export {};
//# sourceMappingURL=useColorMode.d.ts.map