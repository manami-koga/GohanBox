import type { FoodFormData } from "../types/food";
import {
  validateDate,
  validateName,
  validatePurchaseAmount,
  validatePurchaseLocation,
  validateQuantity,
} from "./validate";

export interface FieldErrors {
  name?: string;
  quantity?: string;
  bestBefore?: string;
  useBy?: string;
  purchaseLocation?: string;
  purchaseAmount?: string;
}

export interface ValidatedFoodForm {
  name: string;
  quantity: number | null;
  unit: string | null;
  bestBefore: string | null;
  useBy: string | null;
  storage: string | null;
  purchaseLocation: string | null;
  purchaseAmount: number | null;
  memo: string | null;
}

export function validateFoodForm(form: FoodFormData):
  | { ok: true; data: ValidatedFoodForm }
  | { ok: false; message: string; fieldErrors: FieldErrors } {
  const fieldErrors: FieldErrors = {};

  const nameResult = validateName(form.name);
  if (!nameResult.ok) {
    fieldErrors.name = nameResult.message;
    return { ok: false, message: nameResult.message, fieldErrors };
  }

  const quantityResult = validateQuantity(form.quantity);
  if (!quantityResult.ok) {
    fieldErrors.quantity = quantityResult.message;
    return { ok: false, message: quantityResult.message, fieldErrors };
  }

  const bestBeforeResult = validateDate(form.bestBefore);
  if (!bestBeforeResult.ok) {
    fieldErrors.bestBefore = bestBeforeResult.message;
    return { ok: false, message: bestBeforeResult.message, fieldErrors };
  }

  const useByResult = validateDate(form.useBy);
  if (!useByResult.ok) {
    fieldErrors.useBy = useByResult.message;
    return { ok: false, message: useByResult.message, fieldErrors };
  }

  const purchaseLocationResult = validatePurchaseLocation(form.purchaseLocation);
  if (!purchaseLocationResult.ok) {
    fieldErrors.purchaseLocation = purchaseLocationResult.message;
    return { ok: false, message: purchaseLocationResult.message, fieldErrors };
  }

  const purchaseAmountResult = validatePurchaseAmount(form.purchaseAmount);
  if (!purchaseAmountResult.ok) {
    fieldErrors.purchaseAmount = purchaseAmountResult.message;
    return { ok: false, message: purchaseAmountResult.message, fieldErrors };
  }

  const unit = form.unit || null;
  const quantity = quantityResult.value;
  if (quantity == null && unit) {
    return {
      ok: false,
      message: "残量を入力するか、単位を選択しないでください",
      fieldErrors,
    };
  }

  return {
    ok: true,
    data: {
      name: nameResult.value,
      quantity,
      unit: quantity != null ? unit : null,
      bestBefore: bestBeforeResult.value,
      useBy: useByResult.value,
      storage: form.storage || null,
      purchaseLocation: purchaseLocationResult.value,
      purchaseAmount: purchaseAmountResult.value,
      memo: form.memo.trim() || null,
    },
  };
}
