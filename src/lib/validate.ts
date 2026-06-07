import type { ValidationResult } from "../types/food";

export function validateName(value: string): ValidationResult<string> {
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: false, message: "食材名を入力してください" };
  }
  if (trimmed.length > 100) {
    return { ok: false, message: "食材名は100文字以内で入力してください" };
  }
  return { ok: true, value: trimmed };
}

export function validateQuantity(
  value: string,
): ValidationResult<number | null> {
  if (!value.trim()) {
    return { ok: true, value: null };
  }
  const num = Number(value);
  if (Number.isNaN(num) || num <= 0) {
    return { ok: false, message: "残量は0より大きい数値にしてください" };
  }
  return { ok: true, value: num };
}

export function validateDate(value: string): ValidationResult<string | null> {
  if (!value) {
    return { ok: true, value: null };
  }
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, message: "日付の形式が正しくありません" };
  }
  return { ok: true, value };
}

export function validatePurchaseAmount(
  value: string,
): ValidationResult<number | null> {
  if (!value.trim()) {
    return { ok: true, value: null };
  }
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) {
    return { ok: false, message: "購入金額は0以上の数値にしてください" };
  }
  if (!Number.isInteger(num)) {
    return { ok: false, message: "購入金額は整数で入力してください" };
  }
  if (num > 9999999) {
    return { ok: false, message: "購入金額が大きすぎます" };
  }
  return { ok: true, value: num };
}

export function validatePurchaseLocation(
  value: string,
): ValidationResult<string | null> {
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: true, value: null };
  }
  if (trimmed.length > 100) {
    return {
      ok: false,
      message: "購入場所は100文字以内で入力してください",
    };
  }
  return { ok: true, value: trimmed };
}
