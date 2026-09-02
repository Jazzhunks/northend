export type Result<T = unknown, E = unknown> = {
    success: true;
    data: T;
} | {
    success: false;
    error: E;
};
type DataOf<R extends Result> = R extends {
    success: true;
    data: infer D;
} ? D : never;
type ErrorOf<R extends Result> = R extends {
    success: false;
    error: infer E;
} ? E : never;
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
declare function safeFn<T extends Result | Promise<Result>, A extends unknown[], E = null>(cb: (...args: A) => T, eh?: (e: unknown) => E): (...args: A) => T | Result<never, E>;
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
declare function fromUnsafe<T, E = null, R = T extends Promise<unknown> ? Promise<Result<Awaited<T>, E>> : Result<T, E>>(cb: () => T, eh?: (err: unknown) => E): R;
declare function resultsToResult<R extends Result[]>(results: R): Result<DataOf<R[number]>[], ErrorOf<R[number]>[]>;
export declare const n: {
    safeFn: typeof safeFn;
    fromUnsafe: typeof fromUnsafe;
    resultsToResult: typeof resultsToResult;
};
export {};
