import { STORAGE_LABELS, UNIT_LABELS } from "../constants";
import type { FieldErrors } from "../lib/foodForm";
import type { FoodFormData } from "../types/food";

interface FoodFormFieldsProps {
  form: FoodFormData;
  onChange: (form: FoodFormData) => void;
  fieldErrors?: FieldErrors;
  idPrefix?: string;
}

export function FoodFormFields({
  form,
  onChange,
  fieldErrors = {},
  idPrefix = "",
}: FoodFormFieldsProps) {
  const id = (name: string) => (idPrefix ? `${idPrefix}-${name}` : name);

  const update = (patch: Partial<FoodFormData>) => {
    onChange({ ...form, ...patch });
  };

  const handleBestBeforeChange = (value: string) => {
    if (value) {
      onChange({ ...form, bestBefore: value, useBy: "" });
    } else {
      onChange({ ...form, bestBefore: value });
    }
  };

  const handleUseByChange = (value: string) => {
    if (value) {
      onChange({ ...form, useBy: value, bestBefore: "" });
    } else {
      onChange({ ...form, useBy: value });
    }
  };

  const bestBeforeDisabled = form.useBy !== "";
  const useByDisabled = form.bestBefore !== "";

  return (
    <>
      <div className="field">
        <label className="field__label" htmlFor={id("name")}>
          食材名 <span className="field__required">*</span>
        </label>
        <input
          className="field__input"
          type="text"
          id={id("name")}
          maxLength={100}
          autoComplete="off"
          value={form.name}
          onChange={(e) => update({ name: e.target.value })}
        />
        {fieldErrors.name && (
          <p className="field__error" aria-live="polite">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div className="field field--row">
        <div className="field__grow">
          <label className="field__label" htmlFor={id("quantity")}>
            残量
          </label>
          <input
            className="field__input"
            type="number"
            id={id("quantity")}
            min={0}
            step="any"
            inputMode="decimal"
            value={form.quantity}
            onChange={(e) => update({ quantity: e.target.value })}
          />
          {fieldErrors.quantity && (
            <p className="field__error" aria-live="polite">
              {fieldErrors.quantity}
            </p>
          )}
        </div>
        <div className="field__unit">
          <label className="field__label" htmlFor={id("unit")}>
            単位
          </label>
          <select
            className="field__input"
            id={id("unit")}
            value={form.unit}
            onChange={(e) => update({ unit: e.target.value })}
          >
            <option value="">—（単位なし）</option>
            {Object.entries(UNIT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="field__hint">
        賞味期限と消費期限は、どちらか一方のみ入力できます。
      </p>

      <div className={`field${bestBeforeDisabled ? " field--disabled" : ""}`}>
        <label className="field__label" htmlFor={id("best-before")}>
          賞味期限
        </label>
        <input
          className="field__input"
          type="date"
          id={id("best-before")}
          value={form.bestBefore}
          disabled={bestBeforeDisabled}
          onChange={(e) => handleBestBeforeChange(e.target.value)}
        />
        {fieldErrors.bestBefore && (
          <p className="field__error" aria-live="polite">
            {fieldErrors.bestBefore}
          </p>
        )}
      </div>

      <div className={`field${useByDisabled ? " field--disabled" : ""}`}>
        <label className="field__label" htmlFor={id("use-by")}>
          消費期限
        </label>
        <input
          className="field__input"
          type="date"
          id={id("use-by")}
          value={form.useBy}
          disabled={useByDisabled}
          onChange={(e) => handleUseByChange(e.target.value)}
        />
        {fieldErrors.useBy && (
          <p className="field__error" aria-live="polite">
            {fieldErrors.useBy}
          </p>
        )}
      </div>

      <div className="field">
        <label className="field__label" htmlFor={id("storage")}>
          保管場所
        </label>
        <select
          className="field__input"
          id={id("storage")}
          value={form.storage}
          onChange={(e) => update({ storage: e.target.value })}
        >
          <option value="">—（未選択）</option>
          {Object.entries(STORAGE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field__label" htmlFor={id("purchase-location")}>
          購入場所
        </label>
        <input
          className="field__input"
          type="text"
          id={id("purchase-location")}
          maxLength={100}
          placeholder="例：イオン、業務スーパー"
          autoComplete="off"
          value={form.purchaseLocation}
          onChange={(e) => update({ purchaseLocation: e.target.value })}
        />
        {fieldErrors.purchaseLocation && (
          <p className="field__error" aria-live="polite">
            {fieldErrors.purchaseLocation}
          </p>
        )}
      </div>

      <div className="field">
        <label className="field__label" htmlFor={id("purchase-amount")}>
          購入金額
        </label>
        <div className="field__input-suffix">
          <input
            className="field__input"
            type="number"
            id={id("purchase-amount")}
            min={0}
            step={1}
            inputMode="numeric"
            placeholder="例：298"
            value={form.purchaseAmount}
            onChange={(e) => update({ purchaseAmount: e.target.value })}
          />
          <span className="field__suffix" aria-hidden="true">
            円
          </span>
        </div>
        {fieldErrors.purchaseAmount && (
          <p className="field__error" aria-live="polite">
            {fieldErrors.purchaseAmount}
          </p>
        )}
      </div>

      <div className="field">
        <label className="field__label" htmlFor={id("memo")}>
          メモ
        </label>
        <textarea
          className="field__input field__textarea"
          id={id("memo")}
          rows={3}
          value={form.memo}
          onChange={(e) => update({ memo: e.target.value })}
        />
      </div>
    </>
  );
}
