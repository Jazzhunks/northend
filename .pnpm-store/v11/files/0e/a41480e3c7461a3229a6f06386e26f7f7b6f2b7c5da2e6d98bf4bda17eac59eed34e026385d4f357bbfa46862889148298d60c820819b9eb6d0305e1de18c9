/**
 * Flattens the environment variables array into a key-value object.
 * If a variable value is a string, use it directly; otherwise, use its default value.
 *
 * @returns An object mapping variable names to their resolved values.
 */
export const getEnvironmentVariables = (environment) => {
    return environment.variables.reduce((acc, curr) => {
        acc[curr.name] = typeof curr.value === 'string' ? curr.value : curr.value.default;
        return acc;
    }, {});
};
