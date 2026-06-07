import { UNIT_LABELS } from "../constants";
import type { FoodItem } from "../types/food";

function formatShortDate(dateStr: string | null | undefined): string {
  if (!dateStr) {
    return "";
  }
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatQuantity(item: FoodItem): string {
  if (item.quantity == null || item.quantity <= 0) {
    return "";
  }
  const unitLabel = item.unit ? (UNIT_LABELS[item.unit] ?? item.unit) : "";
  return unitLabel
    ? `残り ${item.quantity}${unitLabel}`
    : `残り ${item.quantity}`;
}

export function formatFoodMeta(item: FoodItem): string {
  const parts: string[] = [];

  const quantityText = formatQuantity(item);
  if (quantityText) {
    parts.push(quantityText);
  }

  const bestBefore = formatShortDate(item.bestBefore);
  if (bestBefore) {
    parts.push(`賞味 ${bestBefore}`);
  }

  const useBy = formatShortDate(item.useBy);
  if (useBy) {
    parts.push(`消費 ${useBy}`);
  }

  if (item.purchaseLocation) {
    parts.push(`購入 ${item.purchaseLocation}`);
  }

  if (item.purchaseAmount != null && item.purchaseAmount >= 0) {
    parts.push(`¥${item.purchaseAmount.toLocaleString("ja-JP")}`);
  }

  return parts.join(" · ");
}

export function foodItemToFormData(item: FoodItem) {
  return {
    name: item.name,
    quantity: item.quantity != null ? String(item.quantity) : "",
    unit: item.unit ?? "",
    bestBefore: item.bestBefore ?? "",
    useBy: item.useBy ?? "",
    storage: item.storage ?? "",
    purchaseLocation: item.purchaseLocation ?? "",
    purchaseAmount:
      item.purchaseAmount != null ? String(item.purchaseAmount) : "",
    memo: item.memo ?? "",
  };
}

export const emptyFormData = {
  name: "",
  quantity: "",
  unit: "",
  bestBefore: "",
  useBy: "",
  storage: "",
  purchaseLocation: "",
  purchaseAmount: "",
  memo: "",
};
