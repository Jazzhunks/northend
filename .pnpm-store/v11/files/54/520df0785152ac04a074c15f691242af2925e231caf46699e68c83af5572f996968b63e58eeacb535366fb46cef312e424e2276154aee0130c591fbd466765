/**
 * Extracts the trailing identifier from a `#/...` JSON Pointer `$ref` whose parent path matches
 * the expected sequence of segments. Decodes `~1`/`~0` escapes so identifiers containing `/` or `~`
 * round-trip to their map keys.
 *
 * Returns `undefined` when the ref does not start with `#/`, the parent path does not match
 * exactly, the trailing name is missing, or there are extra segments beyond the name.
 *
 * @example
 * getNameFromRef('#/channels/foo', ['channels']) // → 'foo'
 * getNameFromRef('#/components/securitySchemes/tenant~1admin~0v2', ['components', 'securitySchemes']) // → 'tenant/admin~v2'
 * getNameFromRef('#/servers/foo/extra', ['servers']) // → undefined
 */
export declare const getNameFromRef: (ref: string, parentPath: readonly string[]) => string | undefined;
//# sourceMappingURL=get-name-from-ref.d.ts.map