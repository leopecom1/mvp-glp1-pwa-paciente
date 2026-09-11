"use client";

import { useEffect, useId, useState } from "react";
import { createSymptomLog, listSymptomLogs } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { COPY } from "@/lib/copy";
import type { GiScaleKey, SymptomLog } from "@/lib/types";
import { GI_SCALE_KEYS } from "@/lib/types";
import { SymptomHistory } from "./CheckInHistory";
import { ScaleField } from "./ScaleField";
import { Button } from "./ui";

const EMPTY_SCALES: Record<GiScaleKey, number> = {
  nauseas: 0,
  vomito: 0,
  diarrea: 0,
  estrenimiento: 0,
  dolorAbdominal: 0,
};

const SEVERE = 8;

export function SymptomCheckInForm() {
  const { session } = useAuth();
  const formId = useId();
  const [scales, setScales] = useState(EMPTY_SCALES);
  const [history, setHistory] = useState<SymptomLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = session?.accessToken ?? null;
  const severe = GI_SCALE_KEYS.some((key) => scales[key] >= SEVERE);

  useEffect(() => {
    let cancelled = false;
    listSymptomLogs(token).then((rows) => {
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
    setSaving(true);
    try {
      const row = await createSymptomLog(token, {
        nauseas: scales.nauseas,
        vomito: scales.vomito,
        diarrea: scales.diarrea,
        estrenimiento: scales.estrenimiento,
        dolorAbdominal: scales.dolorAbdominal,
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
      <p className="text-base text-muted">{COPY.giLead}</p>

      {GI_SCALE_KEYS.map((key) => (
        <ScaleField
          key={key}
          id={`${formId}-${key}`}
          label={COPY.giScales[key]}
          hint={COPY.giScaleHint}
          value={scales[key]}
          onChange={(value) => setScales((current) => ({ ...current, [key]: value }))}
        />
      ))}

      {severe ? (
        <p className="rounded-2xl bg-alert-subtle px-4 py-3 text-base text-alert" role="status">
          {COPY.giUrgent}
        </p>
      ) : null}

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

      <SymptomHistory rows={history} />
    </form>
  );
}
