import type { Heading, Node, PhrasingContent } from 'mdast';
export type { Node } from 'mdast';
/**
 * Type-guard to check if a node is a heading.
 */
export declare const isHeading: (node: Node) => node is Heading;
/**
 * Take a Markdown string and generate HTML from it
 */
export declare function htmlFromMarkdown(markdown: string, options?: {
    removeTags?: string[];
    allowTags?: string[];
    transform?: (node: Node) => Node;
    transformType?: string;
}): string;
/**
 * Find all headings of a specific type in a Markdown AST.
 */
export declare function getHeadings(markdown: string, depth?: number): {
    depth: number;
    value: string;
}[];
/**
 * Extract plain text from a Markdown AST node (recursively).
 *
 * Handles headings with nested phrasing content such as links.
 */
export declare function textFromNode(node: Heading | PhrasingContent): string;
/**
 * Return multiple Markdown documents. Every heading should be its own document.
 */
export declare function splitContent(markdown: string): string[];
//# sourceMappingURL=markdown.d.ts.map