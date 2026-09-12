import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { history, historyKeymap, indentWithTab, insertNewline } from '@codemirror/commands';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { xml } from '@codemirror/lang-xml';
import { yaml } from '@codemirror/lang-yaml';
import { bracketMatching, defaultHighlightStyle, foldGutter, indentOnInput, syntaxHighlighting, } from '@codemirror/language';
import { linter } from '@codemirror/lint';
import { StateEffect } from '@codemirror/state';
import { EditorView, highlightSpecialChars, keymap, lineNumbers as lineNumbersExtension, placeholder as placeholderExtension, } from '@codemirror/view';
import { computed, onBeforeUnmount, ref, toValue, watch } from 'vue';
const CHEVRON_DOWN = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m18 10-6 6-6-6" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHEVRON_RIGHT = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
import { customTheme } from '../themes/index.js';
import { variables } from './variables.js';
/**
 * This was an insane bug that only exists in chrome
 *
 * Found these issues which may be related, it says che chrome one is fixed, they possibly had a regression?
 *
 * @see https://issues.chromium.org/issues/375711382
 * @see https://discuss.codemirror.net/t/experimental-support-for-editcontext/8144
 * @see https://github.com/codemirror/dev/issues/1458
 */
// @ts-expect-error this is the workaround suggested by codemirror
EditorView.EDIT_CONTEXT = false;
/** Check if the hook has a provider. In provider mode we ignore the content variable */
const hasProvider = (params) => 'provider' in params && !!toValue(params.provider);
const selectAllKeyBinding = {
    key: 'Mod-a',
    run: (view) => {
        // Select the entire content
        view.dispatch({
            selection: { anchor: 0, head: view.state.doc.length },
            scrollIntoView: false,
        });
        return true;
    },
};
/** Reactive CodeMirror Integration */
export const useCodeMirror = (params) => {
    const codeMirror = ref(null);
    /** Set the codemirror content value */
    const setCodeMirrorContent = (newValue = '') => {
        if (!codeMirror.value) {
            return;
        }
        // No need to set the CodeMirror content if nothing has changed
        if (codeMirror.value.state.doc.toString() === newValue) {
            return;
        }
        codeMirror.value.dispatch({
            changes: {
                from: 0,
                to: codeMirror.value.state.doc.length,
                insert: newValue,
            },
            selection: {
                anchor: Math.min(codeMirror.value.state.selection.main.anchor, newValue.length),
            },
        });
    };
    // All options except provider
    const extensionConfig = computed(() => ({
        onChange: params.onChange,
        onBlur: params.onBlur,
        onFocus: params.onFocus,
        disableTabIndent: toValue(params.disableTabIndent),
        language: toValue(params.language),
        classes: toValue(params.classes),
        readOnly: toValue(params.readOnly),
        lineNumbers: toValue(params.lineNumbers),
        withVariables: toValue(params.withVariables),
        forceFoldGutter: toValue(params.forceFoldGutter),
        disableEnter: toValue(params.disableEnter),
        disableCloseBrackets: toValue(params.disableCloseBrackets),
        withoutTheme: toValue(params.withoutTheme),
        lint: toValue(params.lint),
        additionalExtensions: toValue(params.extensions),
        placeholder: toValue(params.placeholder),
    }));
    // Unmounts CodeMirror if it's mounted already, and mounts CodeMirror, if the given ref exists.
    watch(params.codeMirrorRef, () => {
        codeMirror.value?.destroy();
        mountCodeMirror();
    }, { immediate: true });
    // Cleanup codemirror
    onBeforeUnmount(() => codeMirror.value?.destroy());
    // Initializes CodeMirror.
    function mountCodeMirror() {
        if (params.codeMirrorRef.value) {
            const provider = hasProvider(params) ? toValue(params.provider) : null;
            const extensions = getCodeMirrorExtensions({
                ...extensionConfig.value,
                provider,
            });
            codeMirror.value = new EditorView({
                parent: params.codeMirrorRef.value,
                extensions,
            });
            // Set the initial content if a provider is not in use
            if (!hasProvider(params)) {
                setCodeMirrorContent(toValue(params.content));
            }
        }
    }
    // ---------------------------------------------------------------------------
    // Provider must be watched separately because we need to restart codemirror if the provider changes
    watch(() => (hasProvider(params) ? toValue(params.provider) : null), () => {
        if (hasProvider(params)) {
            codeMirror.value?.destroy();
            mountCodeMirror();
        }
    });
    // Update the extensions whenever parameters changes
    watch(extensionConfig, () => {
        if (!codeMirror.value) {
            return;
        }
        // If a provider is
        const provider = hasProvider(params) ? toValue(params.provider) : null;
        const extensions = getCodeMirrorExtensions({
            ...extensionConfig.value,
            provider,
        });
        requestAnimationFrame(() => {
            codeMirror.value?.dispatch({
                effects: StateEffect.reconfigure.of(extensions),
            });
        });
    }, { immediate: true });
    // ---------------------------------------------------------------------------
    // Keep the content in sync when the content is managed externally
    watch(() => toValue(params.content), () => {
        // When a provider is in use we do not map the content value back to the codemirror instance
        if (hasProvider(params)) {
            return;
        }
        setCodeMirrorContent(toValue(params.content));
    }, { immediate: true });
    return {
        /** Replaces the current content with the given value. */
        setCodeMirrorContent,
        /** Codemirror instance */
        codeMirror,
    };
};
// ---------------------------------------------------------------------------
const languageExtensions = {
    html: html,
    json: json,
    yaml: yaml,
    css: css,
    xml: xml,
};
/** Generate  the list of extension from parameters */
function getCodeMirrorExtensions({ onChange, onBlur, onFocus, provider, language, classes = [], readOnly = false, lineNumbers = false, withVariables = false, forceFoldGutter = false, disableEnter = false, disableCloseBrackets = false, disableTabIndent = false, withoutTheme = false, lint = false, additionalExtensions = [], placeholder, }) {
    const extensions = [
        highlightSpecialChars(),
        history(),
        keymap.of(historyKeymap),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        EditorView.theme({
            '.cm-line': {
                lineHeight: '22px',
                padding: '0 2px 0 4px',
            },
            '.cm-gutterElement': {
                lineHeight: '22px',
            },
            // Center the fold chevron within the line and give it a muted, interactive look
            '.cm-foldGutter .cm-gutterElement': {
                display: 'flex',
                alignItems: 'center',
                // Nudge the chevron off the line numbers so it sits between them and the code
                paddingLeft: '4px',
            },
            '.cm-foldMarker': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '22px',
                color: 'var(--scalar-color-3)',
                cursor: 'pointer',
            },
            '.cm-foldMarker:hover': {
                color: 'var(--scalar-color-1)',
            },
            '.cm-foldMarker svg': {
                width: '16px',
                height: '16px',
            },
            '.cm-tooltip': {
                background: 'var(--scalar-background-1)',
                border: '1px solid var(--scalar-border-color)',
                borderRadius: 'var(--scalar-radius)',
                boxShadow: 'var(--scalar-shadow-2)',
                fontSize: '12px',
                overflow: 'hidden',
            },
            '.cm-tooltip-autocomplete ul': {
                padding: '6px',
            },
            '.cm-tooltip-autocomplete ul li': {
                padding: '3px 6px',
                color: 'var(--scalar-color-1)',
                borderRadius: '3px',
            },
            '.cm-tooltip-autocomplete ul li[aria-selected]': {
                background: 'var(--scalar-background-2)',
                color: 'var(--scalar-color-1)',
            },
            '.cm-tooltip-autocomplete ul li:hover': {
                background: 'var(--scalar-background-3)',
                color: 'var(--scalar-color-1)',
            },
            '.cm-completionLabel': {
                color: 'var(--scalar-color-1)',
            },
            '.cm-completionDetail': {
                color: 'var(--scalar-color-3)',
            },
            '.cm-tooltip-lint': {
                backgroundColor: 'var(--scalar-background-1)',
            },
            '.cm-diagnostic-error': {
                borderLeft: '0',
                color: '#dc1b19',
            },
            '.cm-foldPlaceholder': {
                background: 'var(--scalar-background-1)',
                border: 'none',
                fontFamily: 'var(--scalar-font)',
            },
        }),
        // Listen to updates
        EditorView.updateListener.of((v) => {
            if (!v.docChanged) {
                return;
            }
            onChange?.(v.state.doc.toString());
        }),
        EditorView.domEventHandlers({
            blur: (event, view) => {
                onBlur?.(view.state.doc.toString(), event);
            },
            focus: (event, view) => {
                onFocus?.(view.state.doc.toString(), event);
            },
        }),
        // Add Classes
        EditorView.editorAttributes.of({ class: classes.join(' ') }),
        ...additionalExtensions,
    ];
    // Enable the provider
    if (provider) {
        extensions.push(provider);
    }
    // Add the theme as needed
    if (!withoutTheme) {
        extensions.push(customTheme);
    }
    // Read only
    if (readOnly) {
        extensions.push(EditorView.editable.of(false));
    }
    else {
        extensions.push(indentOnInput(), bracketMatching(), autocompletion(), keymap.of([...completionKeymap, selectAllKeyBinding]), bracketMatching());
        if (!disableCloseBrackets) {
            extensions.push(closeBrackets(), keymap.of([...closeBracketsKeymap]));
        }
        if (disableTabIndent) {
            extensions.push(keymap.of([
                {
                    key: 'Tab',
                    run: () => false, // Prevent default Tab behavior
                    shift: () => false, // Prevent default Shift+Tab behavior
                },
            ]));
        }
        else {
            extensions.push(keymap.of([indentWithTab]));
        }
    }
    // Add placeholder extension if placeholder is provided
    if (placeholder) {
        extensions.push(placeholderExtension(placeholder));
    }
    // Line numbers
    if (lineNumbers) {
        extensions.push(lineNumbersExtension());
    }
    if (forceFoldGutter) {
        extensions.push(foldGutter({
            markerDOM: (open) => {
                const icon = document.createElement('div');
                icon.classList.add('cm-foldMarker');
                icon.innerHTML = open ? CHEVRON_DOWN : CHEVRON_RIGHT;
                return icon;
            },
        }));
    }
    // Syntax highlighting
    if (language && languageExtensions[language]) {
        extensions.push(languageExtensions[language]());
        if (!forceFoldGutter) {
            extensions.push(foldGutter({
                markerDOM: (open) => {
                    const icon = document.createElement('div');
                    icon.classList.add('cm-foldMarker');
                    icon.innerHTML = open ? CHEVRON_DOWN : CHEVRON_RIGHT;
                    return icon;
                },
            }));
        }
    }
    // JSON Linter
    if (lint && language === 'json') {
        const jsonLinter = linter((view) => {
            const diagnostics = [];
            const content = view.state.doc.toString();
            if (content.trim()) {
                try {
                    JSON.parse(content);
                }
                catch (e) {
                    if (e instanceof Error) {
                        diagnostics.push({
                            from: 0,
                            to: view.state.doc.length,
                            severity: 'error',
                            message: e.message,
                        });
                    }
                }
            }
            return diagnostics;
        });
        extensions.push(jsonLinter);
    }
    // Highlight variables
    if (withVariables) {
        extensions.push(variables());
    }
    if (disableEnter) {
        extensions.push(keymap.of([
            {
                key: 'Enter',
                run: () => {
                    return true;
                },
            },
            {
                key: 'Ctrl-Enter',
                mac: 'Cmd-Enter',
                run: () => {
                    return true;
                },
            },
            {
                key: 'Shift-Enter',
                run: () => {
                    return true;
                },
            },
        ]));
    }
    else {
        extensions.push(keymap.of([
            {
                key: 'Enter',
                run: insertNewline,
            },
        ]));
    }
    return extensions;
}
