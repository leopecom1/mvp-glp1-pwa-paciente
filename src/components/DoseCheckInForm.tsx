"use client";

import { useEffect, useId, useState } from "react";
import { createDoseLog, getMedicationPlan, listDoseLogs } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { DEMO_MEDICATION_PLAN } from "@/lib/checkin-demo";
import { COPY } from "@/lib/copy";
import { fromDateTimeLocal, parseDosisMgFromDoseLabel, toDateTimeLocal } from "@/lib/dates";
import { isApiConfigured } from "@/lib/env";
import type { DoseLog, MedicationPlan, MotivoOmision, SitioInyeccion } from "@/lib/types";
import { MOTIVO_OMISION_VALUES, SITIO_INYECCION_VALUES } from "@/lib/types";
import { DoseHistory } from "./CheckInHistory";
import { Button, Field, SelectInput, TextInput } from "./ui";

function siteNote(sitio?: SitioInyeccion | ""): string | undefined {
  if (!sitio) return undefined;
  return `Sitio: ${COPY.sitio[sitio]}`;
}

export function DoseCheckInForm() {
  const { session } = useAuth();
  const formId = useId();
  const [plan, setPlan] = useState<MedicationPlan | null>(
    isApiConfigured() ? null : DEMO_MEDICATION_PLAN,
  );
  const [aplicada, setAplicada] = useState(true);
  const [fechaHora, setFechaHora] = useState(() => toDateTimeLocal(new Date()));
  const [dosisMg, setDosisMg] = useState("");
  const [motivoOmision, setMotivoOmision] = useState<MotivoOmision | "">("");
  const [sitio, setSitio] = useState<SitioInyeccion | "">("");
  const [history, setHistory] = useState<DoseLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = session?.accessToken ?? null;
  const demo = !isApiConfigured();
  const prefilled = parseDosisMgFromDoseLabel(plan?.doseLabel);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [remotePlan, rows] = await Promise.all([
        getMedicationPlan(token),
        listDoseLogs(token),
      ]);
      if (cancelled) return;
      if (remotePlan) {
        setPlan(remotePlan);
        const mg = parseDosisMgFromDoseLabel(remotePlan.doseLabel);
        setDosisMg((current) => current || (mg != null ? String(mg) : ""));
      }
      setHistory(rows);
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    if (!aplicada && !motivoOmision) {
      setError(COPY.doseReasonHint);
      return;
    }

    const planId = plan?.id;
    if (!planId) {
      setError(COPY.doseNoPlan);
      return;
    }

    const parsedMg = dosisMg.trim() ? Number(dosisMg.replace(",", ".")) : prefilled;
    if (parsedMg != null && (!Number.isFinite(parsedMg) || parsedMg < 0.01 || parsedMg > 100)) {
      setError("Revisa la dosis en mg.");
      return;
    }

    setSaving(true);
    try {
      const row = await createDoseLog(token, {
        medicationPlanId: planId,
        aplicada,
        loggedAt: fromDateTimeLocal(fechaHora),
        ...(parsedMg != null ? { dosisMg: parsedMg } : {}),
        ...(!aplicada && motivoOmision ? { motivoOmision } : {}),
        ...(siteNote(sitio) ? { notaPaciente: siteNote(sitio) } : {}),
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
      {demo ? <p className="text-base text-muted">{COPY.doseDemoPlan}</p> : null}
      {!demo && !plan ? <p className="text-base text-muted">{COPY.doseNoPlan}</p> : null}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setAplicada(true)}
          aria-pressed={aplicada}
          className={`min-h-11 rounded-2xl border px-4 text-base font-medium ${
            aplicada
              ? "border-success-soft bg-success-soft text-white"
              : "border-border bg-surface text-ink"
          }`}
        >
          {COPY.doseApplied}
        </button>
        <button
          type="button"
          onClick={() => setAplicada(false)}
          aria-pressed={!aplicada}
          className={`min-h-11 rounded-2xl border px-4 text-base font-medium ${
            !aplicada ? "border-alert bg-alert text-white" : "border-border bg-surface text-ink"
          }`}
        >
          {COPY.doseMissed}
        </button>
      </div>
      <p className="text-base text-muted">{aplicada ? COPY.doseAppliedHint : COPY.doseMissedHint}</p>

      <Field label={COPY.doseWhen} htmlFor={`${formId}-when`}>
        <TextInput
          id={`${formId}-when`}
          type="datetime-local"
          value={fechaHora}
          onChange={(event) => setFechaHora(event.target.value)}
          required
        />
      </Field>

      <Field label={COPY.doseMg} hint={COPY.doseMgHint} htmlFor={`${formId}-mg`}>
        <TextInput
          id={`${formId}-mg`}
          type="number"
          inputMode="decimal"
          min={0.01}
          max={100}
          step={0.01}
          value={dosisMg}
          onChange={(event) => setDosisMg(event.target.value)}
          placeholder={prefilled != null ? String(prefilled) : "0.25"}
        />
      </Field>

      {!aplicada ? (
        <Field label={COPY.doseReason} hint={COPY.doseReasonHint} htmlFor={`${formId}-motivo`}>
          <SelectInput
            id={`${formId}-motivo`}
            value={motivoOmision}
            required
            onChange={(event) => setMotivoOmision(event.target.value as MotivoOmision | "")}
          >
            <option value="">Elige un motivo</option>
            {MOTIVO_OMISION_VALUES.map((value) => (
              <option key={value} value={value}>
                {COPY.motivo[value]}
              </option>
            ))}
          </SelectInput>
        </Field>
      ) : null}

      <Field label={COPY.doseSite} hint={COPY.doseSiteHint} htmlFor={`${formId}-sitio`}>
        <SelectInput
          id={`${formId}-sitio`}
          value={sitio}
          onChange={(event) => setSitio(event.target.value as SitioInyeccion | "")}
        >
          <option value="">No indicar</option>
          {SITIO_INYECCION_VALUES.map((value) => (
            <option key={value} value={value}>
              {COPY.sitio[value]}
            </option>
          ))}
        </SelectInput>
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

      <Button type="submit" disabled={saving || (!demo && !plan)}>
        {saving ? COPY.savingCheckIn : COPY.saveCheckIn}
      </Button>

      <DoseHistory rows={history} />
    </form>
  );
}
