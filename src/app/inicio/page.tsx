"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CheckInPill } from "@/components/CheckInPill";
import { Disclaimer } from "@/components/Disclaimer";
import { EmptyState } from "@/components/EmptyState";
import { COPY } from "@/lib/copy";
import { acceptPath, displayName, useClientReady, useOnboarding } from "@/lib/onboarding";

export default function InicioPage() {
  const router = useRouter();
  const onboarding = useOnboarding();
  const clientReady = useClientReady();
  const name = displayName(onboarding);

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

  return (
    <AppShell footer={<Disclaimer />}>
      <div className="space-y-3">
        <h1 className="font-display text-[2rem] leading-tight text-ink">
          {COPY.homeGreeting(name)}
        </h1>
        <p className="text-base text-muted">{COPY.homeLead}</p>
      </div>

      <nav aria-label="Check-in" className="flex flex-col gap-4">
        <CheckInPill href="/check-in/dosis" title={COPY.pillDose} hint={COPY.pillDoseHint} />
        <CheckInPill href="/check-in/sintomas" title={COPY.pillGi} hint={COPY.pillGiHint} />
        <CheckInPill href="/check-in/peso" title={COPY.pillWeight} hint={COPY.pillWeightHint} />
      </nav>

      <EmptyState title="Sin registros todavía">{COPY.homeEmpty}</EmptyState>

      <Link href="/ficha" className="inline-flex min-h-11 items-center text-base font-medium text-accent">
        {COPY.profileLink}
      </Link>
    </AppShell>
  );
}
