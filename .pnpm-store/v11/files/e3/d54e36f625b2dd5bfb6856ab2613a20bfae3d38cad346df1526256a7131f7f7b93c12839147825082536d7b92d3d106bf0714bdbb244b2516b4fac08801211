import { ReactNode } from "react";
//#region src/contexts/i18n.d.ts
interface LocaleItem {
  name: string;
  locale: string;
}
interface LocaleContextType {
  locale?: string;
  onChange?: (v: string) => void;
  locales?: LocaleItem[];
}
declare function useI18n(): LocaleContextType;
interface I18nProviderProps {
  /**
   * Current locale
   */
  locale?: string;
  /**
   * Handle changes to the locale, redirect user when not specified.
   */
  onLocaleChange?: (v: string) => void;
  /**
   * Translations of current locale
   */
  translations?: Partial<Record<string, string>>;
  /**
   * Available languages
   */
  locales?: LocaleItem[];
  children?: ReactNode;
}
declare function I18nProvider({ locales, locale, onLocaleChange, children, translations }: I18nProviderProps): import("react").JSX.Element;
//#endregion
export { I18nProvider, I18nProviderProps, useI18n };