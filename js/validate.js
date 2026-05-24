/** @param {string} value */
export function validateName(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: false, message: "食材名を入力してください" };
  }
  if (trimmed.length > 100) {
    return { ok: false, message: "食材名は100文字以内で入力してください" };
  }
  return { ok: true, value: trimmed };
}

/** @param {string} value */
export function validateQuantity(value) {
  if (!value.trim()) {
    return { ok: true, value: null };
  }
  const num = Number(value);
  if (Number.isNaN(num) || num <= 0) {
    return { ok: false, message: "残量は0より大きい数値にしてください" };
  }
  return { ok: true, value: num };
}

/** @param {string} value */
export function validateDate(value) {
  if (!value) {
    return { ok: true, value: null };
  }
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, message: "日付の形式が正しくありません" };
  }
  return { ok: true, value };
}

/** @param {string} value */
export function validatePurchaseAmount(value) {
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

/** @param {string} value */
export function validatePurchaseLocation(value) {
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

/** @param {string | null} bestBefore @param {string | null} useBy */
export function validateDateOrder(bestBefore, useBy) {
  if (!bestBefore || !useBy) {
    return { ok: true };
  }
  if (useBy < bestBefore) {
    return {
      ok: false,
      message: "消費期限は賞味期限以降の日付を指定してください",
    };
  }
  return { ok: true };
}
