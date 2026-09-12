const DB_NAME = "northend-notifications";
const STORE_NAME = "notifications";
const MAX_NOTIFICATIONS = 100;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
  });
}

export async function getNotifications(): Promise<any[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const results = request.result || [];
      results.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function addNotification(notification: any): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(notification);
    tx.oncomplete = async () => {
      try {
        const all = await getNotifications();
        if (all.length > MAX_NOTIFICATIONS) {
          const toDelete = all.slice(MAX_NOTIFICATIONS);
          const deleteTx = db.transaction(STORE_NAME, "readwrite");
          const deleteStore = deleteTx.objectStore(STORE_NAME);
          toDelete.forEach((n) => deleteStore.delete(n.id));
        }
      } catch {
        // ignore cleanup errors
      }
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function markAsRead(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const notification = getReq.result;
      if (notification) {
        notification.read = true;
        store.put(notification);
      }
      resolve();
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function markAllAsRead(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getAllReq = store.getAll();
    getAllReq.onsuccess = () => {
      const all = getAllReq.result || [];
      all.forEach((n) => {
        n.read = true;
        store.put(n);
      });
      resolve();
    };
    getAllReq.onerror = () => reject(getAllReq.error);
  });
}

export async function clearOld(olderThanDays: number = 30): Promise<void> {
  const db = await openDB();
  const cutoff = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("timestamp");
    const range = IDBKeyRange.upperBound(cutoff);
    const request = index.openCursor(range);
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result as
        | IDBCursorWithValue
        | null;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
    request.onerror = () => reject(request.error);
  });
}
