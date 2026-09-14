"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AlertBanners } from "@/components/AlertBanners";
import { CheckInPill } from "@/components/CheckInPill";
import { CheckInSummaryCards } from "@/components/CheckInSummaryCards";
import { DemoBanner } from "@/components/DemoBanner";
import { Disclaimer } from "@/components/Disclaimer";
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
    <AppShell banner={<DemoBanner />} footer={<Disclaimer />}>
      <AlertBanners />

      <div className="space-y-3">
        <h1 className="font-display text-[2rem] leading-tight text-ink">
          {COPY.homeGreeting(name)}
        </h1>
        <p className="text-base text-muted">{COPY.homeLead}</p>
      </div>

      <nav id="check-in" aria-label={COPY.checkInNav} className="flex scroll-mt-6 flex-col gap-4">
        <CheckInPill href="/check-in/dosis" title={COPY.pillDose} hint={COPY.pillDoseHint} />
        <CheckInPill href="/check-in/sintomas" title={COPY.pillGi} hint={COPY.pillGiHint} />
        <CheckInPill href="/check-in/peso" title={COPY.pillWeight} hint={COPY.pillWeightHint} />
      </nav>

      <CheckInPill
        href="/malestar"
        title={COPY.eaHomeLink}
        hint={COPY.eaHomeHint}
        tone="alert"
      />

      <CheckInSummaryCards />

      <Link href="/ficha" className="inline-flex min-h-11 items-center text-base font-medium text-accent">
        {COPY.profileLink}
      </Link>
    </AppShell>
  );
}
