/** @type {Record<string, string>} */
export const UNIT_LABELS = {
  ml: "ml",
  l: "L",
  g: "g",
  kg: "kg",
  piece: "個",
  stick: "本",
  pack: "パック",
  bag: "袋",
};

/** @type {Record<string, string>} */
export const STORAGE_LABELS = {
  fridge: "冷蔵",
  freezer: "冷凍",
  vegetable: "野菜室",
  other: "その他",
};

export const DB_NAME = "fridge-memo";
export const DB_VERSION = 1;
export const STORE_NAME = "foodItems";
