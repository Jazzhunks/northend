/**
 * Creates an in-memory VariablesStore for a single request execution,
 * managing environment, collection, global, and local variables in priority order.
 */
export function createVariablesStoreForRequest() {
    const environmentEntries = [];
    const collectionEntries = [];
    const worksapceEntries = [];
    const localVariables = [];
    return {
        getEnvironment: () => environmentEntries,
        getGlobals: () => worksapceEntries,
        getCollectionVariables: () => collectionEntries,
        getData: () => ({}),
        getLocalVariables: () => {
            return localVariables;
        },
        setLocalVariables: (variables) => {
            localVariables.length = 0;
            localVariables.push(...variables);
        },
        setCollectionVariables: (variables) => {
            collectionEntries.length = 0;
            collectionEntries.push(...variables);
        },
        setEnvironment: (variables) => {
            environmentEntries.length = 0;
            environmentEntries.push(...variables);
        },
        setGlobals: (variables) => {
            worksapceEntries.length = 0;
            worksapceEntries.push(...variables);
        },
        getVariables: () => {
            return Object.fromEntries([...worksapceEntries, ...collectionEntries, ...environmentEntries, ...localVariables].map((v) => [
                v.key,
                v.value,
            ]));
        },
    };
}
