"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  acceptInvite,
  ApiError,
  getTratamientoDatosVersion,
  isUsableInviteToken,
  localAcceptFallback,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { COPY } from "@/lib/copy";
import { getDefaultClinicName, isApiConfigured } from "@/lib/env";
import { patchOnboarding } from "@/lib/onboarding";
import { CONSENT_TYPE_TRATAMIENTO, type ConsentVersion } from "@/lib/types";
import { Card, Button, Eyebrow } from "./ui";

function errorCopy(kind: ApiError["kind"]): string {
  switch (kind) {
    case "auth":
      return COPY.needEmailLink;
    case "session_mismatch":
      return COPY.sessionMismatch;
    case "invalid_or_expired":
      return COPY.invalidOrExpired;
    case "missing_consent":
      return COPY.missingConsent;
    default:
      return COPY.genericError;
  }
}

export function AcceptConsentForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { session, loading, stub, refreshSession } = useAuth();

  const token = params.get("token")?.trim() || "";
  const clinicName = params.get("clinica")?.trim() || getDefaultClinicName();

  const [consent, setConsent] = useState<ConsentVersion | null>(null);
  const [acceptedConsent, setAcceptedConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      patchOnboarding({ inviteToken: token, clinicName });
    } else {
      patchOnboarding({ clinicName });
    }
  }, [token, clinicName]);

  useEffect(() => {
    let cancelled = false;
    getTratamientoDatosVersion(session?.accessToken ?? null).then((version) => {
      if (!cancelled) {
        setConsent(version);
        if (version.id) {
          patchOnboarding({ consentVersionId: version.id });
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [session?.accessToken]);

  const needsSession = !stub && !session;
  const tokenOk = isUsableInviteToken(token);
  const bodyParagraphs = useMemo(
    () => (consent?.bodyMd ?? "").split(/\n{2,}/).filter(Boolean),
    [consent],
  );

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!tokenOk) {
      setError(COPY.missingToken);
      return;
    }
    if (needsSession) {
      setError(COPY.needEmailLink);
      return;
    }
    if (!acceptedConsent) {
      setError(COPY.missingConsent);
      return;
    }

    setSubmitting(true);
    const payload = {
      token,
      consents: [
        {
          consentType: CONSENT_TYPE_TRATAMIENTO,
          ...(consent?.id ? { consentVersionId: consent.id } : {}),
        },
      ],
    };

    try {
      const result = isApiConfigured()
        ? await acceptInvite(session?.accessToken ?? null, payload)
        : localAcceptFallback();

      await refreshSession();
      patchOnboarding({
        inviteToken: token,
        clinicName,
        consentVersionId: consent?.id || null,
        accepted: true,
        membershipId: result.membershipId,
        orgId: result.orgId,
        role: result.role,
      });
      router.push("/ficha");
    } catch (caught) {
      if (stub || !isApiConfigured()) {
        const result = localAcceptFallback();
        patchOnboarding({
          inviteToken: token,
          clinicName,
          consentVersionId: consent?.id || null,
          accepted: true,
          membershipId: result.membershipId,
          orgId: result.orgId,
          role: result.role,
        });
        router.push("/ficha");
        return;
      }
      const kind = caught instanceof ApiError ? caught.kind : "unknown";
      setError(errorCopy(kind));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="space-y-3">
        <Eyebrow>{COPY.invitationEyebrow}</Eyebrow>
        <h1 className="font-display text-[2rem] leading-tight text-ink">
          {COPY.joinTitle(clinicName)}
        </h1>
        <p className="text-base text-muted">{COPY.joinLead}</p>
      </div>

      {loading ? (
        <p className="text-base text-muted">Preparando tu sesión…</p>
      ) : null}

      {needsSession ? (
        <Card className="bg-alert-subtle px-5 py-4 text-base text-alert">
          {COPY.needEmailLink}
        </Card>
      ) : null}

      {!tokenOk ? (
        <Card className="bg-alert-subtle px-5 py-4 text-base text-alert">
          {COPY.missingToken}
        </Card>
      ) : null}

      <Card className="overflow-hidden">
        <div className="space-y-3 px-5 py-5">
          <Eyebrow>{COPY.consentEyebrow}</Eyebrow>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl text-ink">
              {consent?.title ?? "Tratamiento de datos de salud"}
            </h2>
            <span className="rounded-full bg-accent-subtle px-3 py-1 text-sm font-medium text-accent">
              {COPY.consentTypeChip}
            </span>
          </div>
        </div>
        <div className="max-h-56 overflow-y-auto border-t border-border bg-surface-elevated px-5 py-4">
          <div className="space-y-3 text-base text-ink">
            {bodyParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Card>

      <label className="flex min-h-11 cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={acceptedConsent}
          onChange={(event) => setAcceptedConsent(event.target.checked)}
          className="mt-1 size-5 shrink-0 accent-[var(--color-accent)]"
        />
        <span className="text-base text-ink">{COPY.consentCheckbox}</span>
      </label>

      {error ? (
        <p className="rounded-2xl bg-alert-subtle px-4 py-3 text-base text-alert" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={submitting || !tokenOk || needsSession || !acceptedConsent}>
        {submitting ? COPY.accepting : COPY.acceptCta}
      </Button>
    </form>
  );
}
