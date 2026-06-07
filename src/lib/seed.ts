import { saveFoodItem } from "./db";

export async function seedDemoFoodItems(): Promise<void> {
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
      purchaseLocation: null,
      purchaseAmount: null,
      memo: null,
      createdAt: new Date().toISOString(),
    },
  ];

  for (const item of items) {
    await saveFoodItem(item);
  }
}
