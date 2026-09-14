"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createAdverseEvent } from "@/lib/api";
import { buildCreateAdverseEventRequest } from "@/lib/alerts";
import { useAuth } from "@/lib/auth";
import { COPY } from "@/lib/copy";
import { fromDateTimeLocal, toDateTimeLocal } from "@/lib/dates";
import { acceptPath, useClientReady, useOnboarding } from "@/lib/onboarding";
import type {
  AdverseEventAccion,
  AdverseEventSeveridad,
  PatientAdverseEventTipo,
} from "@/lib/types";
import {
  ADVERSE_EVENT_ACCION_VALUES,
  ADVERSE_EVENT_SEVERIDAD_VALUES,
  PATIENT_ADVERSE_EVENT_TIPO_VALUES,
} from "@/lib/types";
import { Button, ChoiceButton, Field, TextInput } from "./ui";

export function AdverseEventForm() {
  const router = useRouter();
  const { session } = useAuth();
  const onboarding = useOnboarding();
  const clientReady = useClientReady();
  const formId = useId();
  const [tipo, setTipo] = useState<PatientAdverseEventTipo>("gi_intolerable");
  const [severidad, setSeveridad] = useState<AdverseEventSeveridad>("p0");
  const [inicioAt, setInicioAt] = useState(() => toDateTimeLocal(new Date()));
  const [accion, setAccion] = useState<AdverseEventAccion>("contacto_clinica");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientReady) return;
    if (!onboarding.accepted) {
      router.replace(acceptPath());
      return;
    }
    if (!onboarding.profileComplete) {
      router.replace("/ficha");
    }
  }, [clientReady, onboarding.accepted, onboarding.profileComplete, router]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      await createAdverseEvent(
        session?.accessToken ?? null,
        buildCreateAdverseEventRequest({
          tipo,
          severidad,
          inicioAt: fromDateTimeLocal(inicioAt),
          accion,
        }),
      );
      setSaved(true);
    } catch {
      setError(COPY.genericError);
      return;
    } finally {
      setSaving(false);
    }
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    router.push("/inicio");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" aria-busy={saving}>
      <p className="rounded-2xl bg-alert-subtle px-4 py-3 text-base text-ink" role="note">
        {COPY.eaNotEmergency}
      </p>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-base font-medium text-ink">{COPY.eaTipo}</legend>
        <p className="text-base text-muted">{COPY.eaTipoHint}</p>
        {PATIENT_ADVERSE_EVENT_TIPO_VALUES.map((value) => (
          <ChoiceButton
            key={value}
            selected={tipo === value}
            tone={value === "gi_intolerable" ? "alert" : "accent"}
            onClick={() => setTipo(value)}
          >
            <span className="block font-medium">{COPY.eaTipos[value]}</span>
            <span className="mt-1 block text-base text-muted">
              {value === "gi_intolerable" ? COPY.eaTipos.gi_intolerableHint : COPY.eaTipos.otro_graveHint}
            </span>
          </ChoiceButton>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-base font-medium text-ink">{COPY.eaSeveridad}</legend>
        <p className="text-base text-muted">{COPY.eaSeveridadHint}</p>
        {ADVERSE_EVENT_SEVERIDAD_VALUES.map((value) => (
          <ChoiceButton
            key={value}
            selected={severidad === value}
            tone={value === "p0" ? "alert" : "accent"}
            onClick={() => setSeveridad(value)}
          >
            {COPY.eaSeveridades[value]}
          </ChoiceButton>
        ))}
      </fieldset>

      <Field label={COPY.eaInicio} htmlFor={`${formId}-inicio`}>
        <TextInput
          id={`${formId}-inicio`}
          type="datetime-local"
          value={inicioAt}
          onChange={(event) => setInicioAt(event.target.value)}
          required
        />
      </Field>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-base font-medium text-ink">{COPY.eaAccion}</legend>
        {ADVERSE_EVENT_ACCION_VALUES.map((value) => (
          <ChoiceButton
            key={value}
            selected={accion === value}
            tone={value === "urgencias" ? "alert" : "accent"}
            onClick={() => setAccion(value)}
          >
            {COPY.eaAcciones[value]}
          </ChoiceButton>
        ))}
      </fieldset>

      {error ? (
        <p className="rounded-2xl bg-alert-subtle px-4 py-3 text-base text-alert" role="alert">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="rounded-2xl bg-accent-subtle px-4 py-3 text-base text-ink" role="status">
          {COPY.eaSaved}
        </p>
      ) : null}

      <Button type="submit" variant="alert" disabled={saving}>
        {saving ? COPY.eaSubmitting : COPY.eaSubmit}
      </Button>
    </form>
  );
}
