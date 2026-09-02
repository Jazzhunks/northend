import { type DecorationSet, EditorView, ViewPlugin, type ViewUpdate } from '@scalar/use-codemirror';
import type { XScalarEnvironment } from '@scalar/workspace-store/schemas/extensions/document/x-scalar-environments';
/**
 * Styles the active environment variable pill.
 * This plugin creates decorations for environment variables in the editor.
 */
export declare const pillPlugin: (props: {
    environment: XScalarEnvironment | undefined;
    isReadOnly: boolean | undefined;
    isContextFunctionName?: (name: string) => boolean;
}) => ViewPlugin<{
    decorations: DecorationSet;
    lastEnvironment: XScalarEnvironment | undefined;
    update(update: ViewUpdate): void;
    buildDecorations(view: EditorView): DecorationSet;
}>;
/**
 * Custom backspace handler for the editor.
 * Handles special cases like removing entire variable syntax and clearing all content.
 */
export declare const backspaceCommand: import("@codemirror/state").Extension;
//# sourceMappingURL=code-variable-widget.d.ts.map