"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPatientProfile, patchPatientProfile } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { COPY } from "@/lib/copy";
import { patchOnboarding, useOnboarding } from "@/lib/onboarding";
import { Card, Button, Field, TextInput } from "./ui";

function splitName(fullName?: string | null): { firstName: string; lastName: string } {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

function toPhoneE164(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^\+[1-9]\d{1,14}$/.test(trimmed)) return trimmed;
  return undefined;
}

export function FichaForm() {
  const router = useRouter();
  const { session } = useAuth();
  const onboarding = useOnboarding();
  const [draft, setDraft] = useState<{ firstName?: string; lastName?: string; phone?: string }>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstName = draft.firstName ?? onboarding.firstName;
  const lastName = draft.lastName ?? onboarding.lastName;
  const phone = draft.phone ?? onboarding.phone;

  useEffect(() => {
    if (!onboarding.accepted) {
      router.replace("/aceptar");
    }
  }, [onboarding.accepted, router]);

  useEffect(() => {
    getPatientProfile(session?.accessToken ?? null).then((remote) => {
      if (!remote) return;
      const names = splitName(remote.fullName);
      setDraft((current) => ({
        firstName: current.firstName ?? names.firstName,
        lastName: current.lastName ?? names.lastName,
        phone: current.phone ?? remote.phoneE164 ?? undefined,
      }));
    });
  }, [session?.accessToken]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("Nombre y apellido son necesarios para tu ficha.");
      return;
    }

    setSaving(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const phoneE164 = toPhoneE164(phone);

    await patchPatientProfile(session?.accessToken ?? null, {
      fullName,
      ...(phoneE164 ? { phoneE164 } : {}),
    });

    patchOnboarding({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      locale: "es",
      profileComplete: true,
    });
    setSaving(false);
    router.push("/inicio");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="space-y-3">
        <h1 className="font-display text-[2rem] leading-tight text-ink">{COPY.fichaTitle}</h1>
        <p className="text-base text-muted">{COPY.fichaLead}</p>
      </div>

      <Field label={COPY.firstName}>
        <TextInput
          value={firstName}
          onChange={(event) => setDraft((current) => ({ ...current, firstName: event.target.value }))}
          autoComplete="given-name"
          required
        />
      </Field>
      <Field label={COPY.lastName}>
        <TextInput
          value={lastName}
          onChange={(event) => setDraft((current) => ({ ...current, lastName: event.target.value }))}
          autoComplete="family-name"
          required
        />
      </Field>
      <Field label={COPY.phone} hint={COPY.phoneHint}>
        <TextInput
          value={phone}
          onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))}
          autoComplete="tel"
          inputMode="tel"
          placeholder="+593…"
        />
      </Field>
      <Field label={COPY.locale}>
        <select
          disabled
          value="es"
          className="min-h-11 w-full rounded-2xl border border-border bg-surface-elevated px-4 text-base text-ink"
        >
          <option value="es">{COPY.localeEs}</option>
        </select>
      </Field>

      <Card className="px-5 py-5">
        <h2 className="font-display text-xl text-ink">{COPY.identityTitle}</h2>
        <p className="mt-2 text-base text-muted">{COPY.identityHint}</p>
        <dl className="mt-4 space-y-3">
          <div className="flex flex-col gap-1">
            <dt className="text-base text-muted">{COPY.identityClinic}</dt>
            <dd className="text-base text-ink">{onboarding.clinicName}</dd>
          </div>
        </dl>
        <p className="mt-3 text-base text-muted">{COPY.identityTeam}</p>
      </Card>

      {error ? (
        <p className="rounded-2xl bg-alert-subtle px-4 py-3 text-base text-alert" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={saving}>
        {saving ? COPY.savingFicha : COPY.saveFicha}
      </Button>
    </form>
  );
}
