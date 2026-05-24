import { STORAGE_LABELS, UNIT_LABELS } from "./constants.js";
import { saveFoodItem } from "./db.js";
import {
  validateDate,
  validateName,
  validatePurchaseAmount,
  validatePurchaseLocation,
  validateQuantity,
} from "./validate.js";

const form = document.getElementById("add-form");
const errorBanner = document.getElementById("form-error");
const nameInput = document.getElementById("name");
const quantityInput = document.getElementById("quantity");
const unitSelect = document.getElementById("unit");
const bestBeforeInput = document.getElementById("best-before");
const useByInput = document.getElementById("use-by");
const bestBeforeField = document.getElementById("best-before-field");
const useByField = document.getElementById("use-by-field");
const storageSelect = document.getElementById("storage");
const purchaseLocationInput = document.getElementById("purchase-location");
const purchaseAmountInput = document.getElementById("purchase-amount");
const memoInput = document.getElementById("memo");

function populateSelects() {
  unitSelect.appendChild(createOption("", "—（単位なし）"));
  for (const [value, label] of Object.entries(UNIT_LABELS)) {
    unitSelect.appendChild(createOption(value, label));
  }

  storageSelect.appendChild(createOption("", "—（未選択）"));
  for (const [value, label] of Object.entries(STORAGE_LABELS)) {
    storageSelect.appendChild(createOption(value, label));
  }
}

/** @param {string} value @param {string} label */
function createOption(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function prefillFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  if (name) {
    nameInput.value = name;
  }
}

/** @param {HTMLElement} fieldEl @param {HTMLInputElement} inputEl @param {boolean} disabled */
function setExpiryFieldDisabled(fieldEl, inputEl, disabled) {
  fieldEl.classList.toggle("field--disabled", disabled);
  inputEl.disabled = disabled;
  if (disabled) {
    inputEl.value = "";
  }
}

function syncExpiryFields() {
  const hasBestBefore = bestBeforeInput.value !== "";
  const hasUseBy = useByInput.value !== "";

  if (hasBestBefore) {
    setExpiryFieldDisabled(useByField, useByInput, true);
    setExpiryFieldDisabled(bestBeforeField, bestBeforeInput, false);
  } else if (hasUseBy) {
    setExpiryFieldDisabled(bestBeforeField, bestBeforeInput, true);
    setExpiryFieldDisabled(useByField, useByInput, false);
  } else {
    setExpiryFieldDisabled(bestBeforeField, bestBeforeInput, false);
    setExpiryFieldDisabled(useByField, useByInput, false);
  }
}

function setupExpiryExclusivity() {
  bestBeforeInput.addEventListener("input", syncExpiryFields);
  bestBeforeInput.addEventListener("change", syncExpiryFields);
  useByInput.addEventListener("input", syncExpiryFields);
  useByInput.addEventListener("change", syncExpiryFields);
  syncExpiryFields();
}

function showError(message) {
  errorBanner.textContent = message;
  errorBanner.hidden = false;
}

function clearError() {
  errorBanner.hidden = true;
  errorBanner.textContent = "";
}

/** @param {string} fieldId @param {string} message */
function setFieldError(fieldId, message) {
  const el = document.getElementById(`${fieldId}-error`);
  if (el) {
    el.textContent = message;
  }
}

function clearFieldErrors() {
  for (const el of form.querySelectorAll(".field__error")) {
    el.textContent = "";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();
  clearFieldErrors();

  const nameResult = validateName(nameInput.value);
  if (!nameResult.ok) {
    setFieldError("name", nameResult.message);
    showError(nameResult.message);
    nameInput.focus();
    return;
  }

  const quantityResult = validateQuantity(quantityInput.value);
  if (!quantityResult.ok) {
    setFieldError("quantity", quantityResult.message);
    showError(quantityResult.message);
    quantityInput.focus();
    return;
  }

  const bestBeforeResult = validateDate(bestBeforeInput.value);
  if (!bestBeforeResult.ok) {
    setFieldError("best-before", bestBeforeResult.message);
    showError(bestBeforeResult.message);
    bestBeforeInput.focus();
    return;
  }

  const useByResult = validateDate(useByInput.value);
  if (!useByResult.ok) {
    setFieldError("use-by", useByResult.message);
    showError(useByResult.message);
    useByInput.focus();
    return;
  }

  const purchaseLocationResult = validatePurchaseLocation(
    purchaseLocationInput.value,
  );
  if (!purchaseLocationResult.ok) {
    setFieldError("purchase-location", purchaseLocationResult.message);
    showError(purchaseLocationResult.message);
    purchaseLocationInput.focus();
    return;
  }

  const purchaseAmountResult = validatePurchaseAmount(
    purchaseAmountInput.value,
  );
  if (!purchaseAmountResult.ok) {
    setFieldError("purchase-amount", purchaseAmountResult.message);
    showError(purchaseAmountResult.message);
    purchaseAmountInput.focus();
    return;
  }

  const unit = unitSelect.value || null;
  const quantity = quantityResult.value;
  if (quantity == null && unit) {
    showError("残量を入力するか、単位を選択しないでください");
    return;
  }

  const item = {
    id: crypto.randomUUID(),
    name: nameResult.value,
    quantity,
    unit: quantity != null ? unit : null,
    bestBefore: bestBeforeResult.value,
    useBy: useByResult.value,
    storage: storageSelect.value || null,
    purchaseLocation: purchaseLocationResult.value,
    purchaseAmount: purchaseAmountResult.value,
    memo: memoInput.value.trim() || null,
    createdAt: new Date().toISOString(),
  };

  try {
    await saveFoodItem(item);
    window.location.href = "index.html";
  } catch {
    showError("保存できませんでした。もう一度お試しください。");
  }
});

populateSelects();
prefillFromQuery();
setupExpiryExclusivity();
