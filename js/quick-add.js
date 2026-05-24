import { saveFoodItem } from "./db.js";
import { validateDate, validateName } from "./validate.js";

const modal = document.getElementById("quick-add-modal");
const backdrop = document.getElementById("modal-backdrop");
const closeBtn = document.getElementById("modal-close");
const form = document.getElementById("quick-add-form");
const nameInput = document.getElementById("quick-name");
const expiryDateInput = document.getElementById("quick-expiry-date");
const errorBanner = document.getElementById("quick-form-error");
const detailLink = document.getElementById("quick-detail-link");
const fabBtn = document.getElementById("fab-open-modal");
const emptyQuickBtn = document.getElementById("empty-quick-add");

/** @type {HTMLElement | null} */
let previouslyFocused = null;

function updateDetailLink() {
  const name = nameInput.value.trim();
  detailLink.href = name
    ? `add.html?name=${encodeURIComponent(name)}`
    : "add.html";
}

function showError(message) {
  errorBanner.textContent = message;
  errorBanner.hidden = false;
}

function clearError() {
  errorBanner.hidden = true;
  errorBanner.textContent = "";
}

function openModal() {
  previouslyFocused = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  updateDetailLink();
  nameInput.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  form.reset();
  clearError();
  if (previouslyFocused instanceof HTMLElement) {
    previouslyFocused.focus();
  }
}

/** @param {SubmitEvent} event */
async function handleSubmit(event) {
  event.preventDefault();
  clearError();

  const nameResult = validateName(nameInput.value);
  if (!nameResult.ok) {
    showError(nameResult.message);
    nameInput.focus();
    return;
  }

  const dateResult = validateDate(expiryDateInput.value);
  if (!dateResult.ok) {
    showError(dateResult.message);
    expiryDateInput.focus();
    return;
  }

  const expiryType =
    /** @type {HTMLInputElement | undefined} */ (
      form.querySelector('input[name="expiry-type"]:checked')
    )?.value ?? "bestBefore";

  const item = {
    id: crypto.randomUUID(),
    name: nameResult.value,
    quantity: null,
    unit: null,
    bestBefore: expiryType === "bestBefore" ? dateResult.value : null,
    useBy: expiryType === "useBy" ? dateResult.value : null,
    storage: null,
    purchaseLocation: null,
    purchaseAmount: null,
    memo: null,
    createdAt: new Date().toISOString(),
  };

  try {
    await saveFoodItem(item);
    closeModal();
    window.location.reload();
  } catch {
    showError("保存できませんでした。もう一度お試しください。");
  }
}

fabBtn.addEventListener("click", openModal);
emptyQuickBtn?.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);
nameInput.addEventListener("input", updateDetailLink);
form.addEventListener("submit", handleSubmit);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeModal();
  }
});

export { openModal };
