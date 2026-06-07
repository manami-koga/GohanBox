import { formatFoodMeta } from "../utils/format";
import type { FoodItem } from "../types/food";

interface FoodItemCardProps {
  item: FoodItem;
  onEdit: (item: FoodItem) => void;
  onDelete: (item: FoodItem) => void;
}

export function FoodItemCard({ item, onEdit, onDelete }: FoodItemCardProps) {
  const meta = formatFoodMeta(item);

  return (
    <li className="food-item">
      <div className="food-item__header">
        <p className="food-item__name">{item.name}</p>
        <div className="food-item__actions">
          <button
            type="button"
            className="food-item__edit"
            aria-label={`${item.name}を編集`}
            onClick={() => onEdit(item)}
          >
            編集
          </button>
          <button
            type="button"
            className="food-item__delete"
            aria-label={`${item.name}を削除`}
            onClick={() => onDelete(item)}
          >
            削除
          </button>
        </div>
      </div>
      {meta && <p className="food-item__meta">{meta}</p>}
    </li>
  );
}
