import type { ScalarFloatingOptions } from '../ScalarFloating/index.js';
import type { ComboboxSlots, FilterFunction, Option, OptionGroup, OptionsOrGroups } from './types.js';
/**
 * Scalar Combobox component
 *
 * A searchable select input with support for filtering, option groups,
 * and custom option rendering.
 *
 * @example
 * <ScalarCombobox v-model="selected" :options="options">
 *   <ScalarButton>{{ selected?.label ?? 'Select' }}</ScalarButton>
 * </ScalarCombobox>
 */
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <O extends Option = Option, G extends OptionGroup<O> = OptionGroup<O>>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<({
        /** The options to display in the combobox */
        options: OptionsOrGroups<O, G>;
        /** The placeholder text to display in the combobox */
        placeholder?: string;
        /** A function to filter the options based on a query,
         * if not provided, the options will be filtered by option label
         *
         * @see {@link FilterFunction} for more information
         */
        filterFn?: FilterFunction<O, G>;
    } & ScalarFloatingOptions & {
        modelValue?: O;
    }) & {
        onAdd?: (() => any) | undefined;
        "onUpdate:modelValue"?: ((value: O | undefined) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: ComboboxSlots<O, G>;
    emit: ((evt: "add") => void) & ((event: "update:modelValue", value: O | undefined) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
//# sourceMappingURL=ScalarCombobox.vue.d.ts.map