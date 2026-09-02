import type { LoadingState } from '@scalar/components/loading';
/**
 * Command Action Form Component
 *
 * A reusable form wrapper for command palette actions.
 * Provides a consistent layout with a main content area, optional controls,
 * and a submit button. Prevents form submission when disabled.
 *
 * @example
 * <CommandActionForm
 *   :loader
 *   :disabled="isDisabled"
 *   @submit="handleSubmit"
 *   @cancel="handleCancel"
 *   @back="handleBack"
 * >
 *   <!-- Main content goes in default slot -->
 *   <CommandActionInput v-model="value" />
 *
 *   <!-- Optional controls in options slot -->
 *   <template #options>
 *     <ScalarCheckbox v-model="option" />
 *   </template>
 *
 *   <!-- Custom submit button text -->
 *   <template #submit>Create</template>
 * </CommandActionForm>
 */
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<{
    /** Loading state from useLoadingState composable to show spinner on submit button */
    loader?: LoadingState;
    /** Whether the form and submit button are disabled */
    disabled?: boolean;
}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    submit: () => any;
    cancel: () => any;
    back: (e: KeyboardEvent) => any;
}, string, import("vue").PublicProps, Readonly<{
    /** Loading state from useLoadingState composable to show spinner on submit button */
    loader?: LoadingState;
    /** Whether the form and submit button are disabled */
    disabled?: boolean;
}> & Readonly<{
    onSubmit?: (() => any) | undefined;
    onCancel?: (() => any) | undefined;
    onBack?: ((e: KeyboardEvent) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, {
    /** Main content area for form inputs */
    default(): void;
    /** Optional controls displayed before the submit button (e.g., checkboxes, toggles, dropdowns) */
    options(): void;
    /** Custom text or content for the submit button (defaults to "Continue") */
    submit(): void;
}>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=CommandActionForm.vue.d.ts.map