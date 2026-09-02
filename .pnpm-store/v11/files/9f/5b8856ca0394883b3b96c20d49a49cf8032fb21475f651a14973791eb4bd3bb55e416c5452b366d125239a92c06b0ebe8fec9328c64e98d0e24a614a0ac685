export type Option = {
    id: string;
    label: string;
};
export type OptionGroup<O extends Option = Option> = {
    label: string;
    options: O[];
};
export type OptionsOrGroups<O extends Option = Option, G extends OptionGroup<O> = OptionGroup<O>> = O[] | G[];
/**
 * Filters which options appear while searching. The combobox passes the
 * current query, a flat list of every option (including those inside groups),
 * and the group objects when the list is grouped (otherwise an empty array).
 *
 * @example Match option labels, case-insensitive (similar to the default combobox filter):
 * ```ts
 * const filterByLabel = ((query, options) =>
 *   query === ''
 *     ? options
 *     : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
 * ) satisfies FilterFunction
 * ```
 */
export type FilterFunction<O extends Option = Option, G extends OptionGroup<O> = OptionGroup<O>> = (query: string, options: O[], groups: G[]) => O[];
/** Type guard to check if an array of options is an array of groups */
export declare function isGroups(options: Option[] | OptionGroup[]): options is OptionGroup[];
/** Available events emitted by the combobox */
export type ComboboxEmits = {
    /** Emitted when the "Add a new option" button is clicked */
    add: [];
};
/** Available slots for the combobox */
export type ComboboxSlots<O extends Option = Option, G extends OptionGroup<O> = OptionGroup<O>> = {
    /** The reference element / trigger for the combobox */
    default(props: {
        open: boolean;
    }): unknown;
    /** A template to override the option label */
    option?(props: {
        option: O;
        active: boolean;
        selected: boolean;
    }): unknown;
    /** A template to override the group label */
    group?(props: {
        group: G;
    }): unknown;
    /** Creates an "Add a new option" button after the options list*/
    add?(props: {
        active: boolean;
    }): unknown;
};
//# sourceMappingURL=types.d.ts.map