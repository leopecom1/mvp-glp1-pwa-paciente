"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildPatientProfilePatch,
  getOrganization,
  getPatientProfile,
  patchPatientProfile,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { COPY } from "@/lib/copy";
import { getDefaultClinicName } from "@/lib/env";
import { acceptPath, patchOnboarding, useClientReady, useOnboarding } from "@/lib/onboarding";
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
  const clientReady = useClientReady();
  const formId = useId();
  const [draft, setDraft] = useState<{ firstName?: string; lastName?: string; phone?: string }>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstName = draft.firstName ?? onboarding.firstName;
  const lastName = draft.lastName ?? onboarding.lastName;
  const phone = draft.phone ?? onboarding.phone;
  const clinicName = onboarding.clinicName;
  const showClinic =
    Boolean(clinicName.trim()) && clinicName.trim() !== getDefaultClinicName();

  useEffect(() => {
    if (!clientReady) return;
    if (!onboarding.accepted) {
      router.replace(acceptPath());
    }
  }, [clientReady, onboarding.accepted, router]);

  useEffect(() => {
    let cancelled = false;
    const token = session?.accessToken ?? null;

    (async () => {
      const remote = await getPatientProfile(token);
      if (cancelled || !remote) return;

      const names = splitName(remote.fullName);
      setDraft((current) => ({
        firstName: current.firstName ?? names.firstName,
        lastName: current.lastName ?? names.lastName,
        phone: current.phone ?? remote.phoneE164 ?? undefined,
      }));

      const org = remote.orgId ? await getOrganization(token, remote.orgId) : null;
      patchOnboarding({
        careTeamAssigned: Boolean(remote.sedeId || remote.medicoResponsableMembershipId),
        ...(org?.name?.trim() ? { clinicName: org.name.trim() } : {}),
      });
    })();

    return () => {
      cancelled = true;
    };
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

    await patchPatientProfile(
      session?.accessToken ?? null,
      buildPatientProfilePatch({
        fullName,
        ...(phoneE164 ? { phoneE164 } : {}),
      }),
    );

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
    <form onSubmit={onSubmit} className="flex flex-col gap-6" aria-busy={saving}>
      <div className="space-y-3">
        <h1 className="font-display text-[2rem] leading-tight text-ink">{COPY.fichaTitle}</h1>
        <p className="text-base text-muted">{COPY.fichaLead}</p>
      </div>

      <Field label={COPY.firstName} htmlFor={`${formId}-first`}>
        <TextInput
          id={`${formId}-first`}
          value={firstName}
          onChange={(event) => setDraft((current) => ({ ...current, firstName: event.target.value }))}
          autoComplete="given-name"
          required
          aria-invalid={Boolean(error) && !firstName.trim()}
        />
      </Field>
      <Field label={COPY.lastName} htmlFor={`${formId}-last`}>
        <TextInput
          id={`${formId}-last`}
          value={lastName}
          onChange={(event) => setDraft((current) => ({ ...current, lastName: event.target.value }))}
          autoComplete="family-name"
          required
          aria-invalid={Boolean(error) && !lastName.trim()}
        />
      </Field>
      <Field label={COPY.phone} hint={COPY.phoneHint} htmlFor={`${formId}-phone`}>
        <TextInput
          id={`${formId}-phone`}
          value={phone}
          onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))}
          autoComplete="tel"
          inputMode="tel"
          placeholder="+593…"
        />
      </Field>
      <Field label={COPY.locale} htmlFor={`${formId}-locale`}>
        <select
          id={`${formId}-locale`}
          disabled
          value="es"
          aria-readonly="true"
          className="min-h-11 w-full rounded-2xl border border-border bg-surface-elevated px-4 text-base text-ink"
        >
          <option value="es">{COPY.localeEs}</option>
        </select>
      </Field>

      {showClinic || onboarding.careTeamAssigned ? (
        <Card className="px-5 py-5" aria-label={COPY.identityTitle}>
          <h2 className="font-display text-xl text-ink">{COPY.identityTitle}</h2>
          <p className="mt-2 text-base text-muted">{COPY.identityHint}</p>
          {showClinic ? (
            <dl className="mt-4 space-y-3">
              <div className="flex flex-col gap-1">
                <dt className="text-base text-muted">{COPY.identityClinic}</dt>
                <dd className="text-base text-ink">{clinicName}</dd>
              </div>
            </dl>
          ) : null}
          <p className="mt-3 text-base text-muted">{COPY.identityTeam}</p>
        </Card>
      ) : null}

      {error ? (
        <p id="ficha-error" className="rounded-2xl bg-alert-subtle px-4 py-3 text-base text-alert" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={saving} aria-describedby={error ? "ficha-error" : undefined}>
        {saving ? COPY.savingFicha : COPY.saveFicha}
      </Button>
    </form>
  );
}
