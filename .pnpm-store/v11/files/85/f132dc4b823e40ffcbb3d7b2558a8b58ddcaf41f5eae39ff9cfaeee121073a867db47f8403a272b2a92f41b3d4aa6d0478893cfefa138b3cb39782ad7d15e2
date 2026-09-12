import type { CXOptions } from 'cva';
import { type StyleValue } from 'vue';
/**
 * Provides a wrapper around the `cx` function that merges the
 * component's class attribute with the provided classes and binds the
 * remaining attributes
 *
 * @see https://beta.cva.style/api-reference#cx
 *
 * @example
 * <script setup>
 * import { useBindCx, cva } from '@scalar/use-hooks/useBindCx'
 *
 * defineProps<{ active?: boolean }>()
 *
 * // Important: disable inheritance of attributes
 * defineOptions({ inheritAttrs: false })
 *
 * const { cx } = useBindCx()
 *
 * const variants = cva({
 *   base: 'border rounded p-2 bg-b-1',
 *   variants: { active: { true: 'bg-b-2' } },
 * })
 * </script>
 * <template>
 *   <div v-bind="cx(variants({ active }))">MockComponent</div>
 * </template>
 */
export declare function useBindCx(): {
    /**
     * Provides a wrapper around the `cx` function that merges the
     * component's class attribute with the provided classes and binds the
     * remaining attributes
     *
     * @example
     * ```html
     * <script setup>
     * ...
     * const { cx } = useBindCx()
     * </script>
     * <template>
     *   <div v-bind="cx(...)">...</div>
     * </template>
     * ```
     */
    cx: (...args: CXOptions) => {
        /** The merged class attribute */
        class: string;
        /** The remaining attributes */
        [key: string]: any;
    };
    /**
     * Provides a wrapper around the `cx` function that merges the
     * component's class attribute with the provided classes and binds the
     * style attribute  but **does not** bind any other attributes.
     *
     * Typically used in conjunction with `otherAttrs` to apply the stylistic
     * attributes to a styled wrapper element, but apply the remaining
     * attributes to an internal semantic element like an `<input>`.
     *
     * @example
     * ```html
     * <script setup>
     * ...
     * const { stylingAttrsCx, otherAttrs } = useBindCx()
     * </script>
     * <template>
     *   <!-- Bind the class and style attributes to a wrapper element -->
     *   <div v-bind="stylingAttrsCx(...)">
     *     ...
     *     <!-- Bind the other attributes to a semantic internal element -->
     *     <input v-bind="otherAttrs" />
     *   </div>
     * </template>
     * ```
     */
    stylingAttrsCx: (...args: CXOptions) => {
        /** The merged class attribute */
        class: string;
        style: StyleValue;
    };
    /**
     * The remaining attributes that **are not** the class or style attributes
     * of the component.
     *
     * Typically used in conjunction with `stylingAttrsCx` to apply the stylistic
     * attributes to a styled wrapper element, but apply the remaining
     * attributes to an internal semantic element like an `<input>`.
     *
     * @example
     * ```html
     * <script setup>
     * ...
     * const { stylingAttrsCx, otherAttrs } = useBindCx()
     * </script>
     * <template>
     *   <!-- Bind the class and style attributes to a wrapper element -->
     *   <div v-bind="stylingAttrsCx(...)">
     *     ...
     *     <!-- Bind the other attributes to a semantic internal element -->
     *     <input v-bind="otherAttrs" />
     *   </div>
     * </template>
     */
    otherAttrs: import("vue").ComputedRef<{
        [key: string]: unknown;
    }>;
};
//# sourceMappingURL=useBindCx.d.ts.map