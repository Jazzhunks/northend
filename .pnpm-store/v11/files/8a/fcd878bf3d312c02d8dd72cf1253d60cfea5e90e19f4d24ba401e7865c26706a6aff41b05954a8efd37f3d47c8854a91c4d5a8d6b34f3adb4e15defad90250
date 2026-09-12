import type { Static, TObject } from '@scalar/typebox';
/**
 * Declarative shape for a table at its CURRENT (latest) version.
 *
 * This is used purely for TypeScript typing and runtime key serialization in
 * the wrapper API returned by `get(name)`. IndexedDB schema (object stores,
 * keyPaths, indexes) is NOT derived from this config — every schema change is
 * expressed in a migration. That keeps fresh installs and upgraded installs on
 * exactly the same code path and makes the TypeScript types safe to evolve
 * without accidentally reshaping the underlying database.
 */
type TableEntry<S extends TObject, K extends readonly (keyof Static<S>)[]> = {
    schema: S;
    keyPath: K;
};
/**
 * Context passed to every migration. The upgrade `transaction` lives for as
 * long as any IDB request on it is pending, so migrations may schedule async
 * cursor / getAll work and still mutate the same transaction afterwards.
 */
export type MigrationContext = {
    db: IDBDatabase;
    transaction: IDBTransaction;
    oldVersion: number;
    newVersion: number;
};
/**
 * A single, atomic schema (and/or data) change.
 *
 * Every structural change to the database — creating an object store, adding
 * or removing an index, renaming a field, re-keying records — lives inside a
 * migration. Fresh installs run the full chain from v1 up; existing installs
 * run only the migrations whose position is past their current version.
 *
 * The version of a migration is its 1-based position in the `migrations`
 * array passed to `createIndexDbConnection` — there is no `version` field to
 * keep in sync. Append to the end to add a new migration; never reorder or
 * insert in the middle (each position represents a real schema state that
 * shipped to users).
 *
 * Migrations may run synchronously, or may return a Promise when they need
 * to read existing data (via `getAll`, cursors, ...) before performing schema
 * changes. The runner awaits each migration before starting the next, so a
 * later migration always observes the fully-applied state of every earlier
 * migration. To keep the upgrade transaction alive across awaits, every async
 * migration must queue at least one IDB request before yielding.
 */
export type Migration = {
    /** Short human-readable summary surfaced in errors / logs. */
    description?: string;
    /** Runs inside the upgrade transaction. May be sync or async. */
    up: (context: MigrationContext) => void | Promise<void>;
};
/**
 * Initializes and manages an IndexedDB database connection for table-based persistence.
 *
 * The database version is derived from `migrations.length`, so callers cannot
 * accidentally drift between the declared version and the migrations that
 * define it. Every structural change — including the initial schema — must
 * be expressed as a migration; append new ones to the end of the array.
 *
 * Example:
 * ```ts
 * const connection = await createIndexDbConnection({
 *   name: 'my-app-db',
 *   tables: {
 *     users: { schema: UserSchema, keyPath: ['id'] as const },
 *   },
 *   migrations: [
 *     {
 *       description: 'Initial schema',
 *       up: ({ db }) => {
 *         if (!db.objectStoreNames.contains('users')) {
 *           db.createObjectStore('users', { keyPath: 'id' })
 *         }
 *       },
 *     },
 *   ],
 * })
 * ```
 */
export declare const createIndexDbConnection: <T extends Record<string, TableEntry<any, readonly (keyof any)[]>>>({ name, tables, migrations, }: {
    name: string;
    tables: T;
    migrations: readonly Migration[];
}) => Promise<{
    get: <Name extends keyof T>(tableName: Name) => {
        addItem: (key: Record<T[Name]["keyPath"][number], IDBValidKey>, value: Omit<(T[Name]["schema"] & {
            params: [];
        })["static"], T[Name]["keyPath"][number]>) => Promise<(T[Name]["schema"] & {
            params: [];
        })["static"]>;
        getItem: (key: Record<T[Name]["keyPath"][number], IDBValidKey>) => Promise<(T[Name]["schema"] & {
            params: [];
        })["static"] | undefined>;
        getRange: (partialKey: IDBValidKey[], indexName?: string) => Promise<(T[Name]["schema"] & {
            params: [];
        })["static"][]>;
        deleteItem: (key: Record<T[Name]["keyPath"][number], IDBValidKey>) => Promise<void>;
        deleteRange: (partialKey: IDBValidKey[]) => Promise<number>;
        getAll: () => Promise<(T[Name]["schema"] & {
            params: [];
        })["static"][]>;
        deleteAll: () => Promise<void>;
    };
    closeDatabase: () => void;
}>;
export {};
//# sourceMappingURL=indexdb.d.ts.map