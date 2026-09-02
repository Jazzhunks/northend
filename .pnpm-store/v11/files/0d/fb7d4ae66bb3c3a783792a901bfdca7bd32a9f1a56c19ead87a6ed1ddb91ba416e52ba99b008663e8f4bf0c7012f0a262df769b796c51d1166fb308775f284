import type { HttpMethod } from '@scalar/helpers/http/http-methods';
import { type NodeInput } from '../helpers/get-resolved-ref.js';
import type { OperationObject } from '../schemas/v3.1/strict/operation.js';
import type { PathItemObject } from '../schemas/v3.1/strict/path-item.js';
/**
 * Resolves a path item (or webhook path item), merging sibling properties alongside `$ref`.
 */
export declare const getResolvedPathItem: (pathItem: NodeInput<PathItemObject> | undefined) => PathItemObject | undefined;
/**
 * Returns an operation from a path item, resolving $ref wrappers on the path item first.
 */
export declare const getPathItemOperation: (pathItem: NodeInput<PathItemObject> | undefined, method: HttpMethod) => NodeInput<OperationObject> | undefined;
/**
 * Assigns an operation on a path item, including when the path item is a $ref wrapper.
 */
export declare const setPathItemOperation: (pathItem: NodeInput<PathItemObject> | undefined, method: HttpMethod, operation: OperationObject) => void;
/**
 * Deletes an operation from a path item, including when the path item is a $ref wrapper.
 */
export declare const deletePathItemOperation: (pathItem: NodeInput<PathItemObject> | undefined, method: HttpMethod) => void;
/**
 * Invokes a callback for each HTTP method operation on a path item, resolving $ref wrappers first.
 */
export declare const forEachPathItemOperation: (pathItem: NodeInput<PathItemObject> | undefined, callback: (method: HttpMethod, operation: NodeInput<OperationObject>) => void) => void;
/**
 * Returns whether a path item has no remaining keys after resolving $ref wrappers.
 *
 * Used when cleaning up after deleting an operation: a path entry is only removed once nothing is
 * left, so path-level metadata (`parameters`, `summary`, `servers`) and $ref wrappers are preserved
 * even when every HTTP method has been removed.
 */
export declare const pathItemIsEmpty: (pathItem: NodeInput<PathItemObject> | undefined) => boolean;
//# sourceMappingURL=for-each-path-item-operation.d.ts.map