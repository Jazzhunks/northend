/**
 * Generates a unique value based on a given default value and a validation function.
 *
 * The process works as follows:
 * 1. Optionally transform (e.g., slugify) the default value using a transformation function.
 * 2. Check if this value is unique by executing the provided validation function.
 * 3. If not unique, repeatedly append an incrementing integer (e.g., "my-name 1", "my-name 2", ...) and re-check uniqueness,
 *    up to a maximum number of attempts (maxRetries).
 * 4. Returns the first unique value found or undefined if a unique value cannot be generated within the maximum retries.
 *
 * Example:
 * ```ts
 * // Existing names in use
 * const existing = new Set(['foo', 'foo 1', 'foo 2']);
 * const uniqueName = generateUniqueValue({
 *   defaultValue: 'foo',
 *   validation: (value) => !existing.has(value),
 *   // transformation is optional, e.g. (val) => val.toLowerCase().replace(/[^\w]+/g, '-'),
 *   maxRetries: 10,
 * });
 * // uniqueName === 'foo 3'
 * ```
 */
export declare function generateUniqueValue({ defaultValue, 
/** Check function to verify the uniqueness of the value */
validation, 
/** Transformation function to transform the default value (such as into a slug) */
transformation, 
/** The maximum number of attempts to create a unique value by incrementing. */
maxRetries, }: {
    /**
     * The original value to base the unique generation upon.
     * Example: "workspace", which may end up producing "workspace 2", "workspace 3", etc.
     */
    defaultValue: string;
    /**
     * Validation function that determines if a generated value is unique.
     * Should return true if the value is unique; false if not.
     * Can be asynchronous or synchronous.
     */
    validation: (value: string) => Promise<boolean> | boolean;
    /**
     * Optional function to transform the default value before attempting uniqueness.
     * Example: Transform "Workspace A" into "workspace-a" to follow a slug schema.
     */
    transformation?: (value: string) => string;
    /**
     * The maximum number of attempts to create a unique value by incrementing.
     * For example, if set to 5: "foo", "foo 1", "foo 2", "foo 3", "foo 4" will be attempted.
     */
    maxRetries: number;
}): Promise<string | undefined>;
//# sourceMappingURL=generate-unique-value.d.ts.map