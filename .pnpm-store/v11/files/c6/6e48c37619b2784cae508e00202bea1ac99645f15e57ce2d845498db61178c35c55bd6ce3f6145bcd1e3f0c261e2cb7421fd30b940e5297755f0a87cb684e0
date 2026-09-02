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
export const createIndexDbConnection = async ({ name = 'scalar-workspace-store', tables, migrations, }) => {
    if (migrations.length === 0) {
        throw new Error(`createIndexDbConnection("${name}"): at least one migration is required. The initial schema must be defined as the first migration.`);
    }
    // The 1-based array position is the schema version. `migrations[0]` is v1,
    // `migrations[1]` is v2, and so on. The latest version is just the length.
    const latestVersion = migrations.length;
    const request = indexedDB.open(name, latestVersion);
    // Captured here so the descriptive error from a failing migration can be
    // surfaced through the `open` promise instead of the generic IDB
    // `AbortError` that follows `transaction.abort()`.
    let migrationError;
    request.onupgradeneeded = (event) => {
        const transaction = request.transaction;
        if (!transaction) {
            // IDB always provides the upgrade transaction here; this is a guard for
            // exotic environments and keeps types honest.
            return;
        }
        const context = {
            db: request.result,
            transaction,
            oldVersion: event.oldVersion,
            newVersion: event.newVersion ?? latestVersion,
        };
        // Run pending migrations sequentially, awaiting any async work before
        // starting the next one. This is important when a migration reads
        // existing data via IDB requests (e.g. `getAll`) and only performs the
        // real schema changes inside the request callback — the next migration
        // would otherwise execute against the pre-migration state.
        //
        // The upgrade transaction stays alive across awaits because every async
        // migration in the codebase queues at least one IDB request before
        // yielding, and microtasks complete before IDB checks for transaction
        // commit at the next task boundary.
        const runMigrations = async () => {
            for (const [index, migration] of migrations.entries()) {
                const version = index + 1;
                if (version <= event.oldVersion) {
                    continue;
                }
                try {
                    await migration.up(context);
                }
                catch (error) {
                    const label = migration.description ? `v${version} (${migration.description})` : `v${version}`;
                    throw new Error(`Migration ${label} failed: ${error?.message ?? error}`, { cause: error });
                }
            }
        };
        runMigrations().catch((error) => {
            migrationError = error;
            // Abort the upgrade transaction so we do not leave the DB in a half-
            // migrated state. Aborting fires `request.onerror`; the captured
            // `migrationError` takes precedence over the resulting `AbortError`.
            try {
                transaction.abort();
            }
            catch {
                // The transaction may already be in a finished state (e.g. when the
                // failing migration itself triggered an abort). Nothing to do.
            }
        });
    };
    await new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(migrationError ?? request.error);
        // If another tab holds an older-version connection open we would otherwise
        // hang forever waiting for the upgrade. Surface it as a clear rejection so
        // the app can react (reload, notify the user, ...) instead of freezing.
        request.onblocked = () => reject(new Error(`IndexedDB upgrade for "${name}" is blocked by another open connection. Close other tabs and try again.`));
    });
    return {
        get: (tableName) => {
            // Surface a helpful error if a caller asks for a table that is not in
            // the typed config — the underlying IDB call would otherwise throw a
            // generic `NotFoundError` from a lazy `transaction()`.
            if (!Object.hasOwn(tables, tableName)) {
                throw new Error(`Unknown table "${String(tableName)}". Add it to the \`tables\` config of "${name}".`);
            }
            return createTableWrapper(tableName, request.result);
        },
        closeDatabase: () => {
            request.result.close();
        },
    };
};
/**
 * Utility wrapper for interacting with an IndexedDB object store, typed by the schema.
 *
 * @template T TypeBox schema type for objects in the store
 * @template K Key property names that compose the primary key
 */
function createTableWrapper(name, db) {
    /**
     * Gets the object store from the latest DB connection, for the given transaction mode.
     */
    const getStore = (mode) => {
        const tx = db.transaction(name, mode);
        return tx.objectStore(name);
    };
    /**
     * Adds or updates an item in the store.
     * @param key - The primary key values, as { key1, key2 }
     * @param value - The value for the other properties, omitting keys
     * @returns The full inserted/updated object
     */
    async function addItem(key, value) {
        const store = getStore('readwrite');
        const finalValue = { ...value, ...key };
        await requestAsPromise(store.put(finalValue));
        return finalValue;
    }
    /**
     * Retrieves a single item by composite key.
     * @param key - Key values. For a single key: { id: '...' }
     * @returns The found object or undefined
     */
    function getItem(key) {
        const store = getStore('readonly');
        const keyValues = Object.values(key);
        // For single keys, pass value directly; for compound keys, pass array
        const keyToUse = keyValues.length === 1 ? keyValues[0] : keyValues;
        return requestAsPromise(store.get(keyToUse));
    }
    /**
     * Returns all records matching a partial (prefix) key. Use for composite keys.
     * For non-compound keys, pass single-element array: getRange(['some-id'])
     * For prefix search, pass subset of key parts.
     */
    function getRange(partialKey, indexName) {
        const store = getStore('readonly');
        const objectStoreOrIndex = indexName ? store.index(indexName) : store;
        const results = [];
        // Construct upper bound to match all keys starting with partialKey
        const upperBound = [...partialKey];
        upperBound.push([]); // ensures upper bound includes all keys with this prefix
        const range = IDBKeyRange.bound(partialKey, upperBound, false, true);
        return new Promise((resolve, reject) => {
            const req = objectStoreOrIndex.openCursor(range);
            req.onerror = () => reject(req.error);
            req.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    resolve(results);
                }
            };
        });
    }
    /**
     * Deletes an item from the store by its composite key.
     */
    async function deleteItem(key) {
        const store = getStore('readwrite');
        const keyValues = Object.values(key);
        // For single keys, pass value directly; for compound keys, pass array
        const keyToUse = keyValues.length === 1 ? keyValues[0] : keyValues;
        await requestAsPromise(store.delete(keyToUse));
    }
    /**
     * Deletes all records matching a partial (prefix) key. Use for composite keys.
     */
    function deleteRange(partialKey) {
        const store = getStore('readwrite');
        let deletedCount = 0;
        // Construct upper bound to match all keys starting with partialKey
        const upperBound = [...partialKey];
        upperBound.push([]); // ensures upper bound includes all keys with this prefix
        const range = IDBKeyRange.bound(partialKey, upperBound, false, true);
        return new Promise((resolve, reject) => {
            const req = store.openCursor(range);
            req.onerror = () => reject(req.error);
            req.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    cursor.delete();
                    deletedCount++;
                    cursor.continue();
                }
                else {
                    resolve(deletedCount);
                }
            };
        });
    }
    /**
     * Deletes all items from the table.
     */
    async function deleteAll() {
        const store = getStore('readwrite');
        await requestAsPromise(store.clear());
    }
    /**
     * Retrieves all items from the table.
     */
    function getAll() {
        const store = getStore('readonly');
        return requestAsPromise(store.getAll());
    }
    return {
        addItem,
        getItem,
        getRange,
        deleteItem,
        deleteRange,
        getAll,
        deleteAll,
    };
}
function requestAsPromise(req) {
    return new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}
