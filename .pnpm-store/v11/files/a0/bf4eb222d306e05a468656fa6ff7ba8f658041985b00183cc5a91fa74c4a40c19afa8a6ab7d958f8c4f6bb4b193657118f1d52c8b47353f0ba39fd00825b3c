//#region src/helpers/generate-reverse-index.ts
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
var generateReverseIndex = ({ items, nestedKey = "children", filter = () => true, getId = (node) => node.id }) => {
	const mapping = /* @__PURE__ */ new Map();
	const dfs = (node) => {
		if (filter(node)) mapping.set(getId(node), node);
		if (nestedKey in node && Array.isArray(node[nestedKey])) node[nestedKey]?.forEach((it) => dfs({
			...it,
			parent: node
		}));
	};
	items.forEach(dfs);
	return mapping;
};
//#endregion
export { generateReverseIndex };

//# sourceMappingURL=generate-reverse-index.js.map