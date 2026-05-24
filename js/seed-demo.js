/**
 * 開発用: 一覧の表示確認用サンプルデータ
 * ブラウザのコンソールで import("./seed-demo.js").then(m => m.seedDemoFoodItems())
 * または index.html?seed=1 で自動投入（データが0件のときのみ）
 */
import { DB_NAME, DB_VERSION, STORE_NAME } from "./constants.js";

/** @returns {Promise<void>} */
export async function seedDemoFoodItems() {
  const items = [
    {
      id: crypto.randomUUID(),
      name: "牛乳",
      quantity: 800,
      unit: "ml",
      bestBefore: "2026-05-28",
      useBy: null,
      storage: "fridge",
      memo: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "にんじん",
      quantity: 3,
      unit: "stick",
      bestBefore: null,
      useBy: "2026-05-30",
      storage: "vegetable",
      memo: null,
      createdAt: new Date().toISOString(),
    },
  ];

  await new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = /** @type {IDBOpenDBRequest} */ (event.target).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      for (const item of items) {
        store.put(item);
      }
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
}
