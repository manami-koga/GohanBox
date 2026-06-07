import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { EditModal } from "../components/EditModal";
import { Fab } from "../components/Fab";
import { FoodItemCard } from "../components/FoodItemCard";
import { Header } from "../components/Header";
import { QuickAddModal } from "../components/QuickAddModal";
import {
  deleteFoodItem,
  getAllFoodItems,
  sortFoodItemsByName,
} from "../lib/db";
import { seedDemoFoodItems } from "../lib/seed";
import type { FoodItem } from "../types/food";

export function ListPage() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<FoodItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  const loadItems = useCallback(async () => {
    try {
      if (searchParams.get("seed") === "1") {
        const existing = await getAllFoodItems();
        if (existing.length === 0) {
          await seedDemoFoodItems();
        }
      }
      const data = sortFoodItemsByName(await getAllFoodItems());
      setItems(data);
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }, [searchParams]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleDelete = async (item: FoodItem) => {
    const confirmed = window.confirm(
      `「${item.name}」を削除しますか？\nこの操作は取り消せません。`,
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteFoodItem(item.id);
      await loadItems();
    } catch {
      window.alert("削除できませんでした。もう一度お試しください。");
    }
  };

  return (
    <>
      <Header title="食材一覧" />

      <main className="main">
        {status === "loading" && (
          <section className="empty-state">
            <p className="empty-state__message">読み込み中…</p>
          </section>
        )}

        {status === "error" && (
          <section className="error-state">
            <p className="error-state__message">食材を読み込めませんでした</p>
            <button
              type="button"
              className="error-state__retry"
              onClick={loadItems}
            >
              再読み込み
            </button>
          </section>
        )}

        {status === "ok" && items.length > 0 && (
          <ul className="food-list">
            {items.map((item) => (
              <FoodItemCard
                key={item.id}
                item={item}
                onEdit={setEditingItem}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}

        {status === "ok" && items.length === 0 && (
          <section className="empty-state">
            <p className="empty-state__message">食材がまだありません</p>
            <div className="empty-state__actions">
              <button
                type="button"
                className="empty-state__action"
                onClick={() => setQuickAddOpen(true)}
              >
                かんたん追加
              </button>
              <Link
                className="empty-state__action empty-state__action--secondary"
                to="/add"
              >
                詳細を入力して追加
              </Link>
            </div>
          </section>
        )}
      </main>

      <Fab onClick={() => setQuickAddOpen(true)} />

      <QuickAddModal
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSaved={loadItems}
      />

      <EditModal
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSaved={loadItems}
      />
    </>
  );
}
