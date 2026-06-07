import { DB_NAME, DB_VERSION, STORE_NAME } from "../constants";
import type { FoodItem } from "../types/food";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error ?? new Error("データベースを開けませんでした"));
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

export async function saveFoodItem(item: FoodItem): Promise<void> {
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

export async function deleteFoodItem(id: string): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => {
      reject(request.error ?? new Error("食材の削除に失敗しました"));
    };

    request.onsuccess = () => {
      resolve();
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

export async function getAllFoodItems(): Promise<FoodItem[]> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => {
      reject(request.error ?? new Error("食材の読み込みに失敗しました"));
    };

    request.onsuccess = () => {
      resolve((request.result as FoodItem[]) ?? []);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

export function sortFoodItemsByName(items: FoodItem[]): FoodItem[] {
  return [...items].sort((a, b) => {
    const byName = a.name.localeCompare(b.name, "ja");
    if (byName !== 0) {
      return byName;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
