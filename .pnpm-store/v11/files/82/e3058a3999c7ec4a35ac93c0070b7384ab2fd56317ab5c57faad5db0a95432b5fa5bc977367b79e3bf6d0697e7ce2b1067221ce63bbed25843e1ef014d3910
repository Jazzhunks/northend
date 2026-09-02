/**
 * Builds a reverse index for fast ID-based lookup and attaches a `parent` property to each node for upward traversal.
 *
 * @template T - The node type (must include `id`).
 * @template Key - The key pointing to nested children arrays (defaults to 'children').
 *
 * @param items - The root-level array of entities to index.
 * @param nestedKey - The property name that contains child nodes within an entity (defaults to 'children').
 * @param filter - Optional. A predicate to determine which nodes are included in the map (default: includes all).
 * @param getId - Optional. A function to obtain the unique ID from a node (defaults to `node.id`).
 * @returns A Map where each key is a node's ID and each value is the node, extended with an optional `parent` property.
 *
 * @example
 * const data = [
 *   { id: '1', name: 'Root', children: [
 *     { id: '2', name: 'Child 1' },
 *     { id: '3', name: 'Child 2', children: [
 *       { id: '4', name: 'Grandchild' }
 *     ]}
 *   ]}
 * ];
 * const index = generateReverseIndex({ items: data });
 * // index.get('3') => { id: '3', name: 'Child 2', children: [...], parent: { id: '1', ... } }
 * // index.get('4') => { id: '4', name: 'Grandchild', parent: { id: '3', ... } }
 */
export declare const generateReverseIndex: <T extends {
    id: string;
} & Record<string, unknown>, Key extends string>({ items, nestedKey, filter, getId, }: {
    items: T[];
    nestedKey?: Key;
    filter?: (node: T) => boolean;
    getId?: (node: T) => string;
}) => Map<string, T & {
    parent?: T;
}>;
//# sourceMappingURL=generate-reverse-index.d.ts.map