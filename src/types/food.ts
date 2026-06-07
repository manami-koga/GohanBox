export interface FoodItem {
  id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  bestBefore: string | null;
  useBy: string | null;
  storage: string | null;
  purchaseLocation: string | null;
  purchaseAmount: number | null;
  memo: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface FoodFormData {
  name: string;
  quantity: string;
  unit: string;
  bestBefore: string;
  useBy: string;
  storage: string;
  purchaseLocation: string;
  purchaseAmount: string;
  memo: string;
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };
