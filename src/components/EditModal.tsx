import { useEffect, useRef, useState } from "react";
import { saveFoodItem } from "../lib/db";
import { validateFoodForm, type FieldErrors } from "../lib/foodForm";
import type { FoodFormData, FoodItem } from "../types/food";
import { emptyFormData, foodItemToFormData } from "../utils/format";
import { FoodFormFields } from "./FoodFormFields";
import { Modal } from "./Modal";

interface EditModalProps {
  item: FoodItem | null;
  onClose: () => void;
  onSaved: () => void;
}

function snapshot(form: FoodFormData): string {
  return JSON.stringify(form);
}

export function EditModal({ item, onClose, onSaved }: EditModalProps) {
  const [form, setForm] = useState<FoodFormData>(emptyFormData);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const initialSnapshot = useRef("");
  const historyPushed = useRef(false);
  const formRef = useRef(form);
  formRef.current = form;

  const open = item !== null;

  useEffect(() => {
    if (!item) {
      return;
    }
    const data = foodItemToFormData(item);
    setForm(data);
    initialSnapshot.current = snapshot(data);
    setError("");
    setFieldErrors({});
    history.pushState({ editModal: true }, "");
    historyPushed.current = true;
  }, [item]);

  const isDirty = () =>
    snapshot(formRef.current) !== initialSnapshot.current;

  const confirmDiscard = () => {
    if (!isDirty()) {
      return true;
    }
    return window.confirm(
      "変更内容が保存されていません。閉じてもよろしいですか？",
    );
  };

  const closeWithoutConfirm = () => {
    if (historyPushed.current) {
      historyPushed.current = false;
      history.back();
    }
    setForm(emptyFormData);
    setError("");
    setFieldErrors({});
    onClose();
  };

  const handleClose = () => {
    if (!confirmDiscard()) {
      return;
    }
    closeWithoutConfirm();
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePopState = () => {
      if (!historyPushed.current) {
        return;
      }
      historyPushed.current = false;
      if (!confirmDiscard()) {
        history.pushState({ editModal: true }, "");
        historyPushed.current = true;
        return;
      }
      setForm(emptyFormData);
      setError("");
      setFieldErrors({});
      onClose();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [open, onClose]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!item) {
      return;
    }

    setError("");
    setFieldErrors({});

    const result = validateFoodForm(form);
    if (!result.ok) {
      setError(result.message);
      setFieldErrors(result.fieldErrors);
      return;
    }

    try {
      await saveFoodItem({
        id: item.id,
        ...result.data,
        createdAt: item.createdAt,
        updatedAt: new Date().toISOString(),
      });
      if (historyPushed.current) {
        historyPushed.current = false;
        history.back();
      }
      setForm(emptyFormData);
      onClose();
      onSaved();
    } catch {
      setError("保存できませんでした。もう一度お試しください。");
    }
  };

  return (
    <Modal
      open={open}
      title="食材を編集"
      titleId="edit-modal-title"
      onClose={handleClose}
      className="modal__dialog--edit"
    >
      <form className="form form--modal" onSubmit={handleSubmit} noValidate>
        {error && (
          <p className="form-banner" role="alert">
            {error}
          </p>
        )}

        <FoodFormFields
          form={form}
          onChange={setForm}
          fieldErrors={fieldErrors}
          idPrefix="edit"
        />

        <button type="submit" className="form__submit">
          保存
        </button>
      </form>
    </Modal>
  );
}
