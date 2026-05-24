import { UNIT_LABELS } from "./constants.js";
import {
  deleteFoodItem,
  getAllFoodItems,
  sortFoodItemsByName,
} from "./db.js";

const listEl = document.getElementById("food-list");
const emptyEl = document.getElementById("empty-state");
const errorEl = document.getElementById("error-state");
const retryBtn = document.getElementById("retry-btn");

/** @param {string | null | undefined} dateStr */
function formatShortDate(dateStr) {
  if (!dateStr) {
    return "";
  }
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/** @param {import("./db.js").FoodItem} item */
function formatQuantity(item) {
  if (item.quantity == null || item.quantity <= 0) {
    return "";
  }
  const unitLabel = item.unit ? UNIT_LABELS[item.unit] ?? item.unit : "";
  return unitLabel ? `残り ${item.quantity}${unitLabel}` : `残り ${item.quantity}`;
}

/** @param {import("./db.js").FoodItem} item */
function formatMeta(item) {
  const parts = [];

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
    parts.push(
      `¥${item.purchaseAmount.toLocaleString("ja-JP")}`,
    );
  }

  return parts.join(" · ");
}

/** @param {import("./db.js").FoodItem} item */
function createListItem(item) {
  const li = document.createElement("li");
  li.className = "food-item";

  const header = document.createElement("div");
  header.className = "food-item__header";

  const nameEl = document.createElement("p");
  nameEl.className = "food-item__name";
  nameEl.textContent = item.name;

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "food-item__delete";
  deleteBtn.textContent = "削除";
  deleteBtn.setAttribute("aria-label", `${item.name}を削除`);
  deleteBtn.addEventListener("click", () => {
    handleDelete(item);
  });

  header.appendChild(nameEl);
  header.appendChild(deleteBtn);
  li.appendChild(header);

  const meta = formatMeta(item);
  if (meta) {
    const metaEl = document.createElement("p");
    metaEl.className = "food-item__meta";
    metaEl.textContent = meta;
    li.appendChild(metaEl);
  }

  return li;
}

/** @param {import("./db.js").FoodItem} item */
async function handleDelete(item) {
  const confirmed = window.confirm(
    `「${item.name}」を削除しますか？\nこの操作は取り消せません。`,
  );
  if (!confirmed) {
    return;
  }

  try {
    await deleteFoodItem(item.id);
    await loadAndRender();
  } catch {
    window.alert("削除できませんでした。もう一度お試しください。");
  }
}

function showList() {
  listEl.hidden = false;
  emptyEl.hidden = true;
  errorEl.hidden = true;
}

function showEmpty() {
  listEl.hidden = true;
  emptyEl.hidden = false;
  errorEl.hidden = true;
}

function showError() {
  listEl.hidden = true;
  emptyEl.hidden = true;
  errorEl.hidden = false;
}

/** @param {import("./db.js").FoodItem[]} items */
function renderList(items) {
  listEl.replaceChildren();

  if (items.length === 0) {
    showEmpty();
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const item of items) {
    fragment.appendChild(createListItem(item));
  }
  listEl.appendChild(fragment);
  showList();
}

async function maybeSeedDemoData() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("seed") !== "1") {
    return;
  }
  const existing = await getAllFoodItems();
  if (existing.length > 0) {
    return;
  }
  const { seedDemoFoodItems } = await import("./seed-demo.js");
  await seedDemoFoodItems();
}

async function loadAndRender() {
  try {
    await maybeSeedDemoData();
    const items = sortFoodItemsByName(await getAllFoodItems());
    renderList(items);
  } catch {
    showError();
  }
}

retryBtn.addEventListener("click", () => {
  loadAndRender();
});

loadAndRender();
