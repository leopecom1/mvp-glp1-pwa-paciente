"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CheckInPill } from "@/components/CheckInPill";
import { DemoBanner } from "@/components/DemoBanner";
import { Disclaimer } from "@/components/Disclaimer";
import { EmptyState } from "@/components/EmptyState";
import { COPY } from "@/lib/copy";
import { displayName, useOnboarding } from "@/lib/onboarding";

export default function InicioPage() {
  const router = useRouter();
  const onboarding = useOnboarding();
  const name = displayName(onboarding);

  useEffect(() => {
    if (!onboarding.accepted) {
      router.replace("/aceptar");
      return;
    }
    if (!onboarding.profileComplete) {
      router.replace("/ficha");
    }
  }, [onboarding.accepted, onboarding.profileComplete, router]);

  return (
    <AppShell banner={<DemoBanner />} footer={<Disclaimer />}>
      <div className="space-y-3">
        <h1 className="font-display text-[2rem] leading-tight text-ink">
          {COPY.homeGreeting(name)}
        </h1>
        <p className="text-base text-muted">{COPY.homeLead}</p>
      </div>

      <div className="flex flex-col gap-3">
        <CheckInPill href="/check-in/dosis" title={COPY.pillDose} hint={COPY.pillDoseHint} />
        <CheckInPill href="/check-in/sintomas" title={COPY.pillGi} hint={COPY.pillGiHint} />
        <CheckInPill href="/check-in/peso" title={COPY.pillWeight} hint={COPY.pillWeightHint} />
      </div>

      <EmptyState title="Sin registros todavía">{COPY.homeEmpty}</EmptyState>

      <Link href="/ficha" className="min-h-11 text-base font-medium text-accent">
        {COPY.profileLink}
      </Link>
    </AppShell>
  );
}
