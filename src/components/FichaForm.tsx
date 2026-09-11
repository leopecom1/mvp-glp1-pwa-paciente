"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPatientProfile, patchPatientProfile } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { COPY } from "@/lib/copy";
import { patchOnboarding, useOnboarding } from "@/lib/onboarding";
import type { PatientProfile } from "@/lib/types";
import { Button, Card, Field, TextInput } from "./ui";

const LOCKED_KEYS = [
  { key: "organizationId", label: "organization_id" },
  { key: "membershipId", label: "membership_id" },
  { key: "medicoResponsableId", label: "medico_responsable_id" },
  { key: "sedeId", label: "sede_id" },
] as const;

function splitName(fullName?: string | null): { firstName: string; lastName: string } {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

function identityValue(
  profile: PatientProfile | null,
  local: ReturnType<typeof useOnboarding>,
  key: (typeof LOCKED_KEYS)[number]["key"],
) {
  if (key === "organizationId") {
    return profile?.organizationId ?? profile?.orgId ?? local.orgId;
  }
  if (key === "membershipId") {
    return profile?.membershipId ?? local.membershipId;
  }
  if (key === "medicoResponsableId") {
    return profile?.medicoResponsableId ?? profile?.medicoResponsableMembershipId;
  }
  return profile?.sedeId;
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
  const [profile, setProfile] = useState<PatientProfile | null>(null);
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
      setProfile(remote);
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

  const locked = LOCKED_KEYS.map((item) => ({
    ...item,
    value: identityValue(profile, onboarding, item.key),
  })).filter((item) => item.value);

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
        <p className="mt-2 text-sm text-muted">{COPY.identityHint}</p>
        <dl className="mt-4 space-y-3">
          {locked.length === 0 ? (
            <p className="text-sm text-muted">
              Tu clínica asignará organización, membership, médico responsable y sede. No aparecen como campos editables.
            </p>
          ) : (
            locked.map((item) => (
              <div key={item.key} className="flex flex-col gap-1">
                <dt className="text-sm text-muted">{item.label}</dt>
                <dd className="break-all font-mono text-sm tabular-nums text-ink">{item.value}</dd>
              </div>
            ))
          )}
        </dl>
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
