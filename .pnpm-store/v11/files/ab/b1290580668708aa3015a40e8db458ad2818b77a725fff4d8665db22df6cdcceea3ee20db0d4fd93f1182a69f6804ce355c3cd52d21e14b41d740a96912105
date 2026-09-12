import { ReactNode } from "react";
//#region src/legacy/layout.d.ts
interface PageStyles {
  tocNav?: string;
  toc?: string;
  page?: string;
  article?: string;
}
declare function usePageStyles(): PageStyles;
declare function StylesProvider({ children, ...value }: PageStyles & {
  children: ReactNode;
}): import("react").JSX.Element;
interface NavProviderProps {
  /**
   * Use transparent background
   *
   * @defaultValue none
   */
  transparentMode?: 'always' | 'top' | 'none';
}
interface NavContextType {
  isTransparent: boolean;
}
declare function NavProvider({ transparentMode, children }: NavProviderProps & {
  children: ReactNode;
}): import("react").JSX.Element;
declare function useNav(): NavContextType;
//#endregion
export { NavProvider, NavProviderProps, PageStyles, StylesProvider, useNav, usePageStyles };