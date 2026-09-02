import { type CodeMirrorLanguage, type Extension } from '@scalar/use-codemirror';
import type { XScalarEnvironment } from '@scalar/workspace-store/schemas/extensions/document/x-scalar-environments';
import { type Ref } from 'vue';
import type { ClientLayout } from '../../../v2/types/layout';
export type CodeInputModelValue = string | number | boolean | Array<string | number | boolean> | Record<string, unknown>;
/**
 * CodeInput
 *
 * A versatile input component that adapts its rendering based on props:
 * - Disabled mode: Read-only text display
 * - Select mode: Dropdown for enums, booleans, or examples
 * - Editor mode: CodeMirror with environment variable support
 *
 * Type `{{` to trigger autocomplete for environment variables and runtime context functions
 * (for example `{{$guid}}`) when an environment is provided.
 * It takes in any data but always will emit a string value,
 * this string should then be parsed in accordance to the schema or content type.
 *
 * @example
 * ```vue
 * <!-- Basic input with environment variables -->
 * <CodeInput v-model="value" :environment="env" />
 *
 * <!-- Boolean select -->
 * <CodeInput v-model="flag" type="boolean" />
 *
 * <!-- JSON editor with linting -->
 * <CodeInput v-model="data" language="json" :lint="true" />
 * ```
 */
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<{
    modelValue: CodeInputModelValue;
    /** Environment for variable substitution. Pass undefined to disable environment variables */
    environment: XScalarEnvironment | undefined;
    /** Type of the input value, affects rendering mode for booleans */
    type?: string | string[];
    /** Render as disabled text display */
    disabled?: boolean;
    /** Show error styling */
    error?: boolean;
    /** Layout context affects styling and behavior */
    layout?: ClientLayout;
    /** Predefined enum values, triggers select mode */
    enum?: string[];
    /** Example values, triggers select mode */
    examples?: string[];
    /** Default value to show in select mode */
    default?: CodeInputModelValue;
    /** Allow null in boolean select options */
    nullable?: boolean;
    /** Placeholder text for empty input */
    placeholder?: string;
    /** Show required indicator */
    required?: boolean;
    /** Enable color picker extension */
    colorPicker?: boolean;
    /** Show line numbers in editor */
    lineNumbers?: boolean;
    /** Enable linting */
    lint?: boolean;
    /** Enable line wrapping */
    lineWrapping?: boolean;
    /** CodeMirror language mode */
    language?: CodeMirrorLanguage;
    /** Additional CodeMirror extensions */
    extensions?: Extension[];
    /** Disable tab key for indentation */
    disableTabIndent?: boolean;
    /** Disable enter key */
    disableEnter?: boolean;
    /** Disable automatic bracket closing */
    disableCloseBrackets?: boolean;
    /** Emit submit event on blur */
    emitOnBlur?: boolean;
    /** Enable environment variable pills */
    withVariables?: boolean;
    /** Enable fake data suggestions like $guid, $timestamp, etc. Should only be enabled for parameters and request bodies */
    withFakeData?: boolean;
    /** Emit change event even if the value is the same */
    alwaysEmitChange?: boolean;
    /** Custom change handler, prevents default emit */
    handleFieldChange?: (value: string) => void;
    /** Custom submit handler, prevents default emit */
    handleFieldSubmit?: (value: string) => void;
    /** Put a linethrough on the input text */
    linethrough?: boolean;
}, {
    /**
     * Focus the codemirror element
     *
     * @param cursorAtEnd boolean place the cursor at the end of the input
     */
    focus: (position?: "start" | "end" | number) => void;
    isFocused: Ref<boolean, boolean>;
    handleChange: (value: string) => void;
    handleSubmit: (value: string, event: KeyboardEvent | FocusEvent) => void;
    handleBlur: (value: string, event: FocusEvent) => void;
    booleanOptions: import("vue").ComputedRef<string[]>;
    codeMirror: Ref<import("@codemirror/view").EditorView | null, import("@codemirror/view").EditorView | null>;
    codeMirrorRef: Ref<HTMLDivElement | null, HTMLDivElement | null>;
    modelValue: CodeInputModelValue;
    setCodeMirrorContent: (content?: string) => void;
    cursorPosition: () => number | undefined;
    serializeValue: (value: CodeInputModelValue) => string;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    submit: (value: string, event: KeyboardEvent | FocusEvent) => any;
    "update:modelValue": (value: string) => any;
    blur: (value: string, event: FocusEvent) => any;
    navigate: (route: {
        page: "document";
        path: "environment";
    }) => any;
}, string, import("vue").PublicProps, Readonly<{
    modelValue: CodeInputModelValue;
    /** Environment for variable substitution. Pass undefined to disable environment variables */
    environment: XScalarEnvironment | undefined;
    /** Type of the input value, affects rendering mode for booleans */
    type?: string | string[];
    /** Render as disabled text display */
    disabled?: boolean;
    /** Show error styling */
    error?: boolean;
    /** Layout context affects styling and behavior */
    layout?: ClientLayout;
    /** Predefined enum values, triggers select mode */
    enum?: string[];
    /** Example values, triggers select mode */
    examples?: string[];
    /** Default value to show in select mode */
    default?: CodeInputModelValue;
    /** Allow null in boolean select options */
    nullable?: boolean;
    /** Placeholder text for empty input */
    placeholder?: string;
    /** Show required indicator */
    required?: boolean;
    /** Enable color picker extension */
    colorPicker?: boolean;
    /** Show line numbers in editor */
    lineNumbers?: boolean;
    /** Enable linting */
    lint?: boolean;
    /** Enable line wrapping */
    lineWrapping?: boolean;
    /** CodeMirror language mode */
    language?: CodeMirrorLanguage;
    /** Additional CodeMirror extensions */
    extensions?: Extension[];
    /** Disable tab key for indentation */
    disableTabIndent?: boolean;
    /** Disable enter key */
    disableEnter?: boolean;
    /** Disable automatic bracket closing */
    disableCloseBrackets?: boolean;
    /** Emit submit event on blur */
    emitOnBlur?: boolean;
    /** Enable environment variable pills */
    withVariables?: boolean;
    /** Enable fake data suggestions like $guid, $timestamp, etc. Should only be enabled for parameters and request bodies */
    withFakeData?: boolean;
    /** Emit change event even if the value is the same */
    alwaysEmitChange?: boolean;
    /** Custom change handler, prevents default emit */
    handleFieldChange?: (value: string) => void;
    /** Custom submit handler, prevents default emit */
    handleFieldSubmit?: (value: string) => void;
    /** Put a linethrough on the input text */
    linethrough?: boolean;
}> & Readonly<{
    onSubmit?: ((value: string, event: KeyboardEvent | FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onBlur?: ((value: string, event: FocusEvent) => any) | undefined;
    onNavigate?: ((route: {
        page: "document";
        path: "environment";
    }) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, {
    warning?: (props: {}) => any;
} & {
    icon?: (props: {}) => any;
}>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=CodeInput.vue.d.ts.map