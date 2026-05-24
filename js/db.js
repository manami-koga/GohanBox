import { DB_NAME, DB_VERSION, STORE_NAME } from "./constants.js";

/**
 * @typedef {Object} FoodItem
 * @property {string} id
 * @property {string} name
 * @property {number | null} [quantity]
 * @property {string | null} [unit]
 * @property {string | null} [bestBefore]
 * @property {string | null} [useBy]
 * @property {string | null} [storage]
 * @property {string | null} [purchaseLocation]
 * @property {number | null} [purchaseAmount]
 * @property {string | null} [memo]
 * @property {string} createdAt
 */

/** @returns {Promise<IDBDatabase>} */
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error ?? new Error("データベースを開けませんでした"));
    };

    request.onupgradeneeded = (event) => {
      const db = /** @type {IDBOpenDBRequest} */ (event.target).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

/** @param {FoodItem} item */
export async function saveFoodItem(item) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(item);

    request.onerror = () => {
      reject(request.error ?? new Error("食材の保存に失敗しました"));
    };

    request.onsuccess = () => {
      resolve();
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/** @returns {Promise<FoodItem[]>} */
export async function getAllFoodItems() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => {
      reject(request.error ?? new Error("食材の読み込みに失敗しました"));
    };

    request.onsuccess = () => {
      resolve(/** @type {FoodItem[]} */ (request.result ?? []));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/** @param {FoodItem[]} items */
export function sortFoodItemsByName(items) {
  return [...items].sort((a, b) => {
    const byName = a.name.localeCompare(b.name, "ja");
    if (byName !== 0) {
      return byName;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
