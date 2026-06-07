import { useState } from "react";
import { Link } from "react-router-dom";
import { saveFoodItem } from "../lib/db";
import { validateDate, validateName } from "../lib/validate";
import { Modal } from "./Modal";

interface QuickAddModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function QuickAddModal({ open, onClose, onSaved }: QuickAddModalProps) {
  const [name, setName] = useState("");
  const [expiryType, setExpiryType] = useState<"bestBefore" | "useBy">(
    "bestBefore",
  );
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setExpiryType("bestBefore");
    setExpiryDate("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const nameResult = validateName(name);
    if (!nameResult.ok) {
      setError(nameResult.message);
      return;
    }

    const dateResult = validateDate(expiryDate);
    if (!dateResult.ok) {
      setError(dateResult.message);
      return;
    }

    try {
      await saveFoodItem({
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
      });
      reset();
      onSaved();
      onClose();
    } catch {
      setError("保存できませんでした。もう一度お試しください。");
    }
  };

  const detailLink = name.trim()
    ? `/add?name=${encodeURIComponent(name.trim())}`
    : "/add";

  return (
    <Modal
      open={open}
      title="食材を追加（かんたん）"
      titleId="quick-add-title"
      onClose={handleClose}
    >
      <form className="form form--modal" onSubmit={handleSubmit} noValidate>
        {error && (
          <p className="form-banner" role="alert">
            {error}
          </p>
        )}

        <div className="field">
          <label className="field__label" htmlFor="quick-name">
            食材名 <span className="field__required">*</span>
          </label>
          <input
            className="field__input"
            type="text"
            id="quick-name"
            maxLength={100}
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <fieldset className="field field--fieldset">
          <legend className="field__label">期限の種類（任意）</legend>
          <div className="field__radios">
            <label className="field__radio">
              <input
                type="radio"
                name="expiry-type"
                value="bestBefore"
                checked={expiryType === "bestBefore"}
                onChange={() => setExpiryType("bestBefore")}
              />
              賞味期限
            </label>
            <label className="field__radio">
              <input
                type="radio"
                name="expiry-type"
                value="useBy"
                checked={expiryType === "useBy"}
                onChange={() => setExpiryType("useBy")}
              />
              消費期限
            </label>
          </div>
        </fieldset>

        <div className="field">
          <label className="field__label" htmlFor="quick-expiry-date">
            期限
          </label>
          <input
            className="field__input"
            type="date"
            id="quick-expiry-date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <div className="form__actions form__actions--modal">
          <button type="submit" className="form__submit">
            保存
          </button>
          <Link className="form__link" to={detailLink} onClick={handleClose}>
            詳細を入力して追加
          </Link>
        </div>
      </form>
    </Modal>
  );
}
