/**
 * Create a safe function from an unsafe one.
 *
 * @param cb - The async function to wrap.
 * @param [eh] - Optional fallback error handler.
 * @returns A new function that returns a typesafe Result.
 *
 * @example
 * const getUser = n.safeFn(
 *   async (id: string) => {
 *     const res = await fetch(`https://example.com/users/${id}`);
 *     if (!res.ok) return { success: false, error: "FAILED_TO_FETCH" };
 *
 *     return { success: true, data: await res.json() };
 *   },
 *   () => "FAILED_TO_GET_USER"
 * );
 *
 * const getUserResult = await getUser("some-user-id");
 * if (!getUserResult.success) {
 *   console.error(getUserResult.error);
 * } else {
 *   console.log(getUserResult.data);
 * }
 */
function safeFn(cb, eh) {
    const createErrorResult = (e) => ({
        success: false,
        error: eh?.(e) ?? null,
    });
    return (...args) => {
        try {
            const result = cb(...args);
            if (result instanceof Promise)
                return result.catch(createErrorResult);
            return result;
        }
        catch (e) {
            return createErrorResult(e);
        }
    };
}
/**
 * Run an unsafe function, handle any errors and return a Result.
 *
 * @param cb - The async function to call.
 * @param [eh] - Optional fallback error handler.
 * @returns The awaited return value of cb.
 *
 * @example
 * const user = await n.fromUnsafe(() => db.findUser('some-user-id'), () => 'FAILED_T0_FIND_USER')
 * if (!user.success) {
 * 	console.error(user.error)
 * } else {
 * 	console.log(user.data)
 * }
 */
function fromUnsafe(cb, eh) {
    const createErrorResult = (e) => ({
        success: false,
        error: eh?.(e) ?? null,
    });
    const createSuccessResult = (data) => ({
        success: true,
        data,
    });
    try {
        const result = cb();
        if (result instanceof Promise)
            return result.then(createSuccessResult).catch(createErrorResult);
        return createSuccessResult(result);
    }
    catch (e) {
        return createErrorResult(e);
    }
}
function resultsToResult(results) {
    let success = true;
    const error = [];
    const data = [];
    for (const result of results) {
        if (!result.success) {
            success = false;
            error.push(result.error);
        }
        else {
            data.push(result.data);
        }
    }
    return success ? { success: true, data } : { success: false, error };
}
export const n = { safeFn, fromUnsafe, resultsToResult };
