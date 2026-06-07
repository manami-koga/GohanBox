import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FoodFormFields } from "../components/FoodFormFields";
import { Header } from "../components/Header";
import { saveFoodItem } from "../lib/db";
import { validateFoodForm, type FieldErrors } from "../lib/foodForm";
import type { FoodFormData } from "../types/food";
import { emptyFormData } from "../utils/format";

export function AddPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<FoodFormData>(() => ({
    ...emptyFormData,
    name: searchParams.get("name") ?? "",
  }));
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
        id: crypto.randomUUID(),
        ...result.data,
        createdAt: new Date().toISOString(),
      });
      navigate("/");
    } catch {
      setError("保存できませんでした。もう一度お試しください。");
    }
  };

  return (
    <>
      <Header title="食材を追加" backTo="/" />

      <main className="main main--form">
        {error && (
          <p className="form-banner" role="alert">
            {error}
          </p>
        )}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <FoodFormFields
            form={form}
            onChange={setForm}
            fieldErrors={fieldErrors}
          />
          <button type="submit" className="form__submit">
            保存
          </button>
        </form>
      </main>
    </>
  );
}
