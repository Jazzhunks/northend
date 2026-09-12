const DB_NAME = "northend-notifications";
const STORE_NAME = "notifications";
const MAX_NOTIFICATIONS = 100;

function openDB() {
  return new Promise(function (resolve, reject) {
    var request = indexedDB.open(DB_NAME, 1);
    request.onerror = function () {
      reject(request.error);
    };
    request.onsuccess = function () {
      resolve(request.result);
    };
    request.onupgradeneeded = function () {
      var db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        var store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
  });
}

function sortByTimestamp(a, b) {
  return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
}

export async function getNotifications() {
  var db = await openDB();
  return new Promise(function (resolve, reject) {
    var tx = db.transaction(STORE_NAME, "readonly");
    var store = tx.objectStore(STORE_NAME);
    var request = store.getAll();
    request.onsuccess = function () {
      var results = request.result || [];
      results.sort(sortByTimestamp);
      resolve(results);
    };
    request.onerror = function () {
      reject(request.error);
    };
  });
}

export async function addNotification(notification) {
  var db = await openDB();
  return new Promise(function (resolve, reject) {
    var tx = db.transaction(STORE_NAME, "readwrite");
    var store = tx.objectStore(STORE_NAME);
    store.put(notification);
    tx.oncomplete = async function () {
      try {
        var all = await getNotifications();
        if (all.length > MAX_NOTIFICATIONS) {
          var toDelete = all.slice(MAX_NOTIFICATIONS);
          var deleteTx = db.transaction(STORE_NAME, "readwrite");
          var deleteStore = deleteTx.objectStore(STORE_NAME);
          toDelete.forEach(function (n) {
            deleteStore.delete(n.id);
          });
        }
      } catch (e) {
        // ignore cleanup errors
      }
      resolve();
    };
    tx.onerror = function () {
      reject(tx.error);
    };
  });
}

export async function markAsRead(id) {
  var db = await openDB();
  return new Promise(function (resolve, reject) {
    var tx = db.transaction(STORE_NAME, "readwrite");
    var store = tx.objectStore(STORE_NAME);
    var getReq = store.get(id);
    getReq.onsuccess = function () {
      var notification = getReq.result;
      if (notification) {
        notification.read = true;
        store.put(notification);
      }
      resolve();
    };
    getReq.onerror = function () {
      reject(getReq.error);
    };
  });
}

export async function markAllAsRead() {
  var db = await openDB();
  return new Promise(function (resolve, reject) {
    var tx = db.transaction(STORE_NAME, "readwrite");
    var store = tx.objectStore(STORE_NAME);
    var getAllReq = store.getAll();
    getAllReq.onsuccess = function () {
      var all = getAllReq.result || [];
      all.forEach(function (n) {
        n.read = true;
        store.put(n);
      });
      resolve();
    };
    getAllReq.onerror = function () {
      reject(getAllReq.error);
    };
  });
}

export async function clearOld(olderThanDays) {
  if (olderThanDays === void 0) olderThanDays = 30;
  var db = await openDB();
  var cutoff = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
  return new Promise(function (resolve, reject) {
    var tx = db.transaction(STORE_NAME, "readwrite");
    var store = tx.objectStore(STORE_NAME);
    var index = store.index("timestamp");
    var range = IDBKeyRange.upperBound(cutoff);
    var request = index.openCursor(range);
    request.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
    request.onerror = function () {
      reject(request.error);
    };
  });
}
