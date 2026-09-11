"use client";

import { useEffect, useId, useState } from "react";
import { createWeightLog, listWeightLogs } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { COPY } from "@/lib/copy";
import { fromDateInput, toDateInput } from "@/lib/dates";
import type { WeightLog } from "@/lib/types";
import { WeightHistory } from "./CheckInHistory";
import { Button, Field, TextInput } from "./ui";

export function WeightCheckInForm() {
  const { session } = useAuth();
  const formId = useId();
  const [pesoKg, setPesoKg] = useState("");
  const [fecha, setFecha] = useState(() => toDateInput(new Date()));
  const [history, setHistory] = useState<WeightLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = session?.accessToken ?? null;

  useEffect(() => {
    let cancelled = false;
    listWeightLogs(token).then((rows) => {
      if (!cancelled) setHistory(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    const parsed = Number(pesoKg.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 500) {
      setError("El peso debe estar entre 1 y 500 kg.");
      return;
    }

    setSaving(true);
    try {
      const row = await createWeightLog(token, {
        pesoKg: Math.round(parsed * 100) / 100,
        loggedAt: fromDateInput(fecha),
      });
      setHistory((current) => [row, ...current.filter((item) => item.id !== row.id)]);
      setSaved(true);
    } catch {
      setError(COPY.genericError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" aria-busy={saving}>
      <Field label={COPY.weightKg} hint={COPY.weightHint} htmlFor={`${formId}-kg`}>
        <TextInput
          id={`${formId}-kg`}
          type="number"
          inputMode="decimal"
          min={1}
          max={500}
          step={0.1}
          value={pesoKg}
          onChange={(event) => setPesoKg(event.target.value)}
          required
        />
      </Field>

      <Field label={COPY.weightWhen} htmlFor={`${formId}-fecha`}>
        <TextInput
          id={`${formId}-fecha`}
          type="date"
          value={fecha}
          onChange={(event) => setFecha(event.target.value)}
          required
        />
      </Field>

      {error ? (
        <p className="rounded-2xl bg-alert-subtle px-4 py-3 text-base text-alert" role="alert">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="rounded-2xl bg-accent-subtle px-4 py-3 text-base text-ink" role="status">
          {COPY.savedCheckIn}
        </p>
      ) : null}

      <Button type="submit" disabled={saving}>
        {saving ? COPY.savingCheckIn : COPY.saveCheckIn}
      </Button>

      <WeightHistory rows={history} />
    </form>
  );
}
