import { type ComboboxSlots, type FilterFunction, type Option, type OptionGroup, type OptionsOrGroups } from './types.js';
/**
 * Scalar Combobox Options component
 *
 * Renders the searchable option list for a combobox, including
 * filtering, keyboard navigation, and an optional "add new" action.
 *
 * @example
 * <ScalarComboboxOptions v-model="selected" :options="options" />
 */
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <O extends Option = Option, G extends OptionGroup<O> = OptionGroup<O>>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<({
        /** The options to display in the combobox */
        options: OptionsOrGroups<O, G>;
        /** The placeholder text to display in the combobox */
        placeholder?: string;
        /**
         * A function to filter the options based on a query,
         * if not provided, the options will be filtered by option label
         *
         * @see {@link FilterFunction} for more information
         */
        filterFn?: FilterFunction<O, G>;
        /** Whether the combobox is in multiselect mode, defaults to false */
        multiselect?: boolean;
    } & {
        modelValue?: O[];
    }) & {
        onAdd?: (() => any) | undefined;
        "onUpdate:modelValue"?: ((value: O[]) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: Omit<ComboboxSlots<O, G>, "default">;
    emit: ((evt: "add") => void) & ((event: "update:modelValue", value: O[]) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
//# sourceMappingURL=ScalarComboboxOptions.vue.d.ts.map