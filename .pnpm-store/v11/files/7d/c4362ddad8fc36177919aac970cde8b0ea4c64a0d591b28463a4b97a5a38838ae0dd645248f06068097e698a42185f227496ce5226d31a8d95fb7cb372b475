import { createComponent } from "solid-js/web";
import { createContext, createEffect, createSignal, useContext } from "solid-js";
//#region src/components/theme.tsx
var ThemeContext = createContext(void 0);
var ThemeContextProvider = (props) => {
	const [theme, setTheme] = createSignal(props.theme);
	createEffect(() => {
		setTheme(props.theme);
	});
	return createComponent(ThemeContext.Provider, {
		value: {
			theme,
			setTheme
		},
		get children() {
			return props.children;
		}
	});
};
function createTheme() {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("createTheme must be used within a ThemeContextProvider");
	return context;
}
//#endregion
export { ThemeContextProvider, createTheme };

//# sourceMappingURL=theme.js.map