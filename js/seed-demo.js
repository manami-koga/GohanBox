/**
 * 開発用: 一覧の表示確認用サンプルデータ
 * ブラウザのコンソールで import("./seed-demo.js").then(m => m.seedDemoFoodItems())
 * または index.html?seed=1 で自動投入（データが0件のときのみ）
 */
import { saveFoodItem } from "./db.js";

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
      purchaseLocation: "イオン",
      purchaseAmount: 198,
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

  for (const item of items) {
    await saveFoodItem(item);
  }
}
